import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface FormFieldProps extends TextInputProps {
  icon?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ icon, style, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, isFocused && styles.focused, style]}>
      <TextInput
        style={styles.input}
        placeholderTextColor="rgba(255,255,255,0.7)"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {icon ? <View style={styles.icon}>{icon}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.blueberry,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.sm / 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  focused: {
    borderColor: colors.primary.orchid,
  },
  input: {
    flex: 1,
    color: colors.primary.white,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.regular,
    paddingVertical: spacing.md,
  },
  icon: {
    marginLeft: spacing.md,
  },
}); 