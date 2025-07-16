import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';

interface AudioPlayerProps {
  trackUrl?: string;
  trackTitle?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ trackUrl, trackTitle }) => {
  const playbackState = usePlaybackState();
  const { position, duration } = useProgress();
  const [currentTrack, setCurrentTrack] = useState<any>(null);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      setCurrentTrack(track);
    }
  });

  useEffect(() => {
    setupPlayer();
  }, [trackUrl]);

  const setupPlayer = async () => {
    try {
      let isInitialized = false;
      
      try {
        // Try to get the playback state to check if player is initialized
        const state = await TrackPlayer.getState();
        isInitialized = true;
      } catch (e) {
        // Player not initialized
        isInitialized = false;
      }
      
      if (!isInitialized) {
        // First time setup
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],
          compactCapabilities: [Capability.Play, Capability.Pause],
        });
      } else {
        // Player already initialized, just reset the queue
        await TrackPlayer.reset();
      }
      
      // Add the track from props or use sample
      const tracks = [{
        id: '1',
        url: trackUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        title: trackTitle || 'Meandering Sleep Audio',
        artist: 'Meandering Sleep',
      }];

      await TrackPlayer.add(tracks);
      
      // Auto-play when new track is loaded
      if (trackUrl) {
        await TrackPlayer.play();
      }
    } catch (error) {
      console.error('Error setting up player:', error);
    }
  };

  const togglePlayback = async () => {
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

  const isPlaying = playbackState.state === State.Playing;
  const isBuffering = playbackState.state === State.Buffering;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {currentTrack?.title || 'No Track Selected'}
      </Text>
      <Text style={styles.artist}>
        {currentTrack?.artist || ''}
      </Text>

      <View style={styles.progressContainer}>
        <Text style={styles.time}>{formatTime(position)}</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(position / duration) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.time}>{formatTime(duration)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={togglePlayback}
          disabled={isBuffering}
        >
          {isBuffering ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.controlText}>
              {isPlaying ? 'Pause' : 'Play'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  artist: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 10,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    marginHorizontal: 10,
  },
  controlText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AudioPlayer;