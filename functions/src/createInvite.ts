import './admin';
import { randomBytes } from 'crypto';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

const INVITE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

type CreateInviteData = {
  familyId?: string;
  familyName?: string;
};

// Called by a helper. Membership documents are only ever written here (via
// the Admin SDK, which bypasses firestore.rules) — never by a direct client
// write — so pairing always goes through a real invite.
export const createInvite = onCall<CreateInviteData>(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError('unauthenticated', 'Sign in required.');
  }

  const db = getFirestore();
  let familyId = request.data.familyId;

  if (!familyId) {
    const familyRef = db.collection('families').doc();
    familyId = familyRef.id;
    const batch = db.batch();
    batch.set(familyRef, {
      name: request.data.familyName || 'My Family',
      createdBy: uid,
      createdAt: FieldValue.serverTimestamp(),
    });
    batch.set(familyRef.collection('members').doc(uid), {
      role: 'helper',
      authType: 'phone',
      joinedAt: FieldValue.serverTimestamp(),
    });
    await batch.commit();
  } else {
    const memberDoc = await db.doc(`families/${familyId}/members/${uid}`).get();
    if (!memberDoc.exists || memberDoc.data()?.role !== 'helper') {
      throw new HttpsError('permission-denied', 'You are not a helper in this family.');
    }
  }

  const token = randomBytes(16).toString('hex');
  const expiresAt = new Date(Date.now() + INVITE_TTL_MS);

  await db.collection('invites').doc(token).set({
    familyId,
    createdBy: uid,
    createdAt: FieldValue.serverTimestamp(),
    expiresAt,
    used: false,
  });

  return { token, familyId };
});
