import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput } from 'react-native';
import { BigButton } from '../../components/BigButton';
import { PrimaryScreen } from '../../components/PrimaryScreen';
import { confirmPhoneVerificationCode, sendPhoneVerificationCode } from '../../lib/auth';
import { colors, fontSize, spacing } from '../../lib/theme';

// Helper-only screen — the senior never sees a sign-in flow. Typing a phone
// number and a code is normal friction for an adult child/caregiver.
export default function HelperSignIn() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    try {
      const result = await sendPhoneVerificationCode(phone.trim());
      setConfirmation(result);
    } catch (err) {
      Alert.alert(
        'Could not send code',
        err instanceof Error ? err.message : 'Please check the number and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCode = async () => {
    if (!confirmation || !code.trim()) return;
    setLoading(true);
    try {
      await confirmPhoneVerificationCode(confirmation, code.trim());
      router.replace('/helper');
    } catch {
      Alert.alert('Incorrect code', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrimaryScreen title="Sign In">
      {!confirmation ? (
        <>
          <Text style={styles.label}>Your phone number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+1 555 555 5555"
            keyboardType="phone-pad"
            autoFocus
          />
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <BigButton label="Send Code" onPress={handleSendCode} />
          )}
        </>
      ) : (
        <>
          <Text style={styles.label}>Enter the code we texted you</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="123456"
            keyboardType="number-pad"
            autoFocus
          />
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <BigButton label="Confirm" onPress={handleConfirmCode} />
          )}
        </>
      )}
    </PrimaryScreen>
  );
}

const styles = StyleSheet.create({
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
