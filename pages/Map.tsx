import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import React, {
  useEffect,
  useState,
} from 'react';
import { ClientCoordinates } from '../types/client-coordinates';
import { UserRegion } from '../types/user-region';
import { RoomsDataService } from '../services/RoomsDataService';
import { UserLocationTracking } from '../utils/userLocationTracking';
import {
  of,
  switchMap,
} from 'rxjs';

export function Map({
                      navigation,
                      roomDataService,
                      userLocationTracking,
                    }: {
  navigation: any,
  roomDataService: RoomsDataService,
  userLocationTracking: UserLocationTracking
}) {
  const [clients, setClients] = useState<ClientCoordinates[]>([]);
  const [initialRegion, setInitialRegion] = useState<UserRegion>();

  useEffect(() => {
    roomDataService.connectedRoomId$.pipe(
      switchMap(connectedRoomId => {
        if(connectedRoomId) {
          return roomDataService.clientsCoordinatesRoom$;
        }

        return of([]);
      }),
    ).subscribe(res => setClients(res));
    userLocationTracking.initialRegion$.subscribe(region => setInitialRegion(region));
  }, []);
  return (
    <View style={styles.container}>
      {initialRegion ?
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          provider={PROVIDER_GOOGLE}
        >
          {clients.map((
            client,
            index,
          ) => (
            <Marker
              key={client.name + index}
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
