import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { BigButton } from '../components/BigButton';
import { PrimaryScreen } from '../components/PrimaryScreen';
import { getStoredRole, Role, setStoredRole } from '../lib/role';
import { colors } from '../lib/theme';

// First-launch only: once a role is picked, it's saved, and every future
// launch skips straight to the right mode instead of showing this again.
export default function RoleSelect() {
  const router = useRouter();
  const [checkingStoredRole, setCheckingStoredRole] = useState(true);

  useEffect(() => {
    getStoredRole().then((role) => {
      if (role) {
        router.replace(role === 'senior' ? '/senior' : '/helper');
      } else {
        setCheckingStoredRole(false);
      }
    });
  }, [router]);

  const choose = async (role: Role) => {
    await setStoredRole(role);
    router.replace(role === 'senior' ? '/senior' : '/helper');
  };

  if (checkingStoredRole) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <PrimaryScreen title="Who is using this phone?" showBack={false}>
      <BigButton label="This is my phone" onPress={() => choose('senior')} />
      <BigButton label="I'm helping a family member" variant="secondary" onPress={() => choose('helper')} />
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
};
