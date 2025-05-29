import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../design-system/components/Button';
import { colors, typography, spacing } from '../design-system/theme';

export const MainScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.replace('AuthLoading');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {user?.email}</Text>
      <Button
        title="Logout"
        onPress={handleLogout}
        variant="primary"
        size="large"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background.default,
  },
  welcomeText: {
    fontSize: typography.fontSize.xl,
    marginBottom: spacing.lg,
    fontFamily: typography.fontFamily.medium,
    color: colors.neutral.gray900,
  },
}); 