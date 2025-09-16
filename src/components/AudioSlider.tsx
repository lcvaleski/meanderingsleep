import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { colors, typography, spacing } from '../design-system/theme';

export interface AudioTrack {
  topic: string;
  subtopic: string;
  id: string;
  gender: 'male' | 'female';
}

interface AudioSliderProps {
  title: string;
  tracks: AudioTrack[];
  onTrackPress: (track: AudioTrack) => void;
  accentColor: string;
  onViewAllPress?: () => void;
}

const CARD_WIDTH = 219;
const CARD_GAP = 20;

export function AudioSlider({ title, tracks, onTrackPress, accentColor, onViewAllPress }: AudioSliderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onViewAllPress && (
          <TouchableOpacity onPress={onViewAllPress} activeOpacity={0.7} style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <Text style={styles.viewAllCaret}>›</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
      >
        {tracks.map((track) => (
          <TouchableOpacity
            key={track.id}
            style={styles.card}
            onPress={() => onTrackPress(track)}
            activeOpacity={0.8}
          >
            <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
            <View style={styles.cardContent}>
              <Text style={styles.trackTitle} numberOfLines={1}>
                {track.subtopic}
              </Text>
              <Text style={styles.trackNarrator}>
                {track.gender}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary.white,
    letterSpacing: 0.42,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.primary.blueberry,
    width: CARD_WIDTH,
    height: 76,
    borderRadius: 6,
    marginRight: CARD_GAP,
    overflow: 'hidden',
    position: 'relative',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 5,
    height: '100%',
  },
  cardContent: {
    padding: spacing.lg,
    justifyContent: 'center',
    flex: 1,
  },
  trackTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary.white,
    marginBottom: spacing.xs,
    letterSpacing: 0.48,
  },
  trackNarrator: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary.white,
    letterSpacing: 0.42,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary.white,
    letterSpacing: 0.42,
  },
  viewAllCaret: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.regular,
    color: colors.primary.white,
    marginTop: -2,
  },
});