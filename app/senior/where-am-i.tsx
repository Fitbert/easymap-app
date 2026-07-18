import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { BigButton } from '../../components/BigButton';
import { PrimaryScreen } from '../../components/PrimaryScreen';
import { colors, fontSize, spacing } from '../../lib/theme';

type Coords = { latitude: number; longitude: number };

export default function WhereAmI() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [address, setAddress] = useState('Finding your location…');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('EasyMap needs permission to find your location. Please allow it in Settings.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = position.coords;
      setCoords({ latitude, longitude });

      // Uses the phone's built-in geocoder (free) rather than a paid API call.
      const places = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (places.length > 0) {
        const place = places[0];
        setAddress([place.name, place.street, place.city, place.region].filter(Boolean).join(', '));
      } else {
        setAddress('Address not found');
      }
    })();
  }, []);

  const handleSendLocation = () => {
    // Wired up once Firebase is connected — writes to
    // families/{familyId}/liveLocation/{seniorUid} for the helper to see. See Task #8.
    Alert.alert('Coming soon', 'This will send your location to your family once setup is finished.');
  };

  return (
    <PrimaryScreen title="Where Am I?">
      {errorMsg ? (
        <Text style={styles.body}>{errorMsg}</Text>
      ) : !coords ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
      ) : (
        <>
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={{
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation
              // No pan/pinch/rotate — this screen is a display, not something to
              // interact with. No gestures beyond tapping the button below.
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              <Marker coordinate={coords} />
            </MapView>
          </View>
          <Text style={styles.body}>{address}</Text>
        </>
      )}
      <BigButton label="Send My Location to Family" onPress={handleSendLocation} />
    </PrimaryScreen>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    height: 260,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  body: {
    fontSize: fontSize.body,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  spinner: {
    marginBottom: spacing.md,
  },
});
