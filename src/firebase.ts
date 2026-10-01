import { initializeApp, getApps } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  getDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const databaseId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  }, databaseId);
} catch {
  try {
    firestoreInstance = initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true
    }, databaseId);
  } catch {
    firestoreInstance = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
  }
}

export const db = firestoreInstance;
export const auth = getAuth(app);

// Safe connectivity checker with timeout to prevent hanging or throwing unavailable errors
export async function testConnection(): Promise<boolean> {
  try {
    const fetchPromise = getDoc(doc(db, 'feira_dados', 'identidade'));
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout')), 3000)
    );
    await Promise.race([fetchPromise, timeoutPromise]);
    return true;
  } catch {
    console.debug('Firestore operating in local/offline mode.');
    return false;
  }
}
