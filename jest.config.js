module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-firebase|@react-native-google-signin|@invertase/react-native-apple-authentication)/)'
  ],
  setupFiles: ['./jest/setup.js'],
  moduleNameMapper: {
    '^@react-native-google-signin/google-signin$': '<rootDir>/__mocks__/@react-native-google-signin/google-signin.js',
    '^@invertase/react-native-apple-authentication$': '<rootDir>/__mocks__/@invertase/react-native-apple-authentication.js'
  }
};
