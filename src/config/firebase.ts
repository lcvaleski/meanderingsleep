import firebase from '@react-native-firebase/app';
import { Platform } from 'react-native';

// Initialize Firebase
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (firebase.apps.length > 0) {
      console.log('Firebase already initialized');
      return;
    }

    // Firebase should auto-initialize on iOS if GoogleService-Info.plist is present
    // and on Android if google-services.json is present
    // Sometimes we need to explicitly access the app to trigger initialization
    const app = firebase.app();
    console.log('Firebase initialized successfully:', app.name);
  } catch (error) {
    console.error('Firebase initialization error:', error);
    
    // If Firebase fails to auto-initialize, it usually means:
    // 1. GoogleService-Info.plist is not added to the iOS project
    // 2. google-services.json is not in android/app/
    // 3. The file is corrupted or has incorrect format
    
    if (Platform.OS === 'ios') {
      console.error('Make sure GoogleService-Info.plist is added to your Xcode project');
    } else {
      console.error('Make sure google-services.json is in android/app/ directory');
    }
  }
};

export default initializeFirebase;