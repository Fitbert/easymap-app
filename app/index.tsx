import { useRouter } from 'expo-router';
import { BigButton } from '../components/BigButton';
import { PrimaryScreen } from '../components/PrimaryScreen';

// First-launch only. A parent/helper sets this once, together with the
// senior, then the app always opens straight to the right mode (that
// persistence is added once we wire storage — see Task #4 in the plan).
export default function RoleSelect() {
  const router = useRouter();
  return (
    <PrimaryScreen title="Who is using this phone?" showBack={false}>
      <BigButton label="This is my phone" onPress={() => router.push('/senior')} />
      <BigButton
        label="I'm helping a family member"
        variant="secondary"
        onPress={() => router.push('/helper')}
      />
    </PrimaryScreen>
  );
}
