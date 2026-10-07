import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { AccountProduct, PlacedOrder, UserProfile, RegisteredUser } from './types/index.ts';

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export { onAuthStateChanged };
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with configured database ID
export const db: Firestore = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// Connection test as required by Firebase integration guidelines
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Connection to Firestore established successfully.');
    return true;
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client appears offline or firestore connecting...');
    }
    return false;
  }
}

testFirestoreConnection().catch(console.error);

// STRICT SINGLE ADMIN RULE: ONLY ballakparank08@gmail.com is Admin
export const SOLE_ADMIN_EMAIL = 'ballakparank08@gmail.com';

export function checkIsAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === SOLE_ADMIN_EMAIL.toLowerCase();
}

// User Profile sync in Firestore (Balance system removed)
export async function syncUserWithFirestore(fbUser: FirebaseUser): Promise<UserProfile> {
  const isAdmin = checkIsAdmin(fbUser.email);
  const userRef = doc(db, 'users', fbUser.uid);
  
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      const updatedProfile: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || data.displayName || data.name || (fbUser.email ? fbUser.email.split('@')[0] : 'User'),
        email: fbUser.email || data.email || '',
        role: isAdmin ? 'admin' : 'customer', // Single admin rule enforced
        status: data.status || 'active',
      };
      await setDoc(userRef, {
        uid: fbUser.uid,
        email: updatedProfile.email,
        displayName: updatedProfile.name,
        role: updatedProfile.role,
        status: updatedProfile.status,
        lastLoginAt: new Date().toISOString(),
      }, { merge: true });
      return updatedProfile;
    } else {
      const newProfile: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'User'),
        email: fbUser.email || '',
        role: isAdmin ? 'admin' : 'customer',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      await setDoc(userRef, {
        uid: fbUser.uid,
        email: newProfile.email,
        displayName: newProfile.name,
        photoURL: fbUser.photoURL || '',
        role: newProfile.role,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      });
      return newProfile;
    }
  } catch (err) {
    console.warn('[Firestore] Error syncing user profile, using fallback:', err);
    return {
      id: fbUser.uid,
      name: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'User'),
      email: fbUser.email || '',
      role: isAdmin ? 'admin' : 'customer',
      status: 'active',
    };
  }
}

// User Registration with Email and Password
export async function registerWithEmailPassword(
  email: string,
  pass: string,
  displayName: string
): Promise<{ user: FirebaseUser; profile: UserProfile }> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    const profile = await syncUserWithFirestore(cred.user);
    return { user: cred.user, profile };
  } catch (err: any) {
    console.error('[Firebase Auth] Registration error:', err);
    throw err;
  }
}

// User Sign In with Email and Password
export async function loginWithEmailPassword(
  email: string,
  pass: string
): Promise<{ user: FirebaseUser; profile: UserProfile; isAdmin: boolean }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const profile = await syncUserWithFirestore(cred.user);
    const isAdmin = checkIsAdmin(cred.user.email);
    return { user: cred.user, profile, isAdmin };
  } catch (err: any) {
    console.error('[Firebase Auth] Login error:', err);
    throw err;
  }
}

// Google Sign-In with Firebase Auth
export async function signInWithGoogleFirebase(): Promise<{
  user: FirebaseUser;
  profile: UserProfile;
  isAdmin: boolean;
}> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const profile = await syncUserWithFirestore(cred.user);
    const isAdmin = checkIsAdmin(cred.user.email);
    return { user: cred.user, profile, isAdmin };
  } catch (err: any) {
    console.error('[Firebase Auth Error] Google sign-in error:', err);
    throw err;
  }
}

// Sign out from Firebase
export async function signOutFirebase(): Promise<void> {
  await signOut(auth);
}

// Admin Management System: Fetch all registered users
export async function fetchRegisteredUsers(): Promise<RegisteredUser[]> {
  try {
    const usersCol = collection(db, 'users');
    const snap = await getDocs(usersCol);
    const list: RegisteredUser[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      const email = data.email || '';
      const isAdmin = checkIsAdmin(email);
      list.push({
        uid: docSnap.id,
        email,
        displayName: data.displayName || data.name || email.split('@')[0] || 'User',
        photoURL: data.photoURL,
        role: isAdmin ? 'admin' : 'customer', // Strict single admin rule
        createdAt: data.createdAt || new Date().toISOString(),
        lastLoginAt: data.lastLoginAt || new Date().toISOString(),
        status: data.status || 'active',
        ordersCount: data.ordersCount || 0,
        totalSpent: data.totalSpent || 0,
      });
    });

    // Make sure the sole admin ballakparank08@gmail.com is listed at the top
    const adminIdx = list.findIndex((u) => u.email.toLowerCase() === SOLE_ADMIN_EMAIL.toLowerCase());
    if (adminIdx === -1) {
      list.unshift({
        uid: 'adm-ballakparank08',
        email: SOLE_ADMIN_EMAIL,
        displayName: 'Sole Administrator (Bodia Tech Root)',
        role: 'admin',
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        lastLoginAt: new Date().toISOString(),
        status: 'active',
      });
    }

    return list;
  } catch (err) {
    console.warn('[Firestore] Error fetching registered users:', err);
    return [
      {
        uid: 'adm-ballakparank08',
        email: SOLE_ADMIN_EMAIL,
        displayName: 'Sole Administrator (Bodia Tech Root)',
        role: 'admin',
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        lastLoginAt: new Date().toISOString(),
        status: 'active',
      },
    ];
  }
}

// Admin Management System: Update user status (Active / Suspended)
export async function updateUserStatusInFirestore(
  uid: string,
  status: 'active' | 'suspended'
): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { status });
  } catch (err) {
    console.warn('[Firestore] Could not update user status:', err);
  }
}

// Firestore Orders persistence
export async function saveOrderToFirestore(order: PlacedOrder, userUid?: string): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, {
      ...order,
      customerUid: userUid || '',
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('[Firestore] Could not save order to Firestore:', e);
  }
}

// Firestore Products persistence
export async function saveProductToFirestore(product: AccountProduct): Promise<void> {
  try {
    const prodRef = doc(db, 'products', product.id);
    await setDoc(prodRef, product, { merge: true });
  } catch (e) {
    console.warn('[Firestore] Could not save product to Firestore:', e);
  }
}
