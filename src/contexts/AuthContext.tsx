import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged, FirebaseAuthTypes } from '@react-native-firebase/auth';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '../config/firebase';
import { GoogleSignin, User } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

// Initialize Google Sign-In
GoogleSignin.configure({
  webClientId: '19411767388-h51prlnnii7or8cle558l7kqa879gfvn.apps.googleusercontent.com',
  offlineAccess: true,
  scopes: ['profile', 'email'],
});

interface AuthContextData {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
  
      const userInfo = await GoogleSignin.signIn();
  
      const { idToken } = await GoogleSignin.getTokens();
  
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
      const userCredential = await auth().signInWithCredential(googleCredential);
    } catch (error: any) {
      console.error('Google Sign In Error:', {
        code: error.code,
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  };   

  const logout = async () => {
    try {
      await signOut();
      await GoogleSignin.signOut();
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logout, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 