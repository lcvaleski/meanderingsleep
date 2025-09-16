import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../design-system/theme';

interface UpgradeCardProps {
  onPress?: () => void;
  style?: ViewStyle;
}

const UpgradeCard: React.FC<UpgradeCardProps> = ({onPress, style}) => {
  return (
    <Pressable
      style={({pressed}) => [
        styles.container,
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}>
      <LinearGradient
        colors={['#545191', '#7B88CB']}
        start={{x: 0.8, y: 1}}
        end={{x: 0.2, y: 0}}
        style={styles.gradient}>
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumText}>PREMIUM</Text>
        </View>
        <Text style={styles.title}>Upgrade for full access</Text>
        <Text style={styles.subtitle}>
          Full length daily stories + lectures and access to full audio library
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    overflow: 'hidden',
    width: '100%',
  },
  gradient: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },
  pressed: {
    opacity: 0.9,
  },
  premiumBadge: {
    backgroundColor: theme.colors.primary.orchid,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  premiumText: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 0.77,
    color: theme.colors.primary.white,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: 'Manrope-Bold',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0.4,
    color: theme.colors.primary.white,
  },
  subtitle: {
    fontFamily: 'Manrope-Medium',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
    letterSpacing: 0.42,
    color: theme.colors.primary.white,
  },
});

export default UpgradeCard;