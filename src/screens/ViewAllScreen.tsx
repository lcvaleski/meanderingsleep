import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, typography, spacing } from '../design-system/theme';
import { useNavigation } from '@react-navigation/native';
import { AudioTrack } from '../components/AudioSlider';

interface ViewAllScreenProps {
  route: {
    params: {
      title: string;
      tracks: AudioTrack[];
      onTrackPress: (track: AudioTrack) => void;
      accentColor: string;
    };
  };
}

export const ViewAllScreen = ({ route }: ViewAllScreenProps) => {
  const { title, tracks, onTrackPress, accentColor } = route.params;
  const navigation = useNavigation();

  const handleTrackPress = (track: AudioTrack) => {
    navigation.goBack();
    setTimeout(() => {
      onTrackPress(track);
    }, 100);
  };

  const iconSource = title.includes('Meandering') 
    ? require('../assets/resources/meandering_story_icon.png')
    : require('../assets/resources/boring_lecture_icon.png');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.handleBar} />
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Image 
            source={iconSource}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        {/* Tracks List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {tracks.map((track) => (
            <TouchableOpacity
              key={track.id}
              style={styles.trackItem}
              onPress={() => handleTrackPress(track)}
              activeOpacity={0.7}
            >
              <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
              <View style={styles.trackContent}>
                <Text style={styles.trackTitle}>{track.subtopic}</Text>
                <Text style={styles.trackGender}>{track.gender}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.nocturne,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700',
    color: colors.primary.white,
  },
  icon: {
    width: 40,
    height: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg + 4,
    paddingBottom: spacing.xl,
  },
  trackItem: {
    backgroundColor: 'rgba(61, 52, 113, 0.7)',
    borderRadius: 8,
    marginBottom: spacing.md + 4,
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
  trackContent: {
    flexDirection: 'column',
    padding: spacing.md,
    paddingLeft: spacing.md + 8,
  },
  trackTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary.white,
    marginBottom: spacing.xs,
  },
  trackGender: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'capitalize',
  },
});