import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  increment,
  updateDoc
} from 'firebase/firestore';
import { FotoMural } from '../types/database';
import { INITIAL_MURAL_FOTOS } from '../data/initialData';

export interface FotoMuralLixeira extends FotoMural {
  dataExclusao: string;
}

const IDB_NAME = 'simetria_mural_db_v2';
const IDB_STORE_FOTOS = 'mural_fotos_store';
const IDB_STORE_LIXEIRA = 'mural_lixeira_store';
const IDB_VERSION = 2;

const STORAGE_KEY_MURAL_CACHE = 'simetria_mural_cache_v3';
const STORAGE_KEY_LIXEIRA_CACHE = 'simetria_mural_lixeira_cache_v3';

// In-memory caches for instant zero-latency UI
let cachedFotos: FotoMural[] = [];
let cachedLixeira: FotoMuralLixeira[] = [];
let isInitialized = false;

const fotosListeners = new Set<(fotos: FotoMural[]) => void>();
const lixeiraListeners = new Set<(fotos: FotoMuralLixeira[]) => void>();

// Open IndexedDB with 2 stores (Active photos + Recycle Bin)
function openIndexedDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(IDB_STORE_FOTOS)) {
          db.createObjectStore(IDB_STORE_FOTOS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(IDB_STORE_LIXEIRA)) {
          db.createObjectStore(IDB_STORE_LIXEIRA, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

// IndexedDB generic helpers
async function saveStoreToIndexedDB(storeName: string, items: any[]): Promise<void> {
  const idb = await openIndexedDB();
  if (!idb) return;

  return new Promise((resolve) => {
    try {
      const tx = idb.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.clear();
      items.forEach((item) => store.put(item));
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

async function loadStoreFromIndexedDB<T>(storeName: string): Promise<T[]> {
  const idb = await openIndexedDB();
  if (!idb) return [];

  return new Promise((resolve) => {
    try {
      const tx = idb.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as T[]) || []);
      req.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

function notifyFotosSubscribers() {
  fotosListeners.forEach((listener) => {
    try {
      listener([...cachedFotos]);
    } catch (err) {
      console.warn('Erro listener fotos:', err);
    }
  });
}

function notifyLixeiraSubscribers() {
  lixeiraListeners.forEach((listener) => {
    try {
      listener([...cachedLixeira]);
    } catch (err) {
      console.warn('Erro listener lixeira:', err);
    }
  });
}

function saveLocalStorageSafe(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

function loadLocalStorageSafe<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultValue;
}

// Initialize service and start Firestore real-time listeners
export function initMuralService(): void {
  if (isInitialized) return;
  isInitialized = true;

  // 1. Initial quick load from local storage
  const localFotos = loadLocalStorageSafe<FotoMural[]>(STORAGE_KEY_MURAL_CACHE, []);
  const localLixeira = loadLocalStorageSafe<FotoMuralLixeira[]>(STORAGE_KEY_LIXEIRA_CACHE, []);

  if (localFotos.length > 0) {
    cachedFotos = localFotos;
  } else {
    cachedFotos = [...INITIAL_MURAL_FOTOS];
  }
  cachedLixeira = localLixeira;

  // 2. Load from IndexedDB
  loadStoreFromIndexedDB<FotoMural>(IDB_STORE_FOTOS).then((idbFotos) => {
    if (idbFotos.length > 0) {
      cachedFotos = idbFotos.sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());
      notifyFotosSubscribers();
    }
  });

  loadStoreFromIndexedDB<FotoMuralLixeira>(IDB_STORE_LIXEIRA).then((idbLixeira) => {
    if (idbLixeira.length > 0) {
      cachedLixeira = idbLixeira.sort((a, b) => new Date(b.dataExclusao).getTime() - new Date(a.dataExclusao).getTime());
      notifyLixeiraSubscribers();
    }
  });

  // 3. Connect to Firestore for active photos
  if (db) {
    try {
      const fotosCol = collection(db, 'mural_fotos');
      const qFotos = query(fotosCol, orderBy('dataCriacao', 'desc'));

      onSnapshot(
        qFotos,
        async (snapshot) => {
          if (!snapshot.empty) {
            const remoteFotos: FotoMural[] = [];
            snapshot.forEach((docItem) => {
              remoteFotos.push({ id: docItem.id, ...(docItem.data() as Omit<FotoMural, 'id'>) });
            });
            cachedFotos = remoteFotos;
            saveStoreToIndexedDB(IDB_STORE_FOTOS, cachedFotos).catch(() => {});
            saveLocalStorageSafe(STORAGE_KEY_MURAL_CACHE, cachedFotos);
            notifyFotosSubscribers();
          } else {
            // Firestore collection is currently empty: Auto-restore initial photos!
            await restoreAllInitialPhotos();
          }
        },
        (err) => {
          console.debug('Firestore fotos listener fallback offline:', err);
        }
      );

      // Connect to Firestore for Lixeira / Recycle bin
      const lixeiraCol = collection(db, 'mural_lixeira');
      const qLixeira = query(lixeiraCol, orderBy('dataExclusao', 'desc'));

      onSnapshot(
        qLixeira,
        (snapshot) => {
          const remoteLixeira: FotoMuralLixeira[] = [];
          snapshot.forEach((docItem) => {
            remoteLixeira.push({ id: docItem.id, ...(docItem.data() as Omit<FotoMuralLixeira, 'id'>) });
          });
          cachedLixeira = remoteLixeira;
          saveStoreToIndexedDB(IDB_STORE_LIXEIRA, cachedLixeira).catch(() => {});
          saveLocalStorageSafe(STORAGE_KEY_LIXEIRA_CACHE, cachedLixeira);
          notifyLixeiraSubscribers();
        },
        (err) => {
          console.debug('Firestore lixeira listener fallback offline:', err);
        }
      );
    } catch (err) {
      console.debug('Erro ao configurar listeners do Firestore:', err);
    }
  }
}

if (typeof window !== 'undefined') {
  initMuralService();
}

// Getters
export function getMuralFotos(): FotoMural[] {
  if (cachedFotos.length > 0) return cachedFotos;
  return INITIAL_MURAL_FOTOS;
}

export function getLixeiraFotos(): FotoMuralLixeira[] {
  return cachedLixeira;
}

// Subscriptions
export function subscribeMuralFotos(listener: (fotos: FotoMural[]) => void): () => void {
  fotosListeners.add(listener);
  listener([...cachedFotos]);
  return () => {
    fotosListeners.delete(listener);
  };
}

export function subscribeLixeiraFotos(listener: (fotos: FotoMuralLixeira[]) => void): () => void {
  lixeiraListeners.add(listener);
  listener([...cachedLixeira]);
  return () => {
    lixeiraListeners.delete(listener);
  };
}

// Add new photo
export async function addFotoMural(
  fotoData: Omit<FotoMural, 'id' | 'curtidas' | 'dataCriacao'>
): Promise<FotoMural> {
  const novaFoto: FotoMural = {
    ...fotoData,
    id: 'mural_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    curtidas: 0,
    dataCriacao: new Date().toISOString()
  };

  cachedFotos = [novaFoto, ...cachedFotos];
  saveStoreToIndexedDB(IDB_STORE_FOTOS, cachedFotos).catch(() => {});
  saveLocalStorageSafe(STORAGE_KEY_MURAL_CACHE, cachedFotos);
  notifyFotosSubscribers();

  if (db) {
    try {
      const docRef = doc(db, 'mural_fotos', novaFoto.id);
      await setDoc(docRef, novaFoto);
    } catch (err) {
      console.warn('Erro ao salvar foto no Firestore:', err);
    }
  }

  return novaFoto;
}

// Like photo
export async function likeFotoMural(id: string): Promise<number> {
  let novoTotal = 0;
  cachedFotos = cachedFotos.map((f) => {
    if (f.id === id) {
      novoTotal = (f.curtidas || 0) + 1;
      return { ...f, curtidas: novoTotal };
    }
    return f;
  });

  saveStoreToIndexedDB(IDB_STORE_FOTOS, cachedFotos).catch(() => {});
  saveLocalStorageSafe(STORAGE_KEY_MURAL_CACHE, cachedFotos);
  notifyFotosSubscribers();

  if (db) {
    try {
      const docRef = doc(db, 'mural_fotos', id);
      await updateDoc(docRef, { curtidas: increment(1) });
    } catch (err) {
      console.debug('Erro ao registrar like:', err);
    }
  }

  return novoTotal;
}

// SOFT DELETE: Move to mural_lixeira instead of permanent loss
export async function deleteFotoMural(id: string): Promise<FotoMuralLixeira | null> {
  const fotoParaExcluir = cachedFotos.find((f) => f.id === id);
  if (!fotoParaExcluir) return null;

  const itemLixeira: FotoMuralLixeira = {
    ...fotoParaExcluir,
    dataExclusao: new Date().toISOString()
  };

  // 1. Remove from active photos
  cachedFotos = cachedFotos.filter((f) => f.id !== id);
  saveStoreToIndexedDB(IDB_STORE_FOTOS, cachedFotos).catch(() => {});
  saveLocalStorageSafe(STORAGE_KEY_MURAL_CACHE, cachedFotos);
  notifyFotosSubscribers();

  // 2. Add to lixeira
  cachedLixeira = [itemLixeira, ...cachedLixeira];
  saveStoreToIndexedDB(IDB_STORE_LIXEIRA, cachedLixeira).catch(() => {});
  saveLocalStorageSafe(STORAGE_KEY_LIXEIRA_CACHE, cachedLixeira);
  notifyLixeiraSubscribers();

  // 3. Sync with Firestore
  if (db) {
    try {
      // Add to mural_lixeira
      await setDoc(doc(db, 'mural_lixeira', id), itemLixeira);
      // Remove from mural_fotos
      await deleteDoc(doc(db, 'mural_fotos', id));
    } catch (err) {
      console.warn('Erro ao mover foto para a lixeira no Firestore:', err);
    }
  }

  return itemLixeira;
}

// RESTORE: Move back from lixeira to active mural
export async function restoreFotoFromLixeira(id: string): Promise<FotoMural | null> {
  const fotoParaRestaurar = cachedLixeira.find((f) => f.id === id);
  if (!fotoParaRestaurar) return null;

  const { dataExclusao, ...fotoAtiva } = fotoParaRestaurar;

  // 1. Remove from lixeira
  cachedLixeira = cachedLixeira.filter((f) => f.id !== id);
  saveStoreToIndexedDB(IDB_STORE_LIXEIRA, cachedLixeira).catch(() => {});
  saveLocalStorageSafe(STORAGE_KEY_LIXEIRA_CACHE, cachedLixeira);
  notifyLixeiraSubscribers();

  // 2. Add back to active photos
  cachedFotos = [fotoAtiva, ...cachedFotos].sort(
    (a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
  );
  saveStoreToIndexedDB(IDB_STORE_FOTOS, cachedFotos).catch(() => {});
  saveLocalStorageSafe(STORAGE_KEY_MURAL_CACHE, cachedFotos);
  notifyFotosSubscribers();

  // 3. Sync with Firestore
  if (db) {
    try {
      await setDoc(doc(db, 'mural_fotos', id), fotoAtiva);
      await deleteDoc(doc(db, 'mural_lixeira', id));
    } catch (err) {
      console.warn('Erro ao restaurar foto no Firestore:', err);
    }
  }

  return fotoAtiva;
}

// RECOVER ALL DELETED / INITIAL PHOTOS: Restores any missing fair photos
export async function restoreAllInitialPhotos(): Promise<number> {
  let restoredCount = 0;
  const existingIds = new Set(cachedFotos.map((f) => f.id));

  for (const foto of INITIAL_MURAL_FOTOS) {
    if (!existingIds.has(foto.id)) {
      cachedFotos = [foto, ...cachedFotos];
      existingIds.add(foto.id);
      restoredCount += 1;

      if (db) {
        try {
          await setDoc(doc(db, 'mural_fotos', foto.id), foto);
          // If it was in lixeira, remove from lixeira
          await deleteDoc(doc(db, 'mural_lixeira', foto.id)).catch(() => {});
        } catch {}
      }
    }
  }

  // Also remove from cached lixeira if any initial photos were in lixeira
  cachedLixeira = cachedLixeira.filter((l) => !existingIds.has(l.id));

  cachedFotos.sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());
  saveStoreToIndexedDB(IDB_STORE_FOTOS, cachedFotos).catch(() => {});
  saveLocalStorageSafe(STORAGE_KEY_MURAL_CACHE, cachedFotos);
  saveStoreToIndexedDB(IDB_STORE_LIXEIRA, cachedLixeira).catch(() => {});
  saveLocalStorageSafe(STORAGE_KEY_LIXEIRA_CACHE, cachedLixeira);

  notifyFotosSubscribers();
  notifyLixeiraSubscribers();

  return restoredCount;
}

// Permanently delete from lixeira
export async function permanentlyDeleteFromLixeira(id: string): Promise<void> {
  cachedLixeira = cachedLixeira.filter((f) => f.id !== id);
  saveStoreToIndexedDB(IDB_STORE_LIXEIRA, cachedLixeira).catch(() => {});
  saveLocalStorageSafe(STORAGE_KEY_LIXEIRA_CACHE, cachedLixeira);
  notifyLixeiraSubscribers();

  if (db) {
    try {
      await deleteDoc(doc(db, 'mural_lixeira', id));
    } catch {}
  }
}

// Empty entire lixeira
export async function emptyLixeira(): Promise<void> {
  const ids = cachedLixeira.map((f) => f.id);
  cachedLixeira = [];
  saveStoreToIndexedDB(IDB_STORE_LIXEIRA, []).catch(() => {});
  saveLocalStorageSafe(STORAGE_KEY_LIXEIRA_CACHE, []);
  notifyLixeiraSubscribers();

  if (db) {
    for (const id of ids) {
      await deleteDoc(doc(db, 'mural_lixeira', id)).catch(() => {});
    }
  }
}
