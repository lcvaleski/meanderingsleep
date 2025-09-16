import React, { createContext, useState, useEffect, useContext } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import RevenueCatService from '../services/RevenueCatService';
import { AnalyticsService } from '../services';

interface AuthContextData {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: '19411767388-h51prlnnii7or8cle558l7kqa879gfvn.apps.googleusercontent.com',
      offlineAccess: true,
    });

    const unsubscribe = auth().onAuthStateChanged(async (_user) => {
      setUser(_user);
      
      // Sync with RevenueCat and Analytics
      if (_user) {
        try {
          await RevenueCatService.login(_user.uid);
          await AnalyticsService.setUserId(_user.uid);
          
          // Check and set subscription status
          const isSubscribed = await RevenueCatService.checkSubscriptionStatus();
          await AnalyticsService.setSubscriptionStatus(isSubscribed);
        } catch (error) {
          console.error('Failed to sync with RevenueCat:', error);
        }
      } else {
        await AnalyticsService.setUserId(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      await AnalyticsService.logEvent('login', {
        method: 'email',
        user_id: userCredential.user.uid,
      });
    } catch (error) {
      console.error('Sign in error:', error);
      await AnalyticsService.logEvent('login_failed', {
        method: 'email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      await AnalyticsService.logEvent('sign_up', {
        method: 'email',
        user_id: userCredential.user.uid,
      });
    } catch (error) {
      console.error('Sign up error:', error);
      await AnalyticsService.logEvent('sign_up_failed', {
        method: 'email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AnalyticsService.logEvent('logout');
      await auth().signOut();
      // Also logout from RevenueCat
      await RevenueCatService.logout();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await auth().sendPasswordResetEmail(email);
      await AnalyticsService.logEvent('password_reset_requested', {
        email_domain: email.split('@')[1],
      });
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      await AnalyticsService.logEvent('login', {
        method: 'google',
        user_id: userCredential.user.uid,
      });
    } catch (error) {
      console.error('Google sign in error:', error);
      await AnalyticsService.logEvent('login_failed', {
        method: 'google',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

      // Sign the user in with the credential
      const userCredential = await auth().signInWithCredential(appleCredential);
      
      await AnalyticsService.logEvent('login', {
        method: 'apple',
        user_id: userCredential.user.uid,
      });
    } catch (error) {
      console.error('Apple sign in error:', error);
      await AnalyticsService.logEvent('login_failed', {
        method: 'apple',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      await AnalyticsService.logEvent('account_deleted', {
        user_id: currentUser.uid,
      });

      // Delete the user account
      await currentUser.delete();
      
      // Clean up RevenueCat
      await RevenueCatService.logout();
    } catch (error: any) {
      // If the user needs to re-authenticate
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('Please sign in again before deleting your account');
      }
      console.error('Delete account error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        signInWithGoogle,
        signInWithApple,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};