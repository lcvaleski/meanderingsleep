import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StatusBar, StyleSheet, View, TouchableOpacity, Text, Image, ScrollView, Alert } from 'react-native';
import { MainStackParamList } from './types';
import { Logo } from '../design-system/components/Logo';
import AudioPlayer from '../components/AudioPlayer';
import { colors, typography, spacing } from '../design-system/theme';
import RevenueCatService from '../services/RevenueCatService';
import { PAYWALL_RESULT } from 'react-native-purchases-ui';
import crashlytics from '@react-native-firebase/crashlytics';
import GoogleStorageService from '../services/GoogleStorageService';

const Stack = createStackNavigator<MainStackParamList>();

function MainScreen() {
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedAudioUrl, setSelectedAudioUrl] = useState<string>('');
  const [selectedAudioTitle, setSelectedAudioTitle] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleCategoryPress = async (category: string) => {
    console.log(`Pressed ${category}`);
    crashlytics().log(`Category pressed: ${category}`);
    
    // TEMPORARILY DISABLED PAYWALL FOR TESTING
    // Test Google Storage connection first
    const isConnected = await GoogleStorageService.testConnection();
    console.log('Google Storage connected:', isConnected);
    
    if (isConnected) {
      // Play today's audio with selected gender
      const currentDay = GoogleStorageService.getCurrentDay();
      const audioType = category.toLowerCase().includes('boring') ? 'boring' : 'meandering';
      const audioUrl = GoogleStorageService.getDailyAudioUrl(currentDay, audioType, selectedGender);
      
      console.log('Audio URL:', audioUrl);
      
      // Set the audio info and show player
      setSelectedAudioUrl(audioUrl);
      setSelectedAudioTitle(`${currentDay} ${audioType === 'boring' ? 'Boring Lecture' : 'Meandering Story'}`);
      setShowPlayer(true);
    } else {
      Alert.alert('Connection Error', 'Unable to connect to audio service. Please check your internet connection.');
    }
    
    // PAYWALL CODE COMMENTED OUT FOR TESTING
    // try {
    //   crashlytics().log('Calling presentPaywallIfNeeded with entitlement: premium');
    //   const result = await RevenueCatService.presentPaywallIfNeeded('premium');
    //   ...
    // }
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
          <AudioPlayer trackUrl={selectedAudioUrl} trackTitle={selectedAudioTitle} />
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

          {/* Gender Selection */}
          <View style={styles.genderContainer}>
            <Text style={styles.genderLabel}>Select Voice:</Text>
            <View style={styles.genderButtons}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  selectedGender === 'female' && styles.genderButtonActive
                ]}
                onPress={() => setSelectedGender('female')}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.genderButtonText,
                  selectedGender === 'female' && styles.genderButtonTextActive
                ]}>Female</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  selectedGender === 'male' && styles.genderButtonActive
                ]}
                onPress={() => setSelectedGender('male')}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.genderButtonText,
                  selectedGender === 'male' && styles.genderButtonTextActive
                ]}>Male</Text>
              </TouchableOpacity>
            </View>
          </View>

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
  genderContainer: {
    marginBottom: spacing.xl,
  },
  genderLabel: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary.white,
    marginBottom: spacing.md,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  genderButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.primary.eclipse,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  genderButtonActive: {
    borderColor: colors.primary.orchid,
    backgroundColor: colors.primary.blueberry,
  },
  genderButtonText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: colors.secondary.lavender,
    textAlign: 'center',
  },
  genderButtonTextActive: {
    color: colors.primary.white,
    fontFamily: typography.fontFamily.bold,
  },
});