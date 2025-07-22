export type RootStackParamList = {
  AuthStack: undefined;
  MainStack: undefined;
};

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Sleep: undefined;
  Profile: undefined;
};

import { AudioTrack } from '../components/AudioSlider';

export type MainStackParamList = {
  MainTabs: undefined;
  Play: {
    trackUrl: string;
    trackTitle: string;
    trackType: 'meandering' | 'boring';
    gender: 'male' | 'female';
    isSubscribed?: boolean;
  };
  ViewAll: {
    title: string;
    tracks: AudioTrack[];
    onTrackPress: (track: AudioTrack) => void;
    accentColor: string;
  };
};