import { Text } from 'react-native';
import { PrimaryScreen } from '../../components/PrimaryScreen';
import { fontSize } from '../../lib/theme';

// Placeholder for this phase. Next up: preset category buttons (Pharmacy,
// Doctor, Grocery, Bathroom) and large-text results lists — see Task #6.
export default function FindNearby() {
  return (
    <PrimaryScreen title="Find Nearby">
      <Text style={{ fontSize: fontSize.body }}>Pharmacy, Doctor, Grocery, Bathroom buttons go here next.</Text>
    </PrimaryScreen>
  );
}
