# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MeanderingSleep is a React Native audio player app focused on sleep and meditation content. The app features Firebase authentication, a custom audio player using react-native-track-player, and a well-structured design system.

## Development Commands

### Setup
```bash
npm install
# Download GoogleService-Info.plist from Firebase and add to ios/
# Download google-services.json from Firebase and add to android/app/
```

### Running the app
```bash
# Start Metro bundler
npx react-native start

# Run on iOS
npx react-native run-ios

# Run on Android
npx react-native run-android
```

### Testing and Quality
```bash
# Run tests
npm test

# Run linter
npm run lint

# Apply patches after install
npm run postinstall
```

## Architecture

### Authentication Flow
- **Context-based auth**: `src/contexts/AuthContext.tsx` manages Firebase authentication state
- **Conditional rendering**: App.tsx renders LoginScreen or MainApp based on auth state
- **Firebase Auth methods**: signIn, signUp, signOut, resetPassword

### Audio Player Architecture
- **Component**: `src/components/AudioPlayer.tsx` - UI for playback controls
- **Services**:
  - `PlaybackService.ts` - Handles remote control events and playback state
  - `SetupService.ts` - Configures track player capabilities
  - `QueueInitialTracksService.ts` - Loads playlist from JSON

### Design System
Located in `src/design-system/`:
- **Theme**: Centralized colors, typography, and spacing
- **Components**: Button, FormField, Logo - all use theme system
- **Consistent styling**: All components reference the theme object

### State Management
- Local component state with useState
- AuthContext for authentication
- react-native-track-player hooks for audio state
- No global state management library

## Development Workflow

1. Work on `dev` branch for feature development
2. Test thoroughly before merging
3. Submit PR to `main` branch
4. Build iOS/Android in Codemagic (requires version bump in codemagic.yaml)

## Key Technologies
- React Native 0.73.6
- TypeScript 5.0.4
- Firebase Auth & App
- react-native-track-player 4.0.1
- react-native-linear-gradient 2.8.3

## Project Structure
- `/src/components/` - Reusable UI components
- `/src/contexts/` - React contexts (authentication)
- `/src/design-system/` - Theme and design components
- `/src/screens/` - Screen components
- `/src/services/` - Business logic and audio services
- `/src/assets/` - Images, audio files, and data