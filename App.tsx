import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { AuthStack } from './src/navigation/AuthStack';
import { ThemeProvider } from './src/design-system/ThemeProvider';
import TrackPlayer from 'react-native-track-player';
import Purchases from 'react-native-purchases';

const App = () => {
  useEffect(() => {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    Purchases.configure({ apiKey: 'goog_jmulZDEicQKHZvTRTaZtfWYydrO' });
    (async () => {
      await TrackPlayer.setupPlayer();
    })();
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <AuthProvider>
          <AuthStack />
        </AuthProvider>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
