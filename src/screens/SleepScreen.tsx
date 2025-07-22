import React, { useState, useMemo, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, TouchableOpacity, Text, Image, ScrollView, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../navigation/types';
import { Logo } from '../design-system/components/Logo';
import { colors, typography, spacing } from '../design-system/theme';
import crashlytics from '@react-native-firebase/crashlytics';
import GoogleStorageService from '../services/GoogleStorageService';
import { AudioSlider, AudioTrack } from '../components/AudioSlider';
import audioLibraryData from '../data/audioLibrary.json';
import UpgradeCard from '../components/UpgradeCard';
import RevenueCatService from '../services/RevenueCatService';

// Type the audio library data
interface AudioLibrary {
  audios: AudioTrack[];
}

const audioLibrary = audioLibraryData as AudioLibrary;

type SleepScreenNavigationProp = StackNavigationProp<MainStackParamList, 'MainTabs'>;

export function SleepScreen() {
  const navigation = useNavigation<SleepScreenNavigationProp>();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  // Check subscription status on mount and when screen is focused
  const checkSubscriptionStatus = async () => {
    try {
      const subscribed = await RevenueCatService.checkSubscriptionStatus();
      setIsSubscribed(subscribed);
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  // Check subscription on mount
  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  // Check subscription when screen is focused (e.g., after returning from paywall)
  useFocusEffect(
    React.useCallback(() => {
      checkSubscriptionStatus();
    }, [])
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Filter audio tracks by gender and topic
  const meanderingTracks = useMemo(() => {
    return audioLibrary.audios.filter(
      audio => audio.topic === 'meandering' && audio.gender === selectedGender
    );
  }, [selectedGender]);

  const boringTracks = useMemo(() => {
    return audioLibrary.audios.filter(
      audio => audio.topic === 'boring' && audio.gender === selectedGender
    );
  }, [selectedGender]);

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
      
      // Navigate to play screen with subscription status
      navigation.navigate('Play', {
        trackUrl: audioUrl,
        trackTitle: `${currentDay} ${audioType === 'boring' ? 'Boring Lecture' : 'Meandering Story'}`,
        trackType: audioType,
        gender: selectedGender,
        isSubscribed: isSubscribed,
      });
    } else {
      Alert.alert('Connection Error', 'Unable to connect to audio service. Please check your internet connection.');
    }
  };

  const handleTrackPress = async (track: any) => {
    // Check subscription status first for library items
    if (!isSubscribed) {
      try {
        await RevenueCatService.presentPaywall();
        // Re-check subscription status after paywall is dismissed
        await checkSubscriptionStatus();
        // If still not subscribed, return early
        const subscribed = await RevenueCatService.checkSubscriptionStatus();
        if (!subscribed) {
          return;
        }
      } catch (error) {
        console.error('Error presenting paywall:', error);
        return;
      }
    }

    // User is subscribed, proceed with playing the audio
    const isConnected = await GoogleStorageService.testConnection();
    
    if (isConnected) {
      const audioUrl = GoogleStorageService.getLibraryAudioUrl(track.id, track.topic, track.gender);
      
      navigation.navigate('Play', {
        trackUrl: audioUrl,
        trackTitle: track.subtopic,
        trackType: track.topic,
        gender: track.gender,
      });
    } else {
      Alert.alert('Connection Error', 'Unable to connect to audio service. Please check your internet connection.');
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
            <View style={styles.genderSelector}>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  selectedGender === 'male' && styles.genderOptionActive
                ]}
                onPress={() => setSelectedGender('male')}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.genderOptionText,
                  selectedGender === 'male' && styles.genderOptionTextActive
                ]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  selectedGender === 'female' && styles.genderOptionActive
                ]}
                onPress={() => setSelectedGender('female')}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.genderOptionText,
                  selectedGender === 'female' && styles.genderOptionTextActive
                ]}>Female</Text>
              </TouchableOpacity>
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

          {/* Upgrade Card - Only show if not subscribed */}
          {!isSubscribed && (
            <View style={styles.upgradeCardContainer}>
              <UpgradeCard 
                onPress={async () => {
                  try {
                    await RevenueCatService.presentPaywall();
                    // Re-check subscription status after paywall is dismissed
                    checkSubscriptionStatus();
                  } catch (error) {
                    console.error('Error presenting paywall:', error);
                  }
                }}
              />
            </View>
          )}

          {/* Audio Sliders */}
          <View style={styles.slidersContainer}>
            <AudioSlider
              title="Meandering Stories"
              tracks={meanderingTracks}
              onTrackPress={handleTrackPress}
              accentColor="#728AF6"
              onViewAllPress={async () => {
                if (!isSubscribed) {
                  try {
                    await RevenueCatService.presentPaywall();
                    // Re-check subscription status after paywall is dismissed
                    await checkSubscriptionStatus();
                    // If still not subscribed, return early
                    const subscribed = await RevenueCatService.checkSubscriptionStatus();
                    if (!subscribed) {
                      return;
                    }
                  } catch (error) {
                    console.error('Error presenting paywall:', error);
                    return;
                  }
                }
                navigation.navigate('ViewAll', {
                  title: 'Meandering Stories',
                  tracks: meanderingTracks,
                  onTrackPress: handleTrackPress,
                  accentColor: '#728AF6',
                });
              }}
            />
            
            <AudioSlider
              title="Boring Lectures"
              tracks={boringTracks}
              onTrackPress={handleTrackPress}
              accentColor="#CD52D4"
              onViewAllPress={async () => {
                if (!isSubscribed) {
                  try {
                    await RevenueCatService.presentPaywall();
                    // Re-check subscription status after paywall is dismissed
                    await checkSubscriptionStatus();
                    // If still not subscribed, return early
                    const subscribed = await RevenueCatService.checkSubscriptionStatus();
                    if (!subscribed) {
                      return;
                    }
                  } catch (error) {
                    console.error('Error presenting paywall:', error);
                    return;
                  }
                }
                navigation.navigate('ViewAll', {
                  title: 'Boring Lectures',
                  tracks: boringTracks,
                  onTrackPress: handleTrackPress,
                  accentColor: '#CD52D4',
                });
              }}
            />
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
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  greeting: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.primary.white,
    marginBottom: spacing.md,
    fontWeight: '600',
    paddingHorizontal: spacing.lg,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    marginTop: spacing.sm
  },
  categoryCard: {
    flex: 1,
    borderRadius: 8,
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
  genderSelector: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  genderOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  genderOptionActive: {
    borderColor: colors.primary.orchid,
  },
  genderOptionText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.primary.white,
  },
  genderOptionTextActive: {
  },
  dailySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  dailyLabel: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary.white,
  },
  slidersContainer: {
    marginTop: spacing.sm,
  },
  upgradeCardContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
});