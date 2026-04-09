import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// We'll initialize lazily to avoid build-time resolution issues with the config file
let app: any;
let auth: any;
let db: any;
const googleProvider = new GoogleAuthProvider();

async function getFirebase() {
  if (!app) {
    const response = await fetch('/firebase-applet-config.json');
    const firebaseConfig = await response.json();
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
  return { app, auth, db };
}

export const getDb = async () => (await getFirebase()).db;
export const getAuthInstance = async () => (await getFirebase()).auth;

export const loginWithGoogle = async () => {
  const { auth } = await getFirebase();
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error logging in with Google:", error);
    throw error;
  }
};

export const logout = async () => {
  const { auth } = await getFirebase();
  return signOut(auth);
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export async function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const { auth } = await getFirebase();
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
