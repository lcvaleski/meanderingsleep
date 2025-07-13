import React from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import initializeFirebase from './src/config/firebase';
import crashlytics from '@react-native-firebase/crashlytics';

// Initialize Firebase on app start
initializeFirebase();

// Initialize Crashlytics
crashlytics().setCrashlyticsCollectionEnabled(true);

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

export default App;
