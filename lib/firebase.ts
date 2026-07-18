import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';

// Native Firebase SDKs, not the JS SDK — needed for reliable phone-number
// OTP verification on the helper side (see the switch documented in the
// README / commit history). They auto-configure from GoogleService-Info.plist
// (iOS) and google-services.json (Android) at native build time, so there's
// no initializeApp() call or config object here, and no manual auth
// persistence setup — the native SDK persists sessions on its own.
export { auth, firestore, functions };
