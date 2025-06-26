import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../design-system/components/Button';
import { FormField } from '../../design-system/components/FormField';
import { colors, typography, spacing } from '../../design-system/theme';

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'Success',
        'Password reset email sent. Please check your inbox.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we'll send you instructions to reset your password.
      </Text>
      <FormField
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        editable={!loading}
      />
      <Button
        title="Send Reset Link"
        onPress={handleResetPassword}
        variant="primary"
        size="large"
        style={styles.button}
        loading={loading}
        disabled={!email || loading}
      />
      <Button
        title="Back to Login"
        onPress={() => navigation.goBack()}
        variant="secondary"
        size="small"
        style={styles.backLink}
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
    marginBottom: spacing.md,
    textAlign: 'center',
    color: colors.primary.white,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.primary.white,
    textAlign: 'center',
    marginBottom: spacing.xl,
    fontFamily: typography.fontFamily.regular,
  },
  input: {
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.sm,
  },
  backLink: {
    marginTop: spacing.lg,
  },
}); 