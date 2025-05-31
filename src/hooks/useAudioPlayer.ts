import { useState } from 'react';
import TrackPlayer, { State, useTrackPlayerEvents, Event, Track, useProgress } from 'react-native-track-player';

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const progress = useProgress();

  useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackTrackChanged], async (event) => {
    if (event.type === Event.PlaybackState) {
      const state = await TrackPlayer.getState();
      setIsPlaying(state === State.Playing);
    }
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      setCurrentTrack(track || null);
    }
  });

  const playTrack = async (url: string, title: string, artist: string) => {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        url,
        title,
        artist,
        artwork: undefined, // Optional: Add artwork URL if you have one
      });
      await TrackPlayer.play();
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const togglePlayback = async () => {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const stopPlayback = async () => {
    await TrackPlayer.stop();
  };

  return {
    isPlaying,
    currentTrack,
    progress,
    playTrack,
    togglePlayback,
    stopPlayback,
  };
}; 