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
  getUserPosition,
  getUserRegion,
} from '../utils/userLocation';

export function Map({ socket }) {
  const [clients, setClients] = useState([]);
  const [initialRegion, setInitialRegion] = useState();
  const [updateTimeout, setUpdateTimeout] = useState();

  const updateUserLocation = () => {
    getUserPosition().then(pos => socket.emit('updateClientCoordinates', pos));

    if (!initialRegion) {
      getUserRegion().then(region => setInitialRegion(region));
    }

    setUpdateTimeout(setTimeout(updateUserLocation, 2500));
  };

  useEffect(() => {
    socket.on('clientsCoordinates', (array) => setClients(array));
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
             key={client.id}
             title={client.name}
             coordinate={{
               latitude: client.coordinates.latitude,
               longitude: client.coordinates.longitude,
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
