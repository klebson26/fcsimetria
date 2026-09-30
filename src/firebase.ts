import { initializeApp, getApps } from 'firebase/app';
import { initializeFirestore, getFirestore, doc, getDoc } from 'firebase/firestore';
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
  }, databaseId);
} catch {
  firestoreInstance = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
}

export const db = firestoreInstance;
export const auth = getAuth(app);

// Safe connectivity checker without forcing network errors
export async function testConnection(): Promise<boolean> {
  try {
    await getDoc(doc(db, 'identidade', 'configuracao'));
    return true;
  } catch (error) {
    console.debug('Firestore connectivity notice:', error);
    return false;
  }
}
