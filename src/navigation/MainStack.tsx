import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainStackParamList } from './types';
import { PlayScreen } from '../screens/PlayScreen';
import { MainTabs } from './MainTabs';

const Stack = createStackNavigator<MainStackParamList>();


export function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen 
        name="Play" 
        component={PlayScreen}
        options={{
          presentation: 'modal',
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'vertical',
          gestureResponseDistance: 800, // Allow swipe from anywhere on screen
        }}
      />
    </Stack.Navigator>
  );
}

