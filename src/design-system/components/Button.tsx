import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { colors, typography, spacing } from '../theme';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.primary.blueberry;
    switch (variant) {
      case 'primary':
        return colors.primary.orchid;
      case 'secondary':
        return colors.primary.blueberry;
      default:
        return colors.primary.orchid;
    }
  };

  const getTextColor = () => {
    return colors.primary.white;
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return spacing.md;
      case 'large':
        return spacing.xl;
      default:
        return spacing.lg;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          paddingVertical: getPadding(),
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: typography.fontSize[size === 'small' ? 'md' : size === 'large' ? 'xl' : 'lg'],
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon ? <>{icon}</> : null}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: spacing.sm / 2,
  },
  text: {
    fontFamily: typography.fontFamily.medium,
    fontWeight: typography.fontWeight.medium,
  },
}); 