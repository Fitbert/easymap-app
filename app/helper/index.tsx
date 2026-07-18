import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { BigButton } from '../../components/BigButton';
import { PrimaryScreen } from '../../components/PrimaryScreen';
import { auth } from '../../lib/firebase';
import { colors, fontSize } from '../../lib/theme';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

export default function HelperHome() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseAuthTypes.User | null | undefined>(undefined);

  useEffect(() => auth().onAuthStateChanged(setUser), []);

  if (user === undefined) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <PrimaryScreen title="Helper Mode" showBack={false}>
        <Text style={styles.body}>Sign in with your phone number to get started.</Text>
        <BigButton label="Sign In" onPress={() => router.push('/helper/sign-in')} />
      </PrimaryScreen>
    );
  }

  return (
    <PrimaryScreen title="Helper Mode" showBack={false}>
      <BigButton label="Invite a Family Member" onPress={() => router.push('/helper/invite')} />
      <BigButton label="Favorite Places" variant="secondary" onPress={() => router.push('/helper/favorites')} />
      <BigButton
        label="Call for Help Contact"
        variant="secondary"
        onPress={() => router.push('/helper/call-contact')}
      />
    </PrimaryScreen>
  );
}

const styles = {
  loading: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.background,
  },
  body: {
    fontSize: fontSize.body,
    color: colors.text,
    textAlign: 'center' as const,
  },
};
