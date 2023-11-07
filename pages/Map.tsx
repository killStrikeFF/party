import {
  ActivityIndicator,
  BackHandler,
  StyleSheet,
  View,
} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { UserRegion } from '../types/user-region';
import {
  combineLatest,
  of,
  switchMap,
} from 'rxjs';
import { ChatDrawer } from '../components/ChatDrawer';
import { InputMessage } from '../components/InputMessage';
import {
  Button,
  Icon,
  Text,
} from '@rneui/themed';
import {
  RootStackParamList,
  ROUTES,
} from '../types/routes';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  chatDataService,
  roomDataService,
  userLocationTracking,
  usersData,
  userStorage,
} from '../utils/shared.utils';
import { UserMap } from '../types/user-map';
import { MapMarker } from '../components/MapMarker';
import { RoomInfo } from '../types/room';
import { regionFrom } from '../utils/calculateRegion';

interface MapProps {
  route: RouteProp<RootStackParamList, ROUTES.MAP>;
  navigation: NativeStackNavigationProp<RootStackParamList, ROUTES.MAP>;
}

export const Map = ({
                      route,
                      navigation,
                    }: MapProps) => {
  const [usersMap, setUsersMap] = useState<UserMap[]>([]);
  const [roomsMap, setRoomsMap] = useState<RoomInfo[]>([]);
  const [currentRoomInfo, setCurrentRoomInfo] = useState<RoomInfo>();
  const mapRef = useRef<MapView>(null);

  const [initialRegion, setInitialRegion] = useState<UserRegion>();
  const [isShowInputMessage, setIsShowInputMessage] = useState(false);
  const [isShowChat, setIsShowChat] = useState(false);
  const [currentUserUuid, setCurrentUserUuid] = useState<string>('');
  const [isCreatingRoomMode, setIsCreatingRoomMode] = useState(false);
  const [whisperUserName, setWhisperUserName] = useState('');
  const [isOpenChat, setIsOpenChat] = useState(false);

  const openRoomList = (): void => {
    navigation.navigate(
      ROUTES.ROOMS,
      { currentUserUuid },
    );
  };

  const openUsersPage = (): void => {
    navigation.navigate(ROUTES.USERS, {});
  };

  const openUserPage = (user: UserMap): void => {
    navigation.navigate(ROUTES.USER, { user });
  };

  const hardwareBackPress = (): boolean => {
    if (!chatDataService.isClosedChat$.getValue()) {
      chatDataService.setIsClosedChat(true);
      return true;
    }

    return false;
  };

  const startCreatingRoom = (): void => {
    setIsCreatingRoomMode(true);
  };

  const openAddRoom = (event: any): void => {
    navigation.navigate(ROUTES.ADD_ROOM, {
      coords: event.nativeEvent.coordinate,
      currentUserUuid,
    });
  };

  const openSettings = () => {
    navigation.navigate(ROUTES.SETTINGS, {});
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

    navigation.navigate(ROUTES.INIT_USER, {});
    userStorage.getUserUuid().then(userUuid => {
      if (userUuid) {
        setCurrentUserUuid(userUuid);
      }
    });

    combineLatest([
      chatDataService.isShownChat$,
      roomDataService.connectedRoomId$,
    ]).subscribe(([isShownChat, connectedRoomId]) => {
      if (isShownChat && connectedRoomId) {
        return setIsShowChat(true);
      }

      setIsShowChat(false);
    });

    combineLatest([
      roomDataService.currentRoomInfo$,
      roomDataService.rooms$,
    ]).subscribe(([currentRoomInfo, rooms]) => {
      setCurrentRoomInfo(currentRoomInfo);
      if (currentRoomInfo) {
        setRoomsMap([]);
      } else {
        setRoomsMap(rooms);
      }
    });

    roomDataService.connectedRoomId$.pipe(
      switchMap(connectedRoomId => {
        chatDataService.setIsShownChat(Boolean(connectedRoomId));
        chatDataService.setIsClosedChat(!Boolean(connectedRoomId));
        if (connectedRoomId) {
          return usersData.users$;
        }

        return of<UserMap[]>([]);
      }),
    ).subscribe(res => setUsersMap(res));

    userLocationTracking.initialRegion$.subscribe(region => setInitialRegion(region));

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', hardwareBackPress);
    };
  }, [navigation]);

  useEffect(() => {
    setIsCreatingRoomMode(Boolean(route?.params?.isCreateRoomMode));

    if (route?.params?.mapCenter) {
      mapRef?.current?.animateToRegion(
        regionFrom(route.params.mapCenter.latitude, route.params.mapCenter.longitude, 500),
        1000,
      );
    }

    if (route.params?.whisperUserName) {
      setIsOpenChat(true);
      setIsShowInputMessage(true);
      setWhisperUserName(route?.params?.whisperUserName);
      setTimeout(() => {
        setWhisperUserName('');
        setIsOpenChat(false);
      }, 1000);
    }

  }, [route]);

  return (
    <View style={styles.container}>
      {initialRegion ?
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          provider={PROVIDER_GOOGLE}
          onPress={isCreatingRoomMode ? openAddRoom : undefined}
        >
          {usersMap.map((
            user,
            index,
          ) => (
            !isCreatingRoomMode ?
              <Marker
                key={user.name + index}
                coordinate={{
                  latitude: user.coords.latitude,
                  longitude: user.coords.longitude,
                }}
                onPress={openUserPage.bind(this, user)}
              >
                <MapMarker user={user}></MapMarker>
              </Marker>

              : null
          ))}

          {!isCreatingRoomMode ?
            currentRoomInfo ?
              <Marker
                coordinate={currentRoomInfo.coords}
                title={currentRoomInfo.name}
              ></Marker>

              : roomsMap.map((
                room,
                index,
              ) => (
                <Marker
                  coordinate={room.coords}
                  key={room.name + index}
                  title={room.name}
                >

                </Marker>
              ))
            : null
          }

        </MapView> :
        <ActivityIndicator size={'large'}/>
      }

      {isShowChat && !isCreatingRoomMode ?
        <ChatDrawer
          setIsShowContent={setIsShowInputMessage}
          currentUserUuid={currentUserUuid}
          isOpenChat={isOpenChat}
        ></ChatDrawer>

        : null}

      {isShowChat && !isCreatingRoomMode ?
        <InputMessage
          isShowInputMessage={isShowInputMessage}
          whisperUserName={whisperUserName}
        ></InputMessage> :
        null}

      {!isCreatingRoomMode ? <View style={styles.actionsContainer}>
          <Button
            radius={'sm'}
            type="outline"
            buttonStyle={{
              backgroundColor: 'white',
              borderColor: 'black',
              zIndex: 1,
            }}
            onPress={openSettings}
          >
            <Icon
              name="settings"
              color="black"
            />
          </Button>

          {isShowChat ?
            <Button
              radius={'sm'}
              type="outline"
              buttonStyle={{
                backgroundColor: 'white',
                borderColor: 'black',
                zIndex: 1,
              }}
              onPress={openUsersPage}
            >
              <Icon
                name="group"
                color="black"
              />
            </Button>
            :
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
          }

          <Button
            radius={'sm'}
            type="outline"
            buttonStyle={{
              backgroundColor: 'white',
              borderColor: 'black',
              zIndex: 1,
              marginBottom: 0,
            }}
            onPress={startCreatingRoom}
            containerStyle={{
              alignSelf: 'flex-end',
              marginTop: 'auto',
            }}
          >
            <Icon
              name="add"
              color="black"
            />
          </Button>
        </View>
        : null}

      {isCreatingRoomMode ?
        <View style={styles.creatingRoomContainer}>
          <View style={styles.creatingRoomInnerContainer}>
            <Text>Выберите на карте координаты комнаты</Text>
          </View>
        </View>
        : null}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
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
    flex: 1,
    height: '80%',
    position: 'absolute',
    top: '10%',
    right: '5%',
    zIndex: 0,
    gap: 12,
  },

  creatingRoomContainer: {
    width: '100%',
    position: 'absolute',
    top: '5%',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  creatingRoomInnerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 15,
  },
});
