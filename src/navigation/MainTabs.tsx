import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { MainTabParamList } from './types';
import { SleepScreen } from '../screens/SleepScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors, typography, spacing } from '../design-system/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom tab bar icon components
const SleepIcon = ({ focused }: { focused: boolean }) => (
  <View style={styles.iconContainer}>
    <Text style={[styles.icon, focused && styles.iconFocused]}>🌙</Text>
  </View>
);

const ProfileIcon = ({ focused }: { focused: boolean }) => (
  <View style={styles.iconContainer}>
    <Text style={[styles.icon, focused && styles.iconFocused]}>👤</Text>
  </View>
);

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary.white,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen 
        name="Sleep" 
        component={SleepScreen}
        options={{
          tabBarIcon: ({ focused }) => <SleepIcon focused={focused} />,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <ProfileIcon focused={focused} />,
          tabBarLabel: 'Account',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#2E2464',
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    height: 90,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  tabBarLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    marginTop: spacing.xs,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 28,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  iconFocused: {
    color: colors.primary.white,
  },
});