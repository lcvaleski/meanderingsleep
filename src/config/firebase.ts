import { getAuth, signInWithEmailAndPassword as firebaseSignIn, createUserWithEmailAndPassword as firebaseCreateUser, signOut as firebaseSignOut } from '@react-native-firebase/auth';

// Initialize Firebase Auth
export const initializeFirebase = () => {
  // Firebase is automatically initialized when the app starts
  // This function can be used to add any additional initialization logic
};

// Authentication functions
export const signInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const auth = getAuth();
    const userCredential = await firebaseSignIn(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const createUserWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const auth = getAuth();
    const userCredential = await firebaseCreateUser(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    const auth = getAuth();
    await firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  const auth = getAuth();
  return auth.currentUser;
}; 