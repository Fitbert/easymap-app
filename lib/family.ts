import { auth, firestore } from './firebase';

// Every account in v1 belongs to exactly one family — set by the pairing
// Cloud Functions on users/{uid}. Returns null if not signed in or not
// paired yet.
export async function getMyFamilyId(): Promise<string | null> {
  const uid = auth().currentUser?.uid;
  if (!uid) return null;
  const snap = await firestore().collection('users').doc(uid).get();
  const familyId = snap.data()?.familyId;
  return typeof familyId === 'string' ? familyId : null;
}
