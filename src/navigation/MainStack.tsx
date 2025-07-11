import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StatusBar, StyleSheet, View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { MainStackParamList } from './types';
import { Logo } from '../design-system/components/Logo';
import AudioPlayer from '../components/AudioPlayer';
import { colors, typography, spacing } from '../design-system/theme';

const Stack = createStackNavigator<MainStackParamList>();

function MainScreen() {
  const [showPlayer, setShowPlayer] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleCategoryPress = (category: string) => {
    console.log(`Pressed ${category}`);
    setShowPlayer(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary.nocturne} />
      {showPlayer ? (
        <View style={styles.playerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowPlayer(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <AudioPlayer />
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Logo />
          </View>
          
          <Text style={styles.greeting}>
            {getGreeting()}
          </Text>

          <View style={styles.categoriesContainer}>
            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('Meandering Stories')}
              activeOpacity={0.8}
            >
              <Image 
                source={require('../assets/resources/meandering_story_icon.png')}
                style={styles.categoryIcon}
                resizeMode="contain"
              />
              <Text style={styles.categoryTitle}>Meandering{'\n'}Stories</Text>
              <Text style={styles.categoryAuthor}>Sally</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('Boring Lectures')}
              activeOpacity={0.8}
            >
              <Image 
                source={require('../assets/resources/boring_lecture_icon.png')}
                style={styles.categoryIcon}
                resizeMode="contain"
              />
              <Text style={styles.categoryTitle}>Boring{'\n'}Lectures</Text>
              <Text style={styles.categoryAuthor}>Sally</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={MainScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.nocturne,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl * 2,
  },
  greeting: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.primary.white,
    marginBottom: spacing.xl * 2,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: colors.primary.eclipse,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    minHeight: 200,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    marginBottom: spacing.lg,
  },
  categoryTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  categoryAuthor: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.secondary.lavender,
  },
  playerContainer: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  backButtonText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary.orchid,
  },
});