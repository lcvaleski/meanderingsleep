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

const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <AuthStack />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
