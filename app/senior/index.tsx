import { useRouter } from 'expo-router';
import { BigButton } from '../../components/BigButton';
import { PrimaryScreen } from '../../components/PrimaryScreen';

// The senior's Home screen: at most 4 giant buttons, plain language, no
// jargon. This is the only senior screen without a Go Back button — it's
// the root of senior mode.
export default function SeniorHome() {
  const router = useRouter();
  return (
    <PrimaryScreen title="EasyMap" showBack={false}>
      <BigButton label="Take Me Somewhere" onPress={() => router.push('/senior/take-me-somewhere')} />
      <BigButton label="Where Am I?" onPress={() => router.push('/senior/where-am-i')} />
      <BigButton label="Find Nearby" onPress={() => router.push('/senior/find-nearby')} />
      <BigButton label="Call for Help" onPress={() => router.push('/senior/call-for-help')} />
    </PrimaryScreen>
  );
}
