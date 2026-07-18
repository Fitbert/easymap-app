import AsyncStorage from '@react-native-async-storage/async-storage';
// Imported from @firebase/auth directly, not the "firebase/auth" wrapper —
// the wrapper package's export map is missing a "react-native" condition,
// so it resolves to the browser build, which doesn't have this function.
import { initializeAuth } from '@firebase/auth';
// @ts-expect-error — getReactNativePersistence exists in @firebase/auth's
// react-native build at runtime, but its shared .d.ts (which TS resolves to
// regardless of the react-native exports condition) doesn't declare it.
// Known upstream typing gap, not a real missing export.
import { getReactNativePersistence } from '@firebase/auth';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Deliberately no measurementId / Firebase Analytics here — no analytics
// SDKs or trackers per spec, even though Analytics is "free."
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// AsyncStorage persistence so a signed-in session survives an app restart —
// otherwise every launch would need re-auth (an OTP prompt for the helper,
// or re-accepting the invite for the senior).
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
