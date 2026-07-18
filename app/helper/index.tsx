import { Text } from 'react-native';
import { PrimaryScreen } from '../../components/PrimaryScreen';
import { fontSize } from '../../lib/theme';

// Placeholder for this phase. Helper Mode is built after Senior Mode is
// complete — see Task #7 (create family/invite, edit favorites, live
// location, send destination).
export default function HelperHome() {
  return (
    <PrimaryScreen title="Helper Mode">
      <Text style={{ fontSize: fontSize.body }}>Helper mode is coming in the next phase.</Text>
    </PrimaryScreen>
  );
}
