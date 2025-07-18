import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { colors, typography, spacing } from '../design-system/theme';
import RevenueCatService from '../services/RevenueCatService';
import { PAYWALL_RESULT } from 'react-native-purchases-ui';
import crashlytics from '@react-native-firebase/crashlytics';

export const ProfileScreen = () => {
  const { user, signOut } = useAuth();

  const handleSubscribePress = async () => {
    crashlytics().log('Subscribe button pressed');
    try {
      crashlytics().log('Calling presentPaywall');
      const result = await RevenueCatService.presentPaywall();
      crashlytics().log(`Paywall presentation result: ${result}`);
      
      if (result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED) {
        console.log('Purchase or restore successful');
        crashlytics().log('Purchase or restore successful');
      } else if (result === PAYWALL_RESULT.CANCELLED) {
        console.log('User cancelled the paywall');
        crashlytics().log('User cancelled the paywall');
      }
    } catch (error) {
      console.error('Error presenting paywall:', error);
      crashlytics().log(`Error in handleSubscribePress: ${error}`);
      crashlytics().recordError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <View style={styles.userInfo}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email || 'Not available'}</Text>
      </View>

      <TouchableOpacity 
        style={styles.subscribeButton}
        onPress={handleSubscribePress}
        activeOpacity={0.8}
      >
        <Text style={styles.subscribeButtonText}>Unlock Premium</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.nocturne,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl * 2,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.primary.white,
    marginBottom: spacing.xl * 2,
    fontWeight: '600',
  },
  userInfo: {
    backgroundColor: colors.primary.eclipse,
    padding: spacing.lg,
    borderRadius: 8,
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.secondary.lavender,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.primary.white,
  },
  subscribeButton: {
    backgroundColor: colors.primary.orchid,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  subscribeButtonText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary.white,
  },
  logoutButton: {
    backgroundColor: colors.primary.eclipse,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.secondary.lavender,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.secondary.lavender,
  },
});