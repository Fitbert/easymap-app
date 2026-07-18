import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { BigButton } from '../../components/BigButton';
import { PrimaryScreen } from '../../components/PrimaryScreen';
import { getMyFamilyId } from '../../lib/family';
import { firestore } from '../../lib/firebase';
import { colors, fontSize, spacing } from '../../lib/theme';

type Method = 'call' | 'facetime' | 'whatsapp';

export default function CallContact() {
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState<Method>('call');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const id = await getMyFamilyId();
      setFamilyId(id);
      if (id) {
        const snap = await firestore().collection('families').doc(id).collection('callForHelp').doc('contact').get();
        const data = snap.data();
        if (data) {
          setName((data.contactName as string) ?? '');
          setPhone((data.phoneNumber as string) ?? '');
          setMethod((data.method as Method) ?? 'call');
        }
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    if (!familyId || !name.trim() || !phone.trim()) return;
    setSaving(true);
    try {
      await firestore().collection('families').doc(familyId).collection('callForHelp').doc('contact').set({
        contactName: name.trim(),
        phoneNumber: phone.trim(),
        method,
      });
    } finally {
      setSaving(false);
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
    <PrimaryScreen title="Call for Help Contact">
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Maria" />
      <Text style={styles.label}>Phone number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="+1 555 555 5555"
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>How should it connect?</Text>
      <BigButton
        label="Phone Call"
        variant={method === 'call' ? 'primary' : 'secondary'}
        onPress={() => setMethod('call')}
      />
      <BigButton
        label="FaceTime"
        variant={method === 'facetime' ? 'primary' : 'secondary'}
        onPress={() => setMethod('facetime')}
      />
      <BigButton
        label="WhatsApp"
        variant={method === 'whatsapp' ? 'primary' : 'secondary'}
        onPress={() => setMethod('whatsapp')}
      />
      {saving ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <BigButton label="Save" onPress={handleSave} />
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
  label: {
    fontSize: fontSize.body,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: fontSize.body,
    marginBottom: spacing.md,
  },
});
