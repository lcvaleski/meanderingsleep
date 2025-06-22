import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
// import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../design-system/components/Button';
import { FormField } from '../../design-system/components/FormField';
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
  // const { signUp, loading, signInWithGoogle } = useAuth();
  const loading = false; // Placeholder

  const isFormValid =
    !!email &&
    !!password &&
    !!confirmPassword &&
    validateEmail(email) &&
    password.length >= 6 &&
    password === confirmPassword;

  const handleSignUp = async () => {
    // Placeholder
    console.log('Signing up with:', email, password);
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
              source={require('../../../assets/apple-icon.png')}
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
            source={require('../../../assets/google-icon.png')}
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
        backgroundColor: colors.primary.nocturne,
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
        backgroundColor: colors.primary.blueberry_dark,
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