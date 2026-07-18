import * as Linking from 'expo-linking';
import { useState } from 'react';
import { ActivityIndicator, Alert, Share, StyleSheet, Text } from 'react-native';
import { BigButton } from '../../components/BigButton';
import { PrimaryScreen } from '../../components/PrimaryScreen';
import { functions } from '../../lib/firebase';
import { colors, fontSize, spacing } from '../../lib/theme';

export default function Invite() {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<string | null>(null);

  const handleCreateInvite = async () => {
    setLoading(true);
    try {
      const createInvite = functions().httpsCallable('createInvite');
      const result = await createInvite({});
      const { token } = result.data as { token: string; familyId: string };
      setLink(Linking.createURL(`join/${token}`));
    } catch (err) {
      Alert.alert('Something went wrong', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!link) return;
    await Share.share({ message: `Join me on EasyMap: ${link}` });
  };

  return (
    <PrimaryScreen title="Invite a Family Member">
      {!link ? (
        loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <BigButton label="Create Invite Link" onPress={handleCreateInvite} />
        )
      ) : (
        <>
          <Text style={styles.body}>
            Send this link to your family member however you like — text, email, anything. Opening it on their
            phone connects them automatically. They won&apos;t need to type anything.
          </Text>
          <BigButton label="Share Link" onPress={handleShare} />
        </>
      )}
    </PrimaryScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: fontSize.body,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
