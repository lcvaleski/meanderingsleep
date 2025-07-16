import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StatusBar, StyleSheet, View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { MainStackParamList } from './types';
import { Logo } from '../design-system/components/Logo';
import AudioPlayer from '../components/AudioPlayer';
import { colors, typography, spacing } from '../design-system/theme';
import RevenueCatService from '../services/RevenueCatService';
import { PAYWALL_RESULT } from 'react-native-purchases-ui';
import crashlytics from '@react-native-firebase/crashlytics';

const Stack = createStackNavigator<MainStackParamList>();

function MainScreen() {
  const [showPlayer, setShowPlayer] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleCategoryPress = async (category: string) => {
    console.log(`Pressed ${category}`);
    crashlytics().log(`Category pressed: ${category}`);
    
    // Check if user has subscription before allowing access
    // You can customize this based on your entitlement names in RevenueCat
    try {
      crashlytics().log('Calling presentPaywallIfNeeded with entitlement: premium');
      const result = await RevenueCatService.presentPaywallIfNeeded('premium');
      crashlytics().log(`Paywall result: ${result}`);
      
      if (result === PAYWALL_RESULT.NOT_PRESENTED) {
        // User has active subscription, proceed
        crashlytics().log('User has active subscription, showing player');
        setShowPlayer(true);
      } else if (result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED) {
        // User just purchased/restored, proceed
        crashlytics().log('Purchase/restore successful, showing player');
        setShowPlayer(true);
      }
      // If cancelled or error, don't show player
    } catch (error) {
      console.error('Error checking subscription:', error);
      crashlytics().log(`Error in handleCategoryPress: ${error}`);
      crashlytics().recordError(error instanceof Error ? error : new Error(String(error)));
    }
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary.nocturne} />
      {showPlayer ? (
        <View style={styles.playerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowPlayer(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <AudioPlayer />
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Logo />
            <TouchableOpacity 
              style={styles.subscribeButton}
              onPress={handleSubscribePress}
              activeOpacity={0.8}
            >
              <Text style={styles.subscribeButtonText}>Unlock Premium</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.greeting}>
            {getGreeting()}
          </Text>

          <View style={styles.categoriesContainer}>
            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('Meandering Stories')}
              activeOpacity={0.8}
            >
              <Image 
                source={require('../assets/resources/meandering_story_icon.png')}
                style={styles.categoryIcon}
                resizeMode="contain"
              />
              <Text style={styles.categoryTitle}>Meandering{'\n'}Stories</Text>
              <Text style={styles.categoryAuthor}>Sally</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('Boring Lectures')}
              activeOpacity={0.8}
            >
              <Image 
                source={require('../assets/resources/boring_lecture_icon.png')}
                style={styles.categoryIcon}
                resizeMode="contain"
              />
              <Text style={styles.categoryTitle}>Boring{'\n'}Lectures</Text>
              <Text style={styles.categoryAuthor}>Sally</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
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
    backgroundColor: colors.primary.nocturne,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl * 2,
  },
  greeting: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.primary.white,
    marginBottom: spacing.xl * 2,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: colors.primary.eclipse,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    minHeight: 200,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    marginBottom: spacing.lg,
  },
  categoryTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  categoryAuthor: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.secondary.lavender,
  },
  playerContainer: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  backButtonText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary.orchid,
  },
  subscribeButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary.orchid,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 25,
  },
  subscribeButtonText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary.white,
  },
});