This is the refactor of Meandering Sleep to react-native from Flutter. CI/CD is with Codemagic which builds and publishes new versions to App Store Connect / Google Play.

# Development

Do all feature development on branch `dev`. When done, test. After this, submit a PR for `main` and then build iOS/Android in Codemagic.

# Setup

- Clone the repo
- `npm install`
- Go to the Firebase project and download:
    * `GoogleService-Info.plist`, add this to the `ios` dir.
    * `google-services.json`, add this to the `/android/app/` dir.

# Testing

Currently, completely basic.

`npm test`

# Running

First, make sure your Metro dev server is running:
`npx react-native start`

Then:

`npx react-native run-ios`
`npx react-native run-android`