import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
// import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
// import auth from '@react-native-firebase/auth';
import { Button } from '../../design-system/components/Button';
import { EnhancedInput } from '../../components/EnhancedInput';
import { Logo } from '../../design-system/components/Logo';
import { colors, typography, spacing } from '../../design-system/theme';

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const isFormValid = !!email && !!password && validateEmail(email);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      // Navigation will be handled by auth state change
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      Alert.alert('Login Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Placeholder function
    console.log('Signing in with Google');
  };

  const handleAppleSignIn = async () => {
    // Placeholder function
    console.log('Signing in with Apple');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Logo />
        <Text style={styles.title}>Login</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.formFields}>
          <EnhancedInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
            showClearButton
            animateLabel
          />
          <EnhancedInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            editable={!loading}
            animateLabel
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
          <TouchableOpacity
            style={styles.socialButton}
          onPress={handleAppleSignIn}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../assets/apple-icon.png')}
              style={styles.socialIcon}
              resizeMode="contain"
            />
            <Text style={styles.socialButtonText}>Sign in with Apple</Text>
          </TouchableOpacity>
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
        onPress={() => {
          console.log('Sign up link pressed, navigating to SignUp');
          navigation.navigate('SignUp');
        }}
        style={styles.signUpLink}
        disabled={loading}
      >
        <Text style={styles.signUpText}>
          Don't have an account? <Text style={styles.signUpTextBold}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: colors.primary.nocturne,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
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
    width: '100%',
    alignItems: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.blueberry,
    borderRadius: 24,
    paddingVertical: 12,
    width: '90%',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary.blueberry,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: spacing.md,
  },
  socialButtonText: {
    color: colors.primary.white,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
  },
});
