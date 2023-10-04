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
  useState,
} from 'react';
import { UserCoordinates } from '../types/user-coordinates';
import { UserRegion } from '../types/user-region';
import {
  combineLatest,
  of,
  switchMap,
} from 'rxjs';
import { ChatDrawer } from './ChatDrawer';
import { InputMessage } from '../components/InputMessage';
import {
  Button,
  Icon,
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
  userStorage,
} from '../utils/shared.utils';

interface MapProps {
  route: RouteProp<RootStackParamList, ROUTES.MAP>;
  navigation: NativeStackNavigationProp<RootStackParamList, ROUTES.MAP>;
}

export const Map = ({
                      navigation,
                      route,
                    }: MapProps) => {

  const [usersCoordinates, setUsersCoordinates] = useState<UserCoordinates[]>([]);
  const [initialRegion, setInitialRegion] = useState<UserRegion>();
  const [isShowInputMessage, setIsShowInputMessage] = useState(false);
  const [isShowChat, setIsShowChat] = useState(false);
  const [currentUserUuid, setCurrentUserUuid] = useState<string>();

  const openRoomList = () => {
    navigation.navigate(
      ROUTES.ROOMS,
      { currentUserUuid: currentUserUuid as string },
    );
  };

  const hardwareBackPress = () => {
    if (!chatDataService.isClosedChat$.getValue()) {
      chatDataService.setIsClosedChat(true);
      return true;
    }

    return false;
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

    roomDataService.connectedRoomId$.pipe(
      switchMap(connectedRoomId => {
        chatDataService.setIsShownChat(Boolean(connectedRoomId));
        chatDataService.setIsClosedChat(Boolean(connectedRoomId));
        if (connectedRoomId) {
          return roomDataService.usersCoordinates$;
        }

        return of<UserCoordinates[]>([]);
      }),
    ).subscribe(res => {
      console.log(res);
      setUsersCoordinates(res);
    });

    userLocationTracking.initialRegion$.subscribe(region => setInitialRegion(region));

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', hardwareBackPress);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      {initialRegion ?
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          provider={PROVIDER_GOOGLE}
        >
          {usersCoordinates.map((
            user,
            index,
          ) => (
            <Marker
              key={user.name + index}
              title={user.name}
              coordinate={{
                latitude: user.coords.latitude,
                longitude: user.coords.longitude,
              }}
            />
          ))}
        </MapView> :
        <ActivityIndicator size={'large'}/>}

      {isShowChat ?
        <ChatDrawer
          setIsShowContent={setIsShowInputMessage}
          currentUserUuid={currentUserUuid}
        ></ChatDrawer>

        : null}

      {isShowChat ? <InputMessage isShowInputMessage={isShowInputMessage}></InputMessage> : null}

      <View style={styles.actionsContainer}>
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
    position: 'absolute',
    top: '10%',
    right: '5%',
    zIndex: 0,
    gap: 12,
  },
});
