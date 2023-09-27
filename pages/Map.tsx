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
import {
  of,
  switchMap,
} from 'rxjs';
import { ChatDrawer } from './ChatDrawer';
import { InputMessage } from '../components/InputMessage';
import {
  Button,
  Icon,
} from '@rneui/themed';
import {RootStackParamList, ROUTES} from "../types/routes";
import {RouteProp} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

interface MapProps {
  route: RouteProp<RootStackParamList, ROUTES.MAP>;
  navigation: NativeStackNavigationProp<RootStackParamList, ROUTES.MAP>;
}

export const Map = ({navigation, route}: MapProps) => {
  const {roomDataService, chatDataService, currentClientUuid, userLocationTracking} = route.params

  const [clients, setClients] = useState<ClientCoordinates[]>([]);
  const [initialRegion, setInitialRegion] = useState<UserRegion>();
  const [isShowInputMessage, setIsShowInputMessage] = useState(false);
  const [isShowChat, setIsShowChat] = useState(false);

  const openRoomList = () => {
    navigation.navigate(ROUTES.ROOMS, {roomDataService, userLocationTracking, clientUuid: currentClientUuid})
  }

  useEffect(() => {
    roomDataService.connectedRoomId$.pipe(
      switchMap(connectedRoomId => {
        if(connectedRoomId) {
          setIsShowChat(true);
          console.log('chat connected')
          return roomDataService.clientsCoordinatesRoom$;
        }

        setIsShowChat(false);
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

      {isShowChat ?
        <ChatDrawer
          setIsShowContent={setIsShowInputMessage}
          chatDataService={chatDataService}
          currentClientUuid={currentClientUuid}
        ></ChatDrawer>

        : null}

      {isShowChat ?
        <InputMessage
          isShowInputMessage={isShowInputMessage}
          chatDataService={chatDataService}
        ></InputMessage>
        : null}

      <View style={styles.actionsContainer}>
        <Button
            radius={'sm'}
            type="outline"
            buttonStyle={{
              backgroundColor: 'white',
              borderColor: 'black',
              zIndex: 1,
            }}
        >
          <Icon
              name="settings"
              color="black"
          />
        </Button>

        <Button
          radius={'sm'}
          type="outline"
          buttonStyle={{
            backgroundColor: 'white',
            borderColor: 'black',
            zIndex: 1,
          }}
          onPress={openRoomList}
        >
          <Icon
            name="meeting-room"
            color="black"
          />
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    position: "relative"
  },
  map: {
    flex: 1,
    width: 'auto',
    height: 'auto',
  },
  message: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingRight: 10,
    zIndex: 1000,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#aeaeae',
  },
  actionsContainer: {
    position: 'absolute',
    top: '10%',
    right: '5%',
    zIndex: 0,
    gap: 12,
  },
});
