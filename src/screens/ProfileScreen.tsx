import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { colors, typography, spacing } from '../design-system/theme';
import RevenueCatService from '../services/RevenueCatService';
import { PAYWALL_RESULT } from 'react-native-purchases-ui';
import crashlytics from '@react-native-firebase/crashlytics';
import Config from 'react-native-config';

export const ProfileScreen = () => {
  const { user, signOut, deleteAccount } = useAuth();

  // Debug RevenueCat configuration
  useEffect(() => {
    const debugRevenueCat = async () => {
      try {
        console.log('=== RevenueCat Debug Info ===');
        
        // Check if RevenueCat is configured
        const customerInfo = await RevenueCatService.getCustomerInfo();
        console.log('Customer ID:', customerInfo.originalAppUserId);
        console.log('Active Entitlements:', Object.keys(customerInfo.entitlements.active));
        
        // Try to fetch offerings
        try {
          const offerings = await RevenueCatService.getOfferings();
          console.log('Available Offerings:', Object.keys(offerings.all));
          console.log('Current Offering:', offerings.current?.identifier);
          
          if (offerings.current) {
            console.log('Available Packages:');
            offerings.current.availablePackages.forEach(pkg => {
              console.log(`- ${pkg.identifier}: ${pkg.product.identifier} (${pkg.product.priceString})`);
            });
          }
        } catch (offeringsError) {
          console.error('Error fetching offerings:', offeringsError);
        }
        
        console.log('=== End RevenueCat Debug ===');
      } catch (error) {
        console.error('RevenueCat debug error:', error);
      }
    };

    debugRevenueCat();
  }, []);

  const handleSubscribePress = async () => {
    crashlytics().log('Subscribe button pressed');
    
    // Debug alert before attempting paywall
    Alert.alert('Debug', `About to show paywall\n\nPlatform: ${Platform.OS}\nBundle ID: net.coventry.sleepless\nAPI Key: ${Config.REVENUECAT_IOS_API_KEY || 'Not found'}`);
    
    try {
      crashlytics().log('Calling presentPaywall');
      console.log('[ProfileScreen] About to call presentPaywall');
      const result = await RevenueCatService.presentPaywall();
      console.log('[ProfileScreen] Paywall result:', result);
      crashlytics().log(`Paywall presentation result: ${result}`);
      
      if (result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED) {
        console.log('Purchase or restore successful');
        crashlytics().log('Purchase or restore successful');
        Alert.alert('Success', 'Purchase or restore successful!');
      } else if (result === PAYWALL_RESULT.CANCELLED) {
        console.log('User cancelled the paywall');
        crashlytics().log('User cancelled the paywall');
      }
    } catch (error) {
      console.error('Error presenting paywall:', error);
      crashlytics().log(`Error in handleSubscribePress: ${error}`);
      crashlytics().recordError(error instanceof Error ? error : new Error(String(error)));
      Alert.alert(
        'Error', 
        `Failed to present paywall: ${error instanceof Error ? error.message : String(error)}\n\nDebug Info:\n- Platform: ${Platform.OS}\n- Bundle ID: net.coventry.sleepless\n- API Key Prefix: ${Config.REVENUECAT_IOS_API_KEY ? Config.REVENUECAT_IOS_API_KEY.substring(0, 8) + '...' : 'Not found'}`
      );
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

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            // Second confirmation
            Alert.alert(
              'Final Confirmation',
              'This will permanently delete your account and all associated data. Are you absolutely sure?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Yes, Delete My Account',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await deleteAccount();
                      // User will be automatically logged out
                    } catch (error: any) {
                      console.error('Error deleting account:', error);
                      if (error.message && error.message.includes('sign in again')) {
                        Alert.alert(
                          'Re-authentication Required',
                          'For security reasons, please logout and sign in again before deleting your account.',
                          [{ text: 'OK' }]
                        );
                      } else {
                        Alert.alert('Error', 'Failed to delete account. Please try again.');
                      }
                    }
                  },
                },
              ],
            );
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

      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={handleDeleteAccount}
        activeOpacity={0.8}
      >
        <Text style={styles.deleteButtonText}>Delete Account</Text>
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
    marginBottom: spacing.md,
  },
  logoutButtonText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.secondary.lavender,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DC6F70',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    color: '#DC6F70',
  },
});