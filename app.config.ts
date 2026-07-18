import { ExpoConfig, ConfigContext } from 'expo/config';

// Loaded from .env (gitignored) — see .env.example for what's required.
const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'easymap-app',
  slug: 'easymap-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'easymap',
  userInterfaceStyle: 'light',
  plugins: [
    'expo-router',
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'EasyMap uses your location to show you where you are and find places near you.',
      },
    ],
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.easymap.app',
    googleServicesFile: './GoogleService-Info.plist',
    config: {
      googleMapsApiKey,
    },
  },
  android: {
    package: 'com.easymap.app',
    googleServicesFile: './google-services.json',
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    config: {
      googleMaps: {
        apiKey: googleMapsApiKey,
      },
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
});
