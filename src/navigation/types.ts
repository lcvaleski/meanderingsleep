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

export type MainStackParamList = {
  Main: undefined;
  Play: {
    trackUrl: string;
    trackTitle: string;
    trackType: 'meandering' | 'boring';
    gender: 'male' | 'female';
  };
};