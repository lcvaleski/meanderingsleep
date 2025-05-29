import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image } from 'react-native';
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
      <View style={styles.formFields}>
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
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotPasswordLink}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
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
      <View style={styles.socialButtonsContainer}>
        {Platform.OS === 'ios' && (
          <AppleButton
            buttonStyle={AppleButton.Style.WHITE}
            buttonType={AppleButton.Type.SIGN_IN}
            style={styles.socialButton}
            onPress={handleAppleSignIn}
          />
        )}
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleSignIn}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../assets/google-icon.png')}
            style={styles.socialIcon}
            resizeMode="contain"
          />
          <Text style={styles.socialButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('SignUp')}
        style={styles.signUpLink}
        disabled={loading}
      >
        <Text style={styles.signUpText}>
          Don't have an account? <Text style={styles.signUpTextBold}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
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
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  forgotPasswordText: {
    color: colors.primary.orchid,
    fontSize: typography.fontSize.sm,
    textDecorationLine: 'underline',
    fontFamily: typography.fontFamily.medium,
  },
  loginButton: {
    marginTop: spacing.sm,
  },
  signUpButton: {
    marginTop: spacing.lg,
  },
  signUpLink: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  signUpText: {
    color: colors.primary.white,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
  signUpTextBold: {
    color: colors.primary.orchid,
    fontWeight: 'bold',
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
  formFields: {
    marginBottom: spacing.lg,
    width: '100%',
  },
  socialButtonsContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    width: '100%',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: spacing.md,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  socialButtonText: {
    color: '#222',
    fontSize: 16,
    fontWeight: '500',
  },
}); 