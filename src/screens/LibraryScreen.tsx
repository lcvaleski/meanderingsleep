import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { colors, typography, spacing } from '../design-system/theme';
import audioLibrary from '../data/audioLibrary.json';
import GoogleStorageService from '../services/GoogleStorageService';

interface LibraryScreenProps {
  selectedTopic: 'meandering' | 'boring';
  selectedGender: 'male' | 'female';
  onSelectAudio: (url: string, title: string) => void;
  onBack: () => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  selectedTopic,
  selectedGender,
  onSelectAudio,
  onBack,
}) => {
  // Filter audios by topic and gender
  const filteredAudios = audioLibrary.audios.filter(
    audio => audio.topic === selectedTopic && audio.gender === selectedGender
  );

  const handleAudioPress = (audio: any) => {
    const url = GoogleStorageService.getLibraryAudioUrl(audio.id, audio.topic, audio.gender);
    const title = `${audio.subtopic}`;
    onSelectAudio(url, title);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {selectedTopic === 'boring' ? 'Boring Lectures' : 'Meandering Stories'}
        </Text>
        <Text style={styles.subtitle}>
          {selectedGender === 'male' ? 'Male Voice' : 'Female Voice'}
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredAudios.map((audio) => (
          <TouchableOpacity
            key={audio.id}
            style={styles.audioItem}
            onPress={() => handleAudioPress(audio)}
            activeOpacity={0.7}
          >
            <Text style={styles.audioTitle}>{audio.subtopic}</Text>
            <Text style={styles.playIcon}>▶</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.nocturne,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButton: {
    paddingVertical: spacing.sm,
  },
  backButtonText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary.orchid,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.primary.white,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.secondary.lavender,
    marginTop: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  audioItem: {
    backgroundColor: colors.primary.eclipse,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audioTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary.white,
    flex: 1,
  },
  playIcon: {
    fontSize: typography.fontSize.xl,
    color: colors.primary.orchid,
    marginLeft: spacing.md,
  },
});