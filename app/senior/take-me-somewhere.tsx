import { Text } from 'react-native';
import { PrimaryScreen } from '../../components/PrimaryScreen';
import { fontSize } from '../../lib/theme';

// Placeholder for this phase. Next up: favorite-place buttons (set by the
// helper) plus a "Somewhere New" voice-input flow — see Task #5.
export default function TakeMeSomewhere() {
  return (
    <PrimaryScreen title="Take Me Somewhere">
      <Text style={{ fontSize: fontSize.body }}>
        Favorite places and voice destination search go here next.
      </Text>
    </PrimaryScreen>
  );
}
