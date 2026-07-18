import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { auth } from './firebase';

// Senior devices never see a login screen — this is called silently right
// before reading/accepting an invite.
export async function signInAnonymouslyIfNeeded(): Promise<FirebaseAuthTypes.User> {
  const current = auth().currentUser;
  if (current) return current;
  const credential = await auth().signInAnonymously();
  return credential.user;
}

export function sendPhoneVerificationCode(phoneNumber: string): Promise<FirebaseAuthTypes.ConfirmationResult> {
  return auth().signInWithPhoneNumber(phoneNumber);
}

export async function confirmPhoneVerificationCode(
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  code: string
): Promise<FirebaseAuthTypes.User> {
  const credential = await confirmation.confirm(code);
  if (!credential) {
    throw new Error('Could not confirm the code.');
  }
  return credential.user;
}
