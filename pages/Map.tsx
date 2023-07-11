import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import React, {
  useEffect,
  useState,
} from 'react';
import {
  getUserCoordinates,
  getUserRegion,
} from '../utils/userLocation';
import { ClientCoordinates } from '../types/client-coordinates';
import { UserRegion } from '../types/user-region';

export function Map({
                      socket,
                    }: any) {
  const [clients, setClients] = useState<ClientCoordinates[]>([]);
  const [initialRegion, setInitialRegion] = useState<UserRegion | null>();
  const [updateTimeout, setUpdateTimeout] = useState<NodeJS.Timeout>();

  const updateUserLocation = () => {
    getUserCoordinates().then(pos => socket.emit('updateClientCoordinates', pos));

    if(!initialRegion) {
      getUserRegion().then(region => setInitialRegion(region));
    }

    setUpdateTimeout(setTimeout(updateUserLocation, 2500));
  };

  useEffect(() => {
    socket.on('clientsCoordinates', (array: any) => setClients(array));
    updateUserLocation();
    return () => {
      clearTimeout(updateTimeout);
    };
  }, []);
  return (
    <View style={styles.container}>
      {initialRegion ?
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
        >
          {clients.map(client => (
            <Marker
              key={client.socketId}
              title={client.name}
              coordinate={{
                latitude: client.coords.latitude,
                longitude: client.coords.longitude,
              }}
            />
          ))}
        </MapView> :
        <ActivityIndicator size={'large'}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: 'auto',
    height: 'auto',
  },
});
