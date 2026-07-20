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

// Firebase requires E.164 format (+<country code><number>). Helpers will
// naturally type a plain 10-digit US number without a country code, so we
// fill in +1 rather than making them know to type it themselves.
export function normalizePhoneNumber(input: string): string {
  const stripped = input.replace(/[^\d+]/g, '');
  if (stripped.startsWith('+')) return stripped;
  if (stripped.length === 10) return `+1${stripped}`;
  return `+${stripped}`;
}

export function sendPhoneVerificationCode(phoneNumber: string): Promise<FirebaseAuthTypes.ConfirmationResult> {
  return auth().signInWithPhoneNumber(normalizePhoneNumber(phoneNumber));
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
