import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen } from '../screens/SplashScreen';
// TODO: Create these screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
// import { AuthLoadingScreen } from '../screens/auth/AuthLoadingScreen';
// import { MainScreen } from '../screens/MainScreen';

export type AuthStackParamList = {
  Splash: undefined;
  // AuthLoading: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  // Main: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      {/* <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} /> */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      {/* <Stack.Screen name="Main" component={MainScreen} /> */}
    </Stack.Navigator>
  );
}; 