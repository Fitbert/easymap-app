import { Text } from 'react-native';
import { PrimaryScreen } from '../../components/PrimaryScreen';
import { fontSize } from '../../lib/theme';

// Placeholder for this phase. Next up: one tap opens a normal phone call
// (or FaceTime/WhatsApp deep link) to the helper contact set up on their
// device — see Task #6.
export default function CallForHelp() {
  return (
    <PrimaryScreen title="Call for Help">
      <Text style={{ fontSize: fontSize.body }}>Tapping this will call your helper directly.</Text>
    </PrimaryScreen>
  );
}
