/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { AuthStack } from './src/navigation/AuthStack';
import { ThemeProvider } from './src/design-system/ThemeProvider';

const App = () => {
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
