import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { BigButton } from '../../components/BigButton';
import { PrimaryScreen } from '../../components/PrimaryScreen';
import { getMyFamilyId } from '../../lib/family';
import { firestore } from '../../lib/firebase';
import { colors, fontSize } from '../../lib/theme';

type Contact = { contactName: string; phoneNumber: string; method: 'call' | 'facetime' | 'whatsapp' };

export default function CallForHelp() {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const familyId = await getMyFamilyId();
      if (familyId) {
        const snap = await firestore().collection('families').doc(familyId).collection('callForHelp').doc('contact').get();
        const data = snap.data();
        if (data) setContact(data as Contact);
      }
      setLoading(false);
    })();
  }, []);

  const handleCall = async () => {
    if (!contact) return;
    const digits = contact.phoneNumber.replace(/[^\d+]/g, '');
    const url =
      contact.method === 'facetime'
        ? `facetime:${digits}`
        : contact.method === 'whatsapp'
          ? `whatsapp://send?phone=${digits}`
          : `tel:${digits}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      Linking.openURL(url);
    } else {
      Alert.alert("Can't Connect", `Please call ${contact.contactName} directly.`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <PrimaryScreen title="Call for Help">
      {contact ? (
        <BigButton label={`Call ${contact.contactName}`} onPress={handleCall} />
      ) : (
        <Text style={styles.body}>No one has been set up to call yet.</Text>
      )}
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
  },
});
