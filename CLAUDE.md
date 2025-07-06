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

## Working Dependency Configuration

### Critical Dependencies for Android Build
These exact versions are known to work together without patches:

```json
{
  "react-native": "0.73.6",
  "react-native-screens": "^3.29.0",
  "@react-navigation/native": "6.1.9",
  "@react-navigation/stack": "6.3.20",
  "react-native-gesture-handler": "2.14.0",
  "react-native-safe-area-context": "4.5.0"
}
```

### Android Build Configuration
```gradle
compileSdkVersion = 34  // DO NOT use 35 - causes react-native-screens errors
targetSdkVersion = 34
minSdkVersion = 26
buildToolsVersion = "34.0.0"
kotlinVersion = "1.8.0"
```

### Key Fixes Applied
1. **Downgraded compileSdkVersion from 35 to 34** - SDK 35 has known incompatibilities with react-native-screens
2. **Upgraded react-native-screens from 3.20.0 to 3.29.0** - This version includes fixes for Canvas type errors
3. **Cleared Metro cache and reinstalled @react-navigation packages** - Fixed module resolution issues

### When Issues Occur
1. Clear Metro cache: `npx react-native start --reset-cache`
2. Clean Android build: `cd android && ./gradlew clean`
3. Remove and reinstall navigation packages: `rm -rf node_modules/@react-navigation && npm install`

## iOS Setup and Troubleshooting

### App Name Configuration
The app name must be consistent across all configurations:
- `app.json`: `"name": "MeanderingSleepApp"`
- iOS: `AppDelegate.mm` - `self.moduleName = @"MeanderingSleepApp"`
- Android: `MainActivity.java` - `return "MeanderingSleepApp"`

### Firebase iOS Setup
1. **GoogleService-Info.plist Location**: Must be in `ios/MeanderingSleepApp/` directory
2. **Add to Xcode Project**:
   - Right-click MeanderingSleepApp folder in Xcode
   - Select "Add Files to MeanderingSleepApp..."
   - Select GoogleService-Info.plist
   - Ensure "Copy items if needed" is checked
3. **Native Initialization**: Added to `AppDelegate.mm`:
   ```objc
   #import <Firebase.h>
   
   - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
     [FIRApp configure];
     // ... rest of method
   }
   ```

### iOS Build Issues and Solutions
1. **Architecture Mismatch (x86_64 vs arm64)**:
   - Disabled Fabric/New Architecture: `Podfile` - `:fabric_enabled => false`
   - Added architecture fixes to Podfile post_install
   - Excluded x86_64 for simulator builds

2. **Build System Issues**:
   - Clean derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData/MeanderingSleepApp-*`
   - Kill stuck builds: `pkill xcodebuild`
   - Reinstall pods: `cd ios && pod install --repo-update`

3. **Xcode Build Process**:
   - Open `ios/MeanderingSleepApp.xcworkspace` (not .xcodeproj)
   - Select scheme: MeanderingSleepApp
   - Select simulator: iPhone 16 Plus
   - Clean build folder: Shift+Cmd+K
   - Build and run: Cmd+R

### Running on Specific iOS Simulator
```bash
# Run on specific simulator
npx react-native run-ios --simulator="iPhone 16 Plus"

# List available simulators
xcrun simctl list devices
```

### Common iOS Errors
1. **"MeanderingSleepApp" has not been registered**: App name mismatch between JS and native
2. **No Firebase App '[DEFAULT]'**: GoogleService-Info.plist not properly linked or Firebase not initialized
3. **PIF transfer session error**: Build system conflict, requires cleaning derived data