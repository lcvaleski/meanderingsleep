import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../design-system/components/Button';
import { EnhancedInput } from '../../components/EnhancedInput';
import { Logo } from '../../design-system/components/Logo';
import { colors, typography, spacing } from '../../design-system/theme';
// import { AppleButton } from '@invertase/react-native-apple-authentication';

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const SignUpScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const isFormValid =
    !!email &&
    !!password &&
    !!confirmPassword &&
    validateEmail(email) &&
    password.length >= 6 &&
    password === confirmPassword;

  const handleSignUp = async () => {
    setError('');
    setLoading(true);
    try {
      await signUp(email, password);
      // Navigation will be handled by auth state change
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      Alert.alert('Sign Up Error', err.message);
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
      <Text style={styles.title}>Create Account</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.formFields}>
        <EnhancedInput
          label="Email"
          placeholder="example@email.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
          showClearButton
          animateLabel
          error={email && !validateEmail(email) ? 'Please enter a valid email' : ''}
        />
        <EnhancedInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          editable={!loading}
          animateLabel
          error={password && password.length < 6 ? 'Password must be at least 6 characters' : ''}
        />
        <EnhancedInput
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          editable={!loading}
          animateLabel
          error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : ''}
        />
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
            <Text style={styles.socialButtonText}>Sign up with Apple</Text>
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
      loginLink: {
        alignItems: 'center',
        marginTop: spacing.lg,
      },
      loginText: {
        color: colors.primary.white,
        fontSize: typography.fontSize.md,
        textAlign: 'center',
      },
      loginTextBold: {
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
      formFields: {
        marginBottom: spacing.lg,
        width: '100%',
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
      socialButtonsContainer: {
        marginTop: spacing.lg,
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