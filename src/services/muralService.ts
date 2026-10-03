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

const IDB_NAME = 'simetria_mural_db';
const IDB_STORE = 'mural_fotos_store';
const IDB_VERSION = 1;
const STORAGE_KEY_MURAL_FALLBACK = 'simetria_mural_cache_v2';

// In-memory cache for ultra-fast synchronous access
let cachedFotos: FotoMural[] = [];
let isInitialized = false;
const listeners = new Set<(fotos: FotoMural[]) => void>();

// Open IndexedDB database with fallback
function openIndexedDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

// Save all photos to IndexedDB
async function saveToIndexedDB(fotos: FotoMural[]): Promise<void> {
  const idb = await openIndexedDB();
  if (!idb) return;

  return new Promise((resolve) => {
    try {
      const tx = idb.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      store.clear();
      fotos.forEach((foto) => {
        store.put(foto);
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

// Load all photos from IndexedDB
async function loadFromIndexedDB(): Promise<FotoMural[]> {
  const idb = await openIndexedDB();
  if (!idb) return [];

  return new Promise((resolve) => {
    try {
      const tx = idb.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.getAll();
      req.onsuccess = () => {
        const result = (req.result as FotoMural[]) || [];
        resolve(result.sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()));
      };
      req.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

// Fallback to localStorage without throwing QuotaExceededError
function saveToLocalStorageSafe(fotos: FotoMural[]) {
  try {
    // Only store lightweight metadata or sample if too large
    localStorage.setItem(STORAGE_KEY_MURAL_FALLBACK, JSON.stringify(fotos));
  } catch (err) {
    console.debug('LocalStorage quota reached, using IndexedDB and Firestore exclusively.');
  }
}

function loadFromLocalStorage(): FotoMural[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MURAL_FALLBACK) || localStorage.getItem('simetria_sp_mural_fotos');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

// Notify subscribers of photo changes
function notifySubscribers() {
  listeners.forEach((listener) => {
    try {
      listener([...cachedFotos]);
    } catch (err) {
      console.warn('Erro no listener do mural:', err);
    }
  });
}

// Update cache and persist to local stores
function updateMemoryAndLocalStores(fotos: FotoMural[]) {
  cachedFotos = [...fotos].sort(
    (a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
  );
  saveToIndexedDB(cachedFotos).catch(() => {});
  saveToLocalStorageSafe(cachedFotos);
  notifySubscribers();
}

// Initialize and setup real-time cloud Firestore sync
export function initMuralService(): void {
  if (isInitialized) return;
  isInitialized = true;

  // 1. Immediate synchronous load from localStorage for zero flicker
  const localInitial = loadFromLocalStorage();
  if (localInitial.length > 0) {
    cachedFotos = localInitial;
  } else {
    cachedFotos = [...INITIAL_MURAL_FOTOS];
  }

  // 2. Asynchronously load from IndexedDB
  loadFromIndexedDB().then((idbFotos) => {
    if (idbFotos.length > 0) {
      cachedFotos = idbFotos;
      notifySubscribers();
    }
  });

  // 3. Connect to Google Cloud Firestore with real-time onSnapshot
  if (db) {
    try {
      const colRef = collection(db, 'mural_fotos');
      const q = query(colRef, orderBy('dataCriacao', 'desc'));

      onSnapshot(
        q,
        async (snapshot) => {
          if (!snapshot.empty) {
            const remoteFotos: FotoMural[] = [];
            snapshot.forEach((docItem) => {
              remoteFotos.push({ id: docItem.id, ...(docItem.data() as Omit<FotoMural, 'id'>) });
            });
            updateMemoryAndLocalStores(remoteFotos);
          } else {
            // First time seeding Firestore if cloud collection is empty
            const toSeed = cachedFotos.length > 0 ? cachedFotos : INITIAL_MURAL_FOTOS;
            for (const f of toSeed) {
              await setDoc(doc(db, 'mural_fotos', f.id), f).catch(() => {});
            }
          }
        },
        (err) => {
          console.debug('Firestore mural snapshot fallback local/offline:', err);
        }
      );
    } catch (err) {
      console.debug('Erro ao configurar listener do mural Firestore:', err);
    }
  }
}

// Auto-boot initializer
if (typeof window !== 'undefined') {
  initMuralService();
}

// Synchronous getter for instant React state
export function getMuralFotos(): FotoMural[] {
  if (cachedFotos.length > 0) {
    return cachedFotos;
  }
  const local = loadFromLocalStorage();
  if (local.length > 0) {
    cachedFotos = local;
    return cachedFotos;
  }
  return INITIAL_MURAL_FOTOS;
}

// Subscribe to real-time changes
export function subscribeMuralFotos(listener: (fotos: FotoMural[]) => void): () => void {
  listeners.add(listener);
  // Send current cached photos immediately
  listener([...cachedFotos]);

  return () => {
    listeners.delete(listener);
  };
}

// Add new photo with full Cloud Firestore + Local IndexedDB persistence
export async function addFotoMural(
  fotoData: Omit<FotoMural, 'id' | 'curtidas' | 'dataCriacao'>
): Promise<FotoMural> {
  const novaFoto: FotoMural = {
    ...fotoData,
    id: 'mural_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    curtidas: 0,
    dataCriacao: new Date().toISOString()
  };

  // 1. Immediately update cache and local IndexedDB store
  const updated = [novaFoto, ...cachedFotos];
  updateMemoryAndLocalStores(updated);

  // 2. Persist to Cloud Firestore individual document
  if (db) {
    try {
      const docRef = doc(db, 'mural_fotos', novaFoto.id);
      await setDoc(docRef, novaFoto);
    } catch (err) {
      console.warn('Erro ao salvar foto no Firestore, mantido em cache local seguro:', err);
    }
  }

  return novaFoto;
}

// Like photo with atomic Firestore increment
export async function likeFotoMural(id: string): Promise<number> {
  let novoTotal = 0;
  const updated = cachedFotos.map((f) => {
    if (f.id === id) {
      novoTotal = (f.curtidas || 0) + 1;
      return { ...f, curtidas: novoTotal };
    }
    return f;
  });

  updateMemoryAndLocalStores(updated);

  if (db) {
    try {
      const docRef = doc(db, 'mural_fotos', id);
      await updateDoc(docRef, { curtidas: increment(1) });
    } catch (err) {
      console.debug('Erro ao enviar curtida para o Firestore:', err);
    }
  }

  return novoTotal;
}

// Delete photo from Firestore & Local Stores
export async function deleteFotoMural(id: string): Promise<void> {
  const updated = cachedFotos.filter((f) => f.id !== id);
  updateMemoryAndLocalStores(updated);

  if (db) {
    try {
      const docRef = doc(db, 'mural_fotos', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Erro ao deletar foto do Firestore:', err);
    }
  }
}
