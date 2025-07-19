# Android Deployment Guide - Premium VIN Scanner

## 🚀 Deployment Options

### Option 1: Quick Development Build (Recommended for Testing)

For testing on your own device or sharing with testers:

```bash
# Build and install directly on connected device
npm run android

# Or if you have issues with the above
npx expo run:android
```

**Requirements:**
- Android device connected via USB with USB debugging enabled
- Or Android emulator running

### Option 2: EAS Build - APK for Testing (Recommended)

For creating installable APK files to share:

```bash
# Build preview APK (can be shared via link)
npx eas build --platform android --profile preview

# Build development version for testing
npx eas build --platform android --profile development
```

### Option 3: EAS Build - Production AAB for Google Play Store

For Google Play Store submission:

```bash
# Build production Android App Bundle
npx eas build --platform android --profile production
```

## 🔐 Production Setup (Required for Google Play)

### 1. Create Production Keystore

For production builds, you need to create a production keystore:

```bash
# Generate production keystore
keytool -genkeypair -v -keystore production.keystore -alias production-key -keyalg RSA -keysize 2048 -validity 10000

# Store it securely - this will be needed for all future updates!
```

### 2. Configure Signing in EAS

Add your keystore to EAS secrets:

```bash
# Upload keystore to EAS
npx eas secret:create --scope project --name PRODUCTION_KEYSTORE --type file --value ./production.keystore

# Add keystore password
npx eas secret:create --scope project --name PRODUCTION_KEYSTORE_PASSWORD --value YOUR_KEYSTORE_PASSWORD

# Add key password  
npx eas secret:create --scope project --name PRODUCTION_KEY_PASSWORD --value YOUR_KEY_PASSWORD
```

### 3. Update EAS Configuration

Update the production profile in `eas.json`:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "aab",
        "keystore": {
          "keystorePath": "$PRODUCTION_KEYSTORE",
          "keystorePassword": "$PRODUCTION_KEYSTORE_PASSWORD",
          "keyAlias": "production-key",
          "keyPassword": "$PRODUCTION_KEY_PASSWORD"
        }
      }
    }
  }
}
```

## 📱 Testing Your Build

### Install APK on Device

1. **Via EAS Build Link:**
   - After build completes, EAS provides a download link
   - Share link with testers or download to device
   - Enable "Install from Unknown Sources" on Android
   - Install the APK

2. **Via ADB:**
   ```bash
   # If you have the APK file locally
   adb install your-app.apk
   ```

### Test Core Features

- ✅ Camera permissions
- ✅ VIN scanning functionality  
- ✅ Barcode scanning
- ✅ Image saving to gallery
- ✅ All screen orientations
- ✅ App icon and splash screen

## 🏪 Google Play Store Submission

### 1. Prepare Store Assets

Create the following assets:

- **App Icon:** 512x512 PNG
- **Feature Graphic:** 1024x500 PNG  
- **Screenshots:** At least 2, up to 8 screenshots
- **Privacy Policy:** Required for camera/storage permissions

### 2. Upload to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app or select existing
3. Upload the production AAB file
4. Fill in store listing details
5. Configure content rating
6. Set up pricing & distribution

### 3. Release Process

```bash
# Build production AAB
npx eas build --platform android --profile production

# Submit to Google Play (optional automated submission)
npx eas submit --platform android --profile production
```

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails:**
   ```bash
   # Clear cache and rebuild
   npm run clean
   npx eas build --platform android --profile preview --clear-cache
   ```

2. **Permissions Issues:**
   - Verify camera permissions in `app.json`
   - Check Android device settings

3. **Keystore Issues:**
   - Ensure keystore passwords are correct
   - Verify key alias matches configuration

### Version Management

Update version before each release:

```json
// app.json
{
  "expo": {
    "version": "1.0.1",  // Increment this
    "android": {
      "versionCode": 2    // Increment this (must be higher than previous)
    }
  }
}
```

## 📋 Pre-Deployment Checklist

- [ ] Test on multiple Android devices/versions
- [ ] Verify all permissions work correctly
- [ ] Test camera and VIN scanning functionality
- [ ] Check app icon and splash screen
- [ ] Update version numbers
- [ ] Create production keystore (for production)
- [ ] Test APK installation process
- [ ] Prepare Google Play store assets

## 🆘 Support

If you encounter issues:

1. Check the [Expo documentation](https://docs.expo.dev)
2. Review [EAS Build documentation](https://docs.expo.dev/build/introduction/)
3. Check build logs in EAS dashboard
4. Verify Android SDK and dependencies

## 📄 Current Configuration

- **Package Name:** `com.anonymous.premiumvinscanner`
- **Permissions:** Camera, Storage (Read/Write)
- **Target SDK:** Latest via Expo SDK 53
- **Supported Orientations:** Portrait, Landscape
- **Key Features:** VIN scanning, barcode scanning, camera integration 