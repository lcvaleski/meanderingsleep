import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, typography, spacing } from '../design-system/theme';
import TrackPlayer, { useProgress, State, usePlaybackState } from 'react-native-track-player';
import Slider from '@react-native-community/slider';

interface PlayScreenProps {
  route: {
    params: {
      trackUrl: string;
      trackTitle: string;
      trackType: 'meandering' | 'boring';
      gender: 'male' | 'female';
    };
  };
}

export const PlayScreen = ({ route }: PlayScreenProps) => {
  const { trackUrl, trackTitle, trackType, gender } = route.params;
  const progress = useProgress();
  const playbackState = usePlaybackState();
  const isPlaying = playbackState.state === State.Playing;

  useEffect(() => {
    setupPlayer();
    return () => {
      TrackPlayer.reset();
    };
  }, []);

  const setupPlayer = async () => {
    try {
      // Reset and add new track
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: '1',
        url: trackUrl,
        title: trackTitle,
        artist: gender === 'female' ? 'Female' : 'Male',
      });
      await TrackPlayer.play();
    } catch (error) {
      console.error('Error setting up player:', error);
      // If player is not initialized, we should handle this at app level
      // For now, just log the error
    }
  };

  const togglePlayPause = async () => {
    if (playbackState.state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const onSliderValueChange = async (value: number) => {
    await TrackPlayer.seekTo(value);
  };

  return (
    <LinearGradient
      colors={['#7D85BF', '#32417C']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Top handle bar */}
        <View style={styles.handleBar} />

      {/* Artwork */}
      <View style={styles.artworkContainer}>
        <Image 
          source={require('../assets/resources/night_scene_thumbnail.png')}
          style={styles.artwork}
          resizeMode="cover"
        />
      </View>

      {/* Track Info */}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>
          {trackType === 'meandering' ? 'Daily Meandering Story' : 'Daily Boring Lecture'}
        </Text>
        <Text style={styles.artistName}>{gender === 'female' ? 'Female' : 'Male'}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          value={progress.position}
          minimumValue={0}
          maximumValue={progress.duration}
          minimumTrackTintColor={colors.primary.white}
          maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
          thumbTintColor={colors.primary.white}
          onSlidingComplete={onSliderValueChange}
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
          <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
        </View>
      </View>

        {/* Playback Controls */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.playButton}
            onPress={togglePlayPause}
            activeOpacity={0.7}
          >
            <View style={styles.playButtonInner}>
              {isPlaying ? (
                <View style={styles.pauseIcon}>
                  <View style={styles.pauseBar} />
                  <View style={styles.pauseBar} />
                </View>
              ) : (
                <View style={styles.playIcon} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  artworkContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  artwork: {
    width: 340,
    height: 340,
    borderRadius: 20,
    alignSelf: 'center',
  },
  trackInfo: {
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  trackTitle: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700',
    color: colors.primary.white,
    marginBottom: spacing.xs,
    textAlign: 'left',
  },
  artistName: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'left',
  },
  progressContainer: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    marginTop: spacing.sm,
  },
  timeText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  playButton: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 0,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: '#6B5B95',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 6,
  },
  pauseIcon: {
    flexDirection: 'row',
    gap: 6,
  },
  pauseBar: {
    width: 6,
    height: 24,
    backgroundColor: '#6B5B95',
    borderRadius: 3,
  },
});