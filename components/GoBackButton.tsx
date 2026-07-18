import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontSize, minTouchTarget, spacing } from '../lib/theme';

// Appears in the same footer position on every screen except Home, so a
// helper on the phone can always say "tap the button at the bottom" and
// know it means the same thing regardless of which screen the senior is on.
export function GoBackButton() {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.label}>← Go Back</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: minTouchTarget,
    width: '100%',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.back,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    fontSize: fontSize.body,
    fontWeight: '700',
    color: colors.back,
  },
});
