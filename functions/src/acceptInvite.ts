import './admin';
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

type AcceptInviteData = {
  token?: string;
  displayName?: string;
};

// Called by the senior device (anonymous auth) right after it taps "Yes" on
// the pairing-confirm screen. This is the only path that can ever create a
// senior membership doc — firestore.rules blocks direct client writes there.
export const acceptInvite = onCall<AcceptInviteData>(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError('unauthenticated', 'Sign in required.');
  }

  const token = request.data.token;
  if (!token) {
    throw new HttpsError('invalid-argument', 'Missing invite token.');
  }

  const db = getFirestore();
  const inviteRef = db.collection('invites').doc(token);
  const inviteSnap = await inviteRef.get();

  if (!inviteSnap.exists) {
    throw new HttpsError('not-found', 'This invite link is invalid.');
  }

  const invite = inviteSnap.data()!;
  if (invite.used) {
    throw new HttpsError('failed-precondition', 'This invite link has already been used.');
  }
  const expiresAt = invite.expiresAt as Timestamp;
  if (expiresAt.toDate() < new Date()) {
    throw new HttpsError('failed-precondition', 'This invite link has expired.');
  }

  const familyId = invite.familyId as string;
  const memberRef = db.doc(`families/${familyId}/members/${uid}`);

  const batch = db.batch();
  batch.set(memberRef, {
    role: 'senior',
    authType: 'anonymous',
    displayName: request.data.displayName || 'Me',
    joinedAt: FieldValue.serverTimestamp(),
  });
  batch.update(inviteRef, {
    used: true,
    usedAt: FieldValue.serverTimestamp(),
    usedBy: uid,
  });
  batch.set(db.doc(`users/${uid}`), { familyId });
  await batch.commit();

  const familyDoc = await db.doc(`families/${familyId}`).get();
  return { familyId, familyName: (familyDoc.data()?.name as string | undefined) ?? null };
});
