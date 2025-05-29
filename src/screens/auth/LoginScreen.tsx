import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import { Button } from '../../design-system/components/Button';
import { FormField } from '../../design-system/components/FormField';
import { Logo } from '../../design-system/components/Logo';
import { colors, typography, spacing } from '../../design-system/theme';

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, signInWithGoogle, loading } = useAuth();

  const isFormValid = !!email && !!password && validateEmail(email);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    try {
      await signIn(email, password);
      navigation.replace('AuthLoading');
    } catch (error: any) {
      let message = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') {
        message = 'No user found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      } else if (error.code === 'auth/invalid-credential') {
        message = 'The email or password is incorrect or has expired.';
      } else if (error.message) {
        message = error.message.replace(/\[.*?\]\s*/, '');
      }
      setError(message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigation.replace('AuthLoading');
    } catch (error: any) {
      let message = 'Google Sign-In failed. Please try again.';
      if (error.message) {
        message = error.message.replace(/\[.*?\]\s*/, '');
      }
      setError(message);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      const { identityToken, nonce } = appleAuthRequestResponse;
      if (identityToken && nonce) {
        const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
        await auth().signInWithCredential(appleCredential);
        navigation.replace('AuthLoading');
      } else {
        throw new Error('Apple Sign-In failed: Missing identityToken or nonce');
      }
    } catch (error) {
      console.error('Apple Sign-In Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FormField
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
        style={styles.input}
      />
      <FormField
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        editable={!loading}
        style={styles.input}
      />
      <Button
        title="Forgot Password?"
        onPress={() => navigation.navigate('ForgotPassword')}
        variant="secondary"
        size="small"
        style={styles.forgotPassword}
      />
      <Button
        title="Login"
        onPress={handleLogin}
        variant="primary"
        size="large"
        loading={loading}
        style={{ width: '100%' }}
        disabled={!isFormValid || loading}
      />
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>
      <Button
        title="Sign in with Google"
        onPress={handleGoogleSignIn}
        variant="secondary"
        size="large"
        disabled={loading}
        style={styles.googleButton}
      />
      {Platform.OS === 'ios' && (
        <AppleButton
          buttonStyle={AppleButton.Style.BLACK}
          buttonType={AppleButton.Type.SIGN_IN}
          style={styles.appleButton}
          onPress={handleAppleSignIn}
        />
      )}
      <Button
        title="Don't have an account? Sign Up"
        onPress={() => navigation.navigate('SignUp')}
        variant="secondary"
        size="small"
        disabled={loading}
        style={styles.signUpButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    backgroundColor: colors.primary.nocturne,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.xl,
    textAlign: 'center',
    color: colors.primary.white,
  },
  input: {
    marginBottom: spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  loginButton: {
    marginTop: spacing.sm,
  },
  signUpButton: {
    marginTop: spacing.lg,
  },
  errorText: {
    color: colors.secondary.coral,
    marginBottom: spacing.sm,
    textAlign: 'center',
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.primary.blueberry,
  },
  dividerText: {
    marginHorizontal: spacing.sm,
    color: colors.primary.white,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
  },
  googleButton: {
    marginBottom: spacing.sm,
  },
  appleButton: {
    width: '100%',
    height: 44,
    marginTop: spacing.sm,
  },
}); 