import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoBackButton } from './GoBackButton';
import { colors, fontSize, spacing } from '../lib/theme';

type PrimaryScreenProps = {
  title: string;
  children: ReactNode;
  showBack?: boolean;
};

// Every senior-facing screen is built from this: a big title, scrollable
// content (so large OS text sizes never get clipped), and a Go Back button
// fixed in the same footer position. Home is the only screen with showBack
// off, since there's nowhere "back" to go from it.
export function PrimaryScreen({ title, children, showBack = true }: PrimaryScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{title}</Text>
        <View style={styles.content}>{children}</View>
      </ScrollView>
      {showBack && (
        <View style={styles.footer}>
          <GoBackButton />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  content: {
    gap: spacing.sm,
  },
  footer: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
