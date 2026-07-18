import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, minTouchTarget, spacing } from '../lib/theme';

type BigButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
};

// One giant, high-contrast, tap-only button. No swipe/long-press affordances
// anywhere in this app — every action is a single tap on something this size
// or larger, per the accessibility spec (min 60x60pt target, 24pt+ text).
export function BigButton({ label, onPress, variant = 'primary', icon }: BigButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: isPrimary ? colors.primary : colors.back },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        {icon}
        <Text
          style={[styles.label, { color: isPrimary ? colors.primaryText : colors.backText }]}
          // allowFontScaling stays on (default) so the OS text-size setting is respected;
          // the button has no fixed height, so it grows instead of clipping.
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: minTouchTarget,
    minWidth: minTouchTarget,
    width: '100%',
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.75,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  label: {
    fontSize: fontSize.button,
    fontWeight: '700',
    textAlign: 'center',
  },
});
