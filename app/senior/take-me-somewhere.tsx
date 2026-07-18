import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { BigButton } from '../../components/BigButton';
import { PrimaryScreen } from '../../components/PrimaryScreen';
import { getMyFamilyId } from '../../lib/family';
import { firestore } from '../../lib/firebase';
import { colors, fontSize, spacing } from '../../lib/theme';

type Favorite = { id: string; label: string; address: string };

export default function TakeMeSomewhere() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const familyId = await getMyFamilyId();
      if (familyId) {
        const snap = await firestore()
          .collection('families')
          .doc(familyId)
          .collection('favorites')
          .orderBy('order', 'asc')
          .get();
        setFavorites(
          snap.docs.map((d) => ({ id: d.id, label: d.data().label as string, address: d.data().address as string }))
        );
      }
      setLoading(false);
    })();
  }, []);

  // Real turn-by-turn directions are next — see Task #5. This proves the
  // favorites a helper sets up actually reach the senior's screen.
  const handleGo = (fav: Favorite) => {
    Alert.alert(fav.label, `Directions to ${fav.address} are coming soon.`);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <PrimaryScreen title="Take Me Somewhere">
      {favorites.map((fav) => (
        <BigButton key={fav.id} label={fav.label} onPress={() => handleGo(fav)} />
      ))}
      {favorites.length === 0 && <Text style={styles.body}>No favorite places yet — ask your family to add some.</Text>}
      <BigButton
        label="Somewhere New"
        variant="secondary"
        onPress={() => Alert.alert('Coming soon', 'Voice search for a new place is coming soon.')}
      />
    </PrimaryScreen>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  body: {
    fontSize: fontSize.body,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
