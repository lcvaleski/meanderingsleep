import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../design-system/components/Button';
import { colors, typography, spacing } from '../design-system/theme';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export const MainScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const { isPlaying, currentTrack, progress, playTrack, togglePlayback, stopPlayback } = useAudioPlayer();

  const handleLogout = async () => {
    await logout();
    navigation.replace('AuthLoading');
  };

  // Test audio URL - replace with your actual audio URL
  const testAudioUrl = 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3';

  const handlePlayTest = () => {
    playTrack(
      testAudioUrl,
      'Test Audio',
      'Test Artist'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {user?.email}</Text>
      
      {/* Audio Player Controls */}
      <View style={styles.audioControls}>
        <Text style={styles.trackInfo}>
          {currentTrack ? `${currentTrack.title} - ${currentTrack.artist}` : 'No track playing'}
        </Text>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(progress.position / (progress.duration || 1)) * 100}%` }
            ]} 
          />
        </View>

        <View style={styles.controlButtons}>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={handlePlayTest}
          >
            <Text style={styles.buttonText}>Load Test</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={togglePlayback}
          >
            <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={stopPlayback}
          >
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button
        title="Logout"
        onPress={handleLogout}
        variant="primary"
        size="large"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background.default,
  },
  welcomeText: {
    fontSize: typography.fontSize.xl,
    marginBottom: spacing.lg,
    fontFamily: typography.fontFamily.medium,
    color: colors.neutral.gray900,
  },
  audioControls: {
    width: '100%',
    marginBottom: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.neutral.gray100,
    borderRadius: 8,
  },
  trackInfo: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.neutral.gray900,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.neutral.gray300,
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.eclipse,
    borderRadius: 2,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.sm,
  },
  controlButton: {
    padding: spacing.sm,
    backgroundColor: colors.primary.eclipse,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.neutral.white,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
  },
}); 