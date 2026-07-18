import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { BigButton } from '../../components/BigButton';
import { PrimaryScreen } from '../../components/PrimaryScreen';
import { getMyFamilyId } from '../../lib/family';
import { firestore } from '../../lib/firebase';
import { colors, fontSize, spacing } from '../../lib/theme';

type Favorite = { id: string; label: string; address: string };

export default function EditFavorites() {
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      const id = await getMyFamilyId();
      setFamilyId(id);
      if (!id) {
        setLoading(false);
        return;
      }
      unsubscribe = firestore()
        .collection('families')
        .doc(id)
        .collection('favorites')
        .orderBy('order', 'asc')
        .onSnapshot((snap) => {
          setFavorites(
            snap.docs.map((d) => ({
              id: d.id,
              label: d.data().label as string,
              address: d.data().address as string,
            }))
          );
          setLoading(false);
        });
    })();
    return () => unsubscribe?.();
  }, []);

  const handleAdd = async () => {
    if (!familyId || !label.trim() || !address.trim()) return;
    setSaving(true);
    try {
      await firestore().collection('families').doc(familyId).collection('favorites').add({
        label: label.trim(),
        address: address.trim(),
        order: favorites.length,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      setLabel('');
      setAddress('');
    } catch (err) {
      Alert.alert('Could not save', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (favoriteId: string) => {
    Alert.alert('Remove this place?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          firestore().collection('families').doc(familyId!).collection('favorites').doc(favoriteId).delete();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!familyId) {
    return (
      <PrimaryScreen title="Favorite Places">
        <Text style={styles.body}>Invite a family member first — favorites need a family to belong to.</Text>
      </PrimaryScreen>
    );
  }

  return (
    <PrimaryScreen title="Favorite Places">
      {favorites.map((fav) => (
        <View key={fav.id} style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>{fav.label}</Text>
            <Text style={styles.rowAddress}>{fav.address}</Text>
          </View>
          <BigButton label="Remove" variant="secondary" onPress={() => handleDelete(fav.id)} />
        </View>
      ))}
      <Text style={styles.sectionTitle}>Add a place</Text>
      <TextInput style={styles.input} placeholder="Name (e.g. Doctor)" value={label} onChangeText={setLabel} />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      {saving ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <BigButton label="Add Place" onPress={handleAdd} />
      )}
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: fontSize.body,
    fontWeight: '700',
    color: colors.text,
  },
  rowAddress: {
    fontSize: fontSize.body,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: fontSize.body,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: fontSize.body,
    marginBottom: spacing.md,
  },
});
