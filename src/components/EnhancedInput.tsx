import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { 
  TextInput, 
  StyleSheet, 
  TextInputProps, 
  View, 
  Text, 
  Animated,
  TouchableOpacity,
  Platform
} from 'react-native';
import { colors, spacing, typography } from '../design-system/theme';

interface EnhancedInputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  showClearButton?: boolean;
  animateLabel?: boolean;
}

export const EnhancedInput = forwardRef<TextInput, EnhancedInputProps>(({ 
  label, 
  error,
  icon,
  showClearButton = false,
  animateLabel = true,
  style,
  value,
  onChangeText,
  onFocus,
  onBlur,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const inputRef = useRef<TextInput>(null);
  const labelAnimation = useRef(new Animated.Value(hasValue || isFocused ? 1 : 0)).current;

  useImperativeHandle(ref, () => inputRef.current!);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (animateLabel && label) {
      Animated.timing(labelAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (animateLabel && label && !value) {
      Animated.timing(labelAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    onBlur?.(e);
  };

  const handleChangeText = (text: string) => {
    setHasValue(!!text);
    onChangeText?.(text);
  };

  const handleClear = () => {
    inputRef.current?.clear();
    handleChangeText('');
    inputRef.current?.focus();
  };

  const labelStyle = animateLabel ? {
    position: 'absolute' as const,
    left: spacing.lg,
    top: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [spacing.md + 4, -8],
    }),
    fontSize: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [typography.fontSize.md, typography.fontSize.xs],
    }),
    color: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(255,255,255,0.5)', colors.primary.white],
    }),
    backgroundColor: colors.primary.midnight,
    paddingHorizontal: spacing.xs,
  } : {};

  return (
    <View style={styles.wrapper}>
      {label && !animateLabel && (
        <Text style={styles.staticLabel}>{label}</Text>
      )}
      <View style={[
        styles.container, 
        isFocused && styles.focused,
        error && styles.errorBorder,
      ]}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            showClearButton && value && styles.inputWithClear,
            style
          ]}
          placeholderTextColor="rgba(255,255,255,0.5)"
          autoCapitalize="none"
          autoCorrect={false}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={animateLabel || !label ? props.placeholder : ''}
          {...props}
        />
        {label && animateLabel && (
          <Animated.Text 
            style={[styles.animatedLabel, labelStyle]}
            pointerEvents="none"
          >
            {label}
          </Animated.Text>
        )}
        {showClearButton && value && (
          <TouchableOpacity 
            onPress={handleClear}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
});

EnhancedInput.displayName = 'EnhancedInput';

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: spacing.sm,
  },
  staticLabel: {
    color: colors.primary.white,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.medium,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.blueberry,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    minHeight: 56,
  },
  focused: {
    borderColor: colors.primary.orchid,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary.orchid,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  errorBorder: {
    borderColor: colors.semantic.error,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.primary.white,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    ...Platform.select({
      ios: {
        paddingTop: spacing.md + 2,
        paddingBottom: spacing.md - 2,
      },
    }),
  },
  inputWithIcon: {
    paddingLeft: spacing.md,
  },
  inputWithClear: {
    paddingRight: spacing.xs,
  },
  icon: {
    marginLeft: spacing.lg,
  },
  animatedLabel: {
    position: 'absolute',
    fontFamily: typography.fontFamily.medium,
  },
  clearButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  clearButtonText: {
    color: colors.primary.white,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
  },
  error: {
    color: colors.semantic.error,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
    fontFamily: typography.fontFamily.regular,
  },
});