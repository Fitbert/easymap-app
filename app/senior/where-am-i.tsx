import { Text } from 'react-native';
import { PrimaryScreen } from '../../components/PrimaryScreen';
import { fontSize } from '../../lib/theme';

// Placeholder for this phase. Next up: full-screen map centered on the
// senior, their address in large text, and "Send My Location to Family" —
// see Task #6.
export default function WhereAmI() {
  return (
    <PrimaryScreen title="Where Am I?">
      <Text style={{ fontSize: fontSize.body }}>The map and your address go here next.</Text>
    </PrimaryScreen>
  );
}
