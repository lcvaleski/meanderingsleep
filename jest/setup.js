jest.mock('@react-native-firebase/app', () => {
  return {
    __esModule: true,
    default: {},
    firebase: {
      app: jest.fn(),
    },
    getApp: jest.fn(),
    getApps: jest.fn(),
    initializeApp: jest.fn(),
    SDK_VERSION: '0.0.0',
  };
});

jest.mock('@react-native-firebase/auth', () => {
  return {
    __esModule: true,
    getAuth: jest.fn(),
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    FirebaseAuthTypes: {},
  };
});

jest.mock('react-native-gesture-handler', () => {
  return {
    __esModule: true,
    GestureHandlerRootView: ({ children }) => children,
    PanGestureHandler: ({ children }) => children,
    TapGestureHandler: ({ children }) => children,
    State: {},
  };
}); 