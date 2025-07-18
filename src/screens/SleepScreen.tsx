import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, TouchableOpacity, Text, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../navigation/types';
import { Logo } from '../design-system/components/Logo';
import { colors, typography, spacing } from '../design-system/theme';
import RevenueCatService from '../services/RevenueCatService';
import { PAYWALL_RESULT } from 'react-native-purchases-ui';
import crashlytics from '@react-native-firebase/crashlytics';
import GoogleStorageService from '../services/GoogleStorageService';

type SleepScreenNavigationProp = StackNavigationProp<MainStackParamList, 'MainTabs'>;

export function SleepScreen() {
  const navigation = useNavigation<SleepScreenNavigationProp>();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female');
  const [showGenderSelector, setShowGenderSelector] = useState(false);

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
      
      // Navigate to play screen
      navigation.navigate('Play', {
        trackUrl: audioUrl,
        trackTitle: `${currentDay} ${audioType === 'boring' ? 'Boring Lecture' : 'Meandering Story'}`,
        trackType: audioType,
        gender: selectedGender,
      });
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
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
          <View style={styles.header}>
            <Logo />
          </View>
          
          <Text style={styles.greeting}>
            {getGreeting()}
          </Text>

          {/* Your Daily Section */}
          <View style={styles.dailySection}>
            <Text style={styles.dailyLabel}>Your Daily</Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity 
                style={styles.readerDropdown} 
                activeOpacity={0.7}
                onPress={() => setShowGenderSelector(!showGenderSelector)}
              >
                <Text style={styles.readerText}>{selectedGender === 'female' ? 'Female' : 'Male'}</Text>
              </TouchableOpacity>
              
              {/* Gender Selector Dropdown */}
              {showGenderSelector && (
                <View style={styles.genderDropdown}>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  selectedGender === 'female' && styles.genderOptionActive
                ]}
                onPress={() => {
                  setSelectedGender('female');
                  setShowGenderSelector(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.genderOptionText,
                  selectedGender === 'female' && styles.genderOptionTextActive
                ]}>Female</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  selectedGender === 'male' && styles.genderOptionActive
                ]}
                onPress={() => {
                  setSelectedGender('male');
                  setShowGenderSelector(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.genderOptionText,
                  selectedGender === 'male' && styles.genderOptionTextActive
                ]}>Male</Text>
              </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <View style={styles.categoriesContainer}>
            <TouchableOpacity 
              style={[styles.categoryCard, styles.meanderingCard]}
              onPress={() => handleCategoryPress('Meandering Stories')}
              activeOpacity={0.8}
            >
              <Image 
                source={require('../assets/resources/meandering_story_icon.png')}
                style={styles.categoryIcon}
                resizeMode="contain"
              />
              <View style={styles.categoryTextContainer}>
                <Text style={styles.categoryTitle}>Meandering</Text>
                <Text style={styles.categoryTitle}>Stories</Text>
                <Text style={styles.genderText}>{selectedGender === 'female' ? 'Female' : 'Male'}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.categoryCard, styles.boringCard]}
              onPress={() => handleCategoryPress('Boring Lectures')}
              activeOpacity={0.8}
            >
              <Image 
                source={require('../assets/resources/boring_lecture_icon.png')}
                style={styles.categoryIcon}
                resizeMode="contain"
              />
              <View style={styles.categoryTextContainer}>
                <Text style={styles.categoryTitle}>Boring</Text>
                <Text style={styles.categoryTitle}>Lectures</Text>
                <Text style={styles.genderText}>{selectedGender === 'female' ? 'Female' : 'Male'}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Bottom Button */}
          <View style={styles.bottomButtons}>
            <TouchableOpacity 
              style={styles.subscribeButton}
              onPress={handleSubscribePress}
              activeOpacity={0.8}
            >
              <Text style={styles.subscribeButtonText}>Unlock Premium</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

    </SafeAreaView>
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
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.primary.white,
    marginBottom: spacing.lg,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  categoryCard: {
    flex: 1,
    borderRadius: 16,
    padding: spacing.lg,
    minHeight: 200,
    position: 'relative',
  },
  meanderingCard: {
    backgroundColor: '#3d3471b7',
  },
  boringCard: {
    backgroundColor: '#3d3471b7',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
  },
  categoryTextContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
  },
  categoryTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary.white,
    textAlign: 'left',
    lineHeight: 26,
  },
  genderText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'left',
    marginTop: spacing.xs,
  },
  categoryAuthor: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.secondary.lavender,
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  subscribeButton: {
    flex: 1,
    backgroundColor: colors.primary.orchid,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 25,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary.white,
  },
  dropdownContainer: {
    position: 'relative',
  },
  genderDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: colors.primary.eclipse,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    minWidth: 120,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1000,
    marginTop: spacing.xs,
  },
  genderOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  genderOptionActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  genderOptionText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.primary.white,
  },
  genderOptionTextActive: {
    fontFamily: typography.fontFamily.bold,
    color: colors.primary.orchid,
  },
  dailySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dailyLabel: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary.white,
  },
  readerDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  readerText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.primary.white,
    marginRight: spacing.xs,
  },
});