import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { BigButton } from '../../components/BigButton';
import { PrimaryScreen } from '../../components/PrimaryScreen';
import { signInAnonymouslyIfNeeded } from '../../lib/auth';
import { firestore, functions } from '../../lib/firebase';
import { setStoredRole } from '../../lib/role';
import { colors, fontSize, spacing } from '../../lib/theme';

type Status = 'loading' | 'ready' | 'joining' | 'error';

// This is the whole senior-side pairing flow: tap the link, see this
// screen, tap Yes. No typed code, no password — see the approved flow.
export default function JoinFamily() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const [familyName, setFamilyName] = useState('Your family');
  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        await signInAnonymouslyIfNeeded();
        const inviteSnap = await firestore().collection('invites').doc(token).get();
        if (!inviteSnap.exists) {
          setErrorMsg('This invite link is no longer valid.');
          setStatus('error');
          return;
        }
        const invite = inviteSnap.data()!;
        if (invite.used) {
          setErrorMsg('This invite link has already been used.');
          setStatus('error');
          return;
        }
        const familySnap = await firestore().collection('families').doc(invite.familyId).get();
        setFamilyName((familySnap.data()?.name as string) ?? 'Your family');
        setStatus('ready');
      } catch {
        setErrorMsg('Something went wrong. Please ask them to send the link again.');
        setStatus('error');
      }
    })();
  }, [token]);

  const handleAccept = async () => {
    setStatus('joining');
    try {
      const acceptInvite = functions().httpsCallable('acceptInvite');
      await acceptInvite({ token });
      await setStoredRole('senior');
      router.replace('/senior');
    } catch {
      Alert.alert('Could not connect', 'Please ask them to send the link again.');
      setStatus('ready');
    }
  };

  const handleDecline = () => router.replace('/');

  if (status === 'loading' || status === 'joining') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <PrimaryScreen title="Can't Connect" showBack={false}>
        <Text style={styles.body}>{errorMsg}</Text>
        <BigButton label="OK" onPress={() => router.replace('/')} />
      </PrimaryScreen>
    );
  }

  return (
    <PrimaryScreen title={`${familyName} wants to help you with EasyMap`} showBack={false}>
      <Text style={styles.body}>Do you want to connect with them?</Text>
      <BigButton label="Yes" onPress={handleAccept} />
      <BigButton label="No" variant="secondary" onPress={handleDecline} />
    </PrimaryScreen>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  body: {
    fontSize: fontSize.body,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
