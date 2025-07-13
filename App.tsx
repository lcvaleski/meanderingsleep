import React, { useEffect } from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import initializeFirebase from './src/config/firebase';
import crashlytics from '@react-native-firebase/crashlytics';
import RevenueCatService from './src/services/RevenueCatService';

// Initialize Firebase on app start
initializeFirebase();

// Initialize Crashlytics
crashlytics().setCrashlyticsCollectionEnabled(true);

function App(): React.JSX.Element {
  useEffect(() => {
    // Initialize RevenueCat
    RevenueCatService.initialize().catch(error => {
      console.error('Failed to initialize RevenueCat:', error);
    });
  }, []);

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

export default App;
