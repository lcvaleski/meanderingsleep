# Complete Guide to Forking MeanderingSleep App

This guide provides step-by-step instructions for forking the MeanderingSleep app into a completely new app with different audio content for App Store/Play Store publication.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Project Setup](#initial-project-setup)
3. [App Identity Changes](#app-identity-changes)
4. [Firebase Setup](#firebase-setup)
5. [Audio Content Replacement](#audio-content-replacement)
6. [App Icons and Branding](#app-icons-and-branding)
7. [Native Code Updates](#native-code-updates)
8. [Third-Party Services](#third-party-services)
9. [Codemagic CI/CD Setup](#codemagic-cicd-setup)
10. [App Store Preparation](#app-store-preparation)
11. [Testing Checklist](#testing-checklist)
12. [Common Issues and Solutions](#common-issues-and-solutions)

## Prerequisites

Before starting, ensure you have:
- [ ] Apple Developer Account ($99/year)
- [ ] Google Play Developer Account ($25 one-time)
- [ ] Firebase account (free tier available)
- [ ] RevenueCat account (optional, for in-app purchases)
- [ ] Codemagic account (optional, for CI/CD)
- [ ] macOS with Xcode installed (for iOS development)
- [ ] Android Studio installed
- [ ] Node.js 18+ and npm installed
- [ ] React Native development environment set up

## Initial Project Setup

### 1. Clone and Rename the Project

```bash
# Clone the repository
git clone [original-repo] your-new-app-name
cd your-new-app-name

# Remove the original git history
rm -rf .git

# Initialize new git repository
git init
git add .
git commit -m "Initial fork from MeanderingSleep"
```

### 2. Choose Your App Details

Decide on:
- **App Name**: Your app's name (e.g., "RelaxingSounds")
- **Display Name**: What users see (e.g., "Relaxing Sounds")
- **Bundle ID**: Unique identifier (e.g., "com.yourcompany.relaxingsounds")
- **Package Name**: Same as bundle ID for consistency

## App Identity Changes

### 1. Update Root Configuration Files

#### `/app.json`
```json
{
  "name": "YourAppName",
  "displayName": "Your Display Name"
}
```

#### `/package.json`
```json
{
  "name": "yourappname",
  "version": "1.0.0"
}
```

### 2. Android Package Name Updates

#### Update Package Name Structure
1. Create new directory structure matching your package name:
   ```bash
   # Example: changing from net.coventry.sleepless to com.yourcompany.yourapp
   mkdir -p android/app/src/main/java/com/yourcompany/yourapp
   ```

2. Move Java files to new directory:
   ```bash
   mv android/app/src/main/java/net/coventry/sleepless/*.java android/app/src/main/java/com/yourcompany/yourapp/
   ```

3. Update package declarations in both Java files:
   - `MainActivity.java`
   - `MainApplication.java`
   
   Change: `package net.coventry.sleepless;`
   To: `package com.yourcompany.yourapp;`

#### `/android/app/build.gradle`
```gradle
android {
    namespace "com.yourcompany.yourapp"
    defaultConfig {
        applicationId "com.yourcompany.yourapp"
    }
}
```

#### `/android/app/src/main/AndroidManifest.xml`
Update the package attribute if present.

#### `/android/app/src/main/res/values/strings.xml`
```xml
<resources>
    <string name="app_name">Your App Name</string>
</resources>
```

### 3. iOS Bundle Identifier Updates

#### Using Xcode (Recommended)
1. Open `/ios/MeanderingSleepApp.xcworkspace` in Xcode
2. Select the project in the navigator
3. Change:
   - Product Name
   - Bundle Identifier
   - Display Name
4. Rename the scheme from "MeanderingSleepApp" to your app name

#### Manual Updates
- Search and replace `net.coventry.sleepless` with your bundle ID in:
  - `/ios/MeanderingSleepApp.xcodeproj/project.pbxproj`
  - All `.pbxproj` files

### 4. Rename iOS Directories

```bash
# Rename main app directory
mv ios/MeanderingSleepApp ios/YourAppName

# Rename project files
mv ios/MeanderingSleepApp.xcodeproj ios/YourAppName.xcodeproj
mv ios/MeanderingSleepApp.xcworkspace ios/YourAppName.xcworkspace

# Rename test directory
mv ios/MeanderingSleepAppTests ios/YourAppNameTests

# Update internal references
# You'll need to update all references to "MeanderingSleepApp" in .pbxproj files
```

### 5. Update Native Module Names

#### `/ios/YourAppName/AppDelegate.mm`
```objc
self.moduleName = @"YourAppName";
```

#### `/android/app/src/main/java/com/yourcompany/yourapp/MainActivity.java`
```java
@Override
protected String getMainComponentName() {
    return "YourAppName";
}
```

## Firebase Setup

### 1. Create New Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Add both iOS and Android apps with your new bundle IDs

### 2. Download Configuration Files

#### Android
1. Download `google-services.json`
2. Replace `/android/app/google-services.json`

#### iOS
1. Download `GoogleService-Info.plist`
2. Replace both:
   - `/ios/YourAppName/GoogleService-Info.plist`
   - `/ios/GoogleService-Info.plist` (if exists)
3. Add to Xcode project:
   - Right-click your app folder in Xcode
   - "Add Files to YourAppName..."
   - Select `GoogleService-Info.plist`
   - Check "Copy items if needed"

### 3. Update OAuth URL Schemes

In `/ios/YourAppName/Info.plist`, update the Google Sign-In URL scheme:
```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>YOUR_REVERSED_CLIENT_ID</string>
        </array>
    </dict>
</array>
```

Get the reversed client ID from your `GoogleService-Info.plist`.

## Audio Content Replacement

### 1. Prepare Your Audio Files

- Format: MP3 or M4A recommended
- Optimize file sizes (consider compression)
- Consistent naming convention
- Prepare cover art for each track (optional)

### 2. Update Playlist Configuration

Edit `/src/assets/data/playlist.json`:
```json
[
  {
    "title": "Your Track Title",
    "artist": "Your Artist Name",
    "artwork": "https://your-cdn.com/track1-artwork.jpg",
    "url": "https://your-cdn.com/track1.mp3",
    "duration": 180
  }
  // Add more tracks...
]
```

### 3. Host Your Audio Files

Options:
- Firebase Storage (integrated with your Firebase project)
- AWS S3
- Any CDN service
- Bundle with app (increases app size significantly)

### 4. Update Default Artwork

Replace `/src/assets/resources/night_scene_thumbnail.png` with your default track artwork.

## App Icons and Branding

### 1. Generate App Icons

Use a service like [App Icon Generator](https://www.appicon.co/) to create all required sizes.

### 2. Replace Android Icons

Replace all files in these directories:
- `/android/app/src/main/res/mipmap-hdpi/`
- `/android/app/src/main/res/mipmap-mdpi/`
- `/android/app/src/main/res/mipmap-xhdpi/`
- `/android/app/src/main/res/mipmap-xxhdpi/`
- `/android/app/src/main/res/mipmap-xxxhdpi/`

Files to replace:
- `ic_launcher.png`
- `ic_launcher_round.png`
- `ic_launcher_foreground.png`

### 3. Replace iOS Icons

Replace all files in `/ios/YourAppName/Images.xcassets/AppIcon.appiconset/`

Update `/ios/YourAppName/Images.xcassets/AppIcon.appiconset/Contents.json` if needed.

### 4. Update Logo Images

Replace:
- `/src/assets/logo.png`
- `/src/assets/splash/logo.png`

### 5. Update Launch Screen (iOS)

Edit `/ios/YourAppName/LaunchScreen.storyboard` in Xcode to customize the splash screen.

## Third-Party Services

### 1. RevenueCat Setup (Optional - for In-App Purchases)

1. Create a [RevenueCat](https://www.revenuecat.com/) account
2. Create new project
3. Add your iOS and Android apps
4. Get API keys for both platforms

### 2. Update Environment Configuration

Create `.env` file (don't commit this):
```bash
REVENUECAT_IOS_API_KEY=your_ios_api_key
REVENUECAT_ANDROID_API_KEY=your_android_api_key
```

## Codemagic CI/CD Setup

### 1. Update `/codemagic.yaml`

Replace all app-specific values:

```yaml
workflows:
  react-native-android:
    environment:
      vars:
        PACKAGE_NAME: "com.yourcompany.yourapp"
        APP_VERSION: "1.0.0"
    
  react-native-ios:
    environment:
      vars:
        APP_STORE_APPLE_ID: YOUR_APP_STORE_ID
        BUNDLE_ID: "com.yourcompany.yourapp"
        APP_VERSION: "1.0.0"
        XCODE_WORKSPACE: "YourAppName.xcworkspace"
        XCODE_SCHEME: "YourAppName"
```

### 2. Configure Codemagic Environment Variables

In Codemagic dashboard, set:
- `REVENUECAT_IOS_API_KEY`
- `REVENUECAT_ANDROID_API_KEY`
- `ANDROID_FIREBASE_CONFIG` (base64 encoded google-services.json)
- `IOS_FIREBASE_CONFIG` (base64 encoded GoogleService-Info.plist)

### 3. Set Up Code Signing

#### iOS
1. Generate certificates and provisioning profiles in Apple Developer Portal
2. Upload to Codemagic
3. Configure in workflow

#### Android
1. Generate keystore:
   ```bash
   keytool -genkey -v -keystore your-app-release.keystore -alias your-app-alias -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Upload to Codemagic
3. Configure in workflow

## App Store Preparation

### 1. Apple App Store

1. Create app in [App Store Connect](https://appstoreconnect.apple.com)
2. Prepare:
   - App description
   - Keywords
   - Screenshots (6.7", 6.5", 5.5" displays)
   - App preview video (optional)
   - Privacy policy URL
   - Support URL

### 2. Google Play Store

1. Create app in [Google Play Console](https://play.google.com/console)
2. Prepare:
   - Short description (80 chars)
   - Full description (4000 chars)
   - Screenshots (phone and tablet)
   - Feature graphic (1024x500)
   - Privacy policy URL
   - Content rating questionnaire

### 3. Privacy Policy

Create a privacy policy that covers:
- Audio streaming
- Firebase Analytics (if used)
- Authentication data
- RevenueCat (if using in-app purchases)

## Testing Checklist

### Pre-Release Testing

- [ ] Clean install and test on iOS device
- [ ] Clean install and test on Android device
- [ ] Test all audio playback features
- [ ] Test authentication flow (sign up, sign in, sign out)
- [ ] Test on different screen sizes
- [ ] Test offline functionality
- [ ] Test background audio playback
- [ ] Test lock screen controls
- [ ] Verify all branding is updated
- [ ] No references to "MeanderingSleep" remain

### Build Testing

```bash
# iOS Release Build
cd ios
xcodebuild -workspace YourAppName.xcworkspace -scheme YourAppName -configuration Release -archivePath YourAppName.xcarchive archive

# Android Release Build
cd android
./gradlew assembleRelease
```

## Common Issues and Solutions

### Issue: Build fails with "MeanderingSleepApp" not found

**Solution**: Ensure all references in native code are updated:
- AppDelegate.mm
- MainActivity.java
- app.json name field

### Issue: Firebase crashes on startup

**Solution**: 
1. Verify configuration files are correctly placed
2. Ensure Firebase is initialized in AppDelegate.mm
3. Check bundle IDs match Firebase configuration

### Issue: Audio doesn't play

**Solution**:
1. Verify audio URLs are accessible
2. Check audio format compatibility
3. Test with sample URLs first
4. Check Info.plist audio background mode is enabled

### Issue: iOS build fails with signing errors

**Solution**:
1. Ensure provisioning profiles include all capabilities
2. Verify bundle ID matches profiles
3. Check team ID is correct

### Issue: Android package name errors

**Solution**:
1. Ensure directory structure matches package name
2. Clean and rebuild: `cd android && ./gradlew clean`
3. Verify all package declarations are updated

## Final Steps

1. **Test Everything**: Do a complete app walkthrough
2. **Version Control**: Commit all changes to your new repository
3. **Documentation**: Update README.md with your app information
4. **Legal**: Ensure you have rights to all audio content
5. **Submit**: Use Codemagic or manual builds to submit to stores

## Maintenance

Remember to update:
- Version numbers in `package.json` and `codemagic.yaml` for each release
- Firebase configuration if you change bundle IDs
- Audio content URLs if they change
- Privacy policy for any new features

Good luck with your new app! 🚀