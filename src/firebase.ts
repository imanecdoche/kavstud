import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';
import firebaseConfigJson from '../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with custom databaseId if provided
let dbInstance;
try {
  if (firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId.trim() !== '') {
    dbInstance = getFirestore(app, firebaseConfigJson.firestoreDatabaseId.trim());
  } else {
    dbInstance = getFirestore(app);
  }
} catch (error) {
  console.error("Failed to initialize Firestore with custom databaseId, falling back to default database:", error);
  dbInstance = getFirestore(app);
}

export const db = dbInstance;

// Initialize Storage
export const storage = getStorage(app);

// Initialize Messaging (only if supported by browser)
export let messaging: any = null;
isSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(app);
  }
}).catch(console.error);
