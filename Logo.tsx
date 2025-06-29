import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { spacing } from './src/design-system/theme';

interface LogoProps {
  size?: number;
  style?: any;
}

export const Logo: React.FC<LogoProps> = ({ size = 60, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../../assets/logo.png')}
        style={[styles.logo, { width: size, height: size }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
  },
}); 