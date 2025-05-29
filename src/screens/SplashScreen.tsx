import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Button } from '../design-system/components/Button';
import { Logo } from '../design-system/components/Logo';
import { colors, typography, spacing } from '../design-system/theme';

export const SplashScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      {/* You can use ImageBackground here if you want a background image */}
      <Logo style={styles.logo} />
      <Button
        title="Continue"
        onPress={() => navigation.navigate('SignUp')}
        variant="primary"
        size="large"
        style={styles.button}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.loginLink}
      >
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginTextBold}>Log In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.nocturne, // or your splash bg color
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  logo: {
    marginBottom: spacing.xl,
  },
  headline: {
    color: colors.primary.white,
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  button: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    color: colors.primary.white,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
  loginTextBold: {
    color: colors.primary.orchid, // or your accent color
    fontWeight: 'bold',
  },
}); 