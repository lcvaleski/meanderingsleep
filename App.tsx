import React, { useEffect, useState } from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import initializeFirebase from './src/config/firebase';
import crashlytics from '@react-native-firebase/crashlytics';
import RevenueCatService from './src/services/RevenueCatService';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Initialize Firebase on app start
initializeFirebase();

// Initialize Crashlytics
crashlytics().setCrashlyticsCollectionEnabled(true);

function App(): React.JSX.Element {
  const [isRevenueCatReady, setIsRevenueCatReady] = useState(false);

  useEffect(() => {
    // Initialize RevenueCat
    crashlytics().log('App starting - initializing RevenueCat');
    RevenueCatService.initialize()
      .then(() => {
        crashlytics().log('RevenueCat initialization complete in App.tsx');
        setIsRevenueCatReady(true);
      })
      .catch(error => {
        console.error('Failed to initialize RevenueCat:', error);
        crashlytics().log(`Failed to initialize RevenueCat in App.tsx: ${error}`);
        crashlytics().recordError(error instanceof Error ? error : new Error(String(error)));
        // Still allow app to load even if RevenueCat fails
        setIsRevenueCatReady(true);
      });
  }, []);

  if (!isRevenueCatReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default App;
