import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../design-system/components/Button';
import { FormField } from '../../design-system/components/FormField';
import { Logo } from '../../design-system/components/Logo';
import { colors, typography, spacing } from '../../design-system/theme';
import { AppleButton } from '@invertase/react-native-apple-authentication';

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const SignUpScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp, loading, signInWithGoogle } = useAuth();

  const isFormValid =
    !!email &&
    !!password &&
    !!confirmPassword &&
    validateEmail(email) &&
    password.length >= 6 &&
    password === confirmPassword;

  const handleSignUp = async () => {
    setError('');
    if (!email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await signUp(email, password);
      navigation.replace('AuthLoading');
    } catch (error: any) {
      let message = 'Sign up failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already in use.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak.';
      } else if (error.message) {
        message = error.message;
      }
      setError(message);
    }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.title}>Create Account</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.formFields}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email<Text style={styles.asterisk}>*</Text></Text>
          <FormField
            placeholder="example@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
            style={styles.input}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password<Text style={styles.asterisk}>*</Text></Text>
          <FormField
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            editable={!loading}
            style={styles.input}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Confirm Password<Text style={styles.asterisk}>*</Text></Text>
          <FormField
            placeholder="Enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            editable={!loading}
            style={styles.input}
          />
        </View>
      </View>
      <Button
        title="Sign Up"
        onPress={handleSignUp}
        variant="primary"
        size="large"
        loading={loading}
        style={{ width: '100%' }}
        disabled={!isFormValid || loading}
      />
      <View style={styles.socialButtonsContainer}>
        {Platform.OS === 'ios' && (
          <AppleButton
            buttonStyle={AppleButton.Style.WHITE}
            buttonType={AppleButton.Type.SIGN_IN}
            style={styles.socialButton}
            onPress={() => {/* handleAppleSignIn logic here */}}
          />
        )}
        <TouchableOpacity
          style={styles.socialButton}
          onPress={signInWithGoogle}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../assets/google-icon.png')}
            style={styles.socialIcon}
            resizeMode="contain"
          />
          <Text style={styles.socialButtonText}>Sign up with Google</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        disabled={loading}
        style={styles.loginLink}
      >
        <Text style={styles.loginText}>Already have an account? <Text style={styles.loginTextBold}>Login</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    backgroundColor: colors.primary.eclipse,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
  },
  logo: {
    fontSize: 48,
    color: colors.primary.white,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.xl,
    textAlign: 'center',
    color: colors.primary.white,
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.primary.white,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    marginBottom: spacing.xs,
  },
  asterisk: {
    color: colors.primary.orchid,
    fontSize: typography.fontSize.md,
  },
  input: {
    marginBottom: 0,
  },
  button: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 0,
  },
  loginText: {
    color: colors.primary.white,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
  loginTextBold: {
    color: colors.primary.white,
    fontWeight: 'bold',
  },
  errorText: {
    color: colors.secondary.coral,
    marginBottom: spacing.sm,
    textAlign: 'center',
    fontFamily: typography.fontFamily.regular,
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