import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View, Text } from 'react-native';
import { colors, spacing, typography } from '../design-system/theme';

interface SimpleInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const SimpleInput: React.FC<SimpleInputProps> = ({ 
  label, 
  error,
  style,
  ...props 
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="rgba(255,255,255,0.5)"
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  label: {
    color: colors.primary.white,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.medium,
  },
  input: {
    backgroundColor: colors.primary.blueberry,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.primary.white,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    borderWidth: 1,
    borderColor: colors.primary.blueberry,
  },
  error: {
    color: colors.semantic.error,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.regular,
  },
});