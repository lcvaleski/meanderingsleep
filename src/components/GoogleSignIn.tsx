import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

const GoogleSignInComponent = () => {
  const signIn = async () => {
    console.log('Button pressed - starting sign in process');
    try {
      console.log('Checking Play Services...');
      await GoogleSignin.hasPlayServices();
      console.log('Play Services OK, attempting sign in...');
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info:', userInfo);
    } catch (error: any) {
      console.error('Detailed error:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Operation is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.log('Something went wrong:', error.toString());
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Sign in with Google"
        onPress={signIn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

export default GoogleSignInComponent; 