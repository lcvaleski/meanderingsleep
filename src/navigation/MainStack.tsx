import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StatusBar, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import AudioPlayer from '../components/AudioPlayer';
import { MainStackParamList } from './types';
import { useAuth } from '../contexts/AuthContext';
import { colors, typography, spacing } from '../design-system/theme';

const Stack = createStackNavigator<MainStackParamList>();

function MainScreen() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <AudioPlayer />
    </SafeAreaView>
  );
}

export function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={MainScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  logoutButton: {
    backgroundColor: colors.primary.orchid,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  logoutText: {
    color: colors.primary.white,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
  },
});