import { RouteProp } from '@react-navigation/native';
import {
  RootStackParamList,
  ROUTES,
} from '../types/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Animated,
  BackHandler,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Input,
} from '@rneui/themed';
import React, {
  useEffect,
  useState,
} from 'react';
import { CreateRoom } from '../types/room';
import { roomDataService } from '../utils/shared.utils';

import { HeaderBackButton } from '@react-navigation/elements';
import { Coordinates } from '../types/coordinates';
import ScrollView = Animated.ScrollView;

interface AddRoomProps {
  route: RouteProp<RootStackParamList, ROUTES.ROOM_PAGE>;
  navigation: NativeStackNavigationProp<RootStackParamList, ROUTES.ROOM_PAGE>;
}

export function RoomPage({
                           route,
                           navigation,
                         }: AddRoomProps) {
  const {
    currentUserUuid,
    coords,
    roomInfo,
    isEditRoom,
    isViewMode,
  } = route.params;
  const defaultCurrentCoordinates: Coordinates = {
    longitude: 0,
    latitude: 0,
  };
  const [roomName, setRoomName] = useState<string>('');
  const [roomDescription, setRoomDescription] = useState('');
  const [roomIcon, setRoomIcon] = useState('');
  const [roomCurrentCoordinates, setRoomCurrentCoordinates] = useState(defaultCurrentCoordinates);

  const createRoom = (): void => {
    const room: CreateRoom = {
      name: roomName,
      uuid: currentUserUuid,
      coords: coords as Coordinates,
    };

    roomDataService.createRoom(room).then(() => cancelCreateRoom());
  };

  const cancelCreateRoom = (): void => {
    setRoomName('');
    navigation.navigate(ROUTES.MAP, { isCreateRoomMode: false });
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      cancelCreateRoom();
      return true;
    });

    if (isEditRoom || isViewMode) {
      setRoomDescription(roomInfo?.description || '');
      setRoomIcon(roomInfo?.icon || '');
      setRoomCurrentCoordinates(roomInfo?.currentCoords || defaultCurrentCoordinates);
      setRoomName(roomInfo?.name || '');
    }

    if (isEditRoom) {
      navigation.setOptions({ title: `Редактирование ${roomInfo?.name}` });
    }

    if (isViewMode) {
      navigation.setOptions({ title: roomInfo?.name });
    }

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => {
        return <HeaderBackButton {...props} onPress={cancelCreateRoom}></HeaderBackButton>;
      },
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.saveArea}>
      <ScrollView
        style={styles.roomContainer}
      >
        <View style={styles.roomControlsContainer}>
          {/*<View*/}
          {/*  style={{*/}
          {/*    alignItems: 'center',*/}
          {/*    marginBottom: 20,*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <ProfilePicture*/}
          {/*    size={0.3}*/}
          {/*    text={roomName}*/}
          {/*    image={roomIcon}*/}
          {/*  ></ProfilePicture>*/}
          {/*</View>*/}

          <Input
            onChangeText={setRoomName}
            value={roomName}
            placeholder={'Название комнаты'}
            disabled={isViewMode}
          />

          {/*<Input*/}
          {/*  onChangeText={setRoomDescription}*/}
          {/*  value={roomDescription}*/}
          {/*  placeholder={'Описание комнаты'}*/}
          {/*  disabled={isViewMode}*/}
          {/*/>*/}

          {/*{*/}
          {/*  !isViewMode ?*/}
          {/*    <View style={{ ...styles.roomActionsContainer }}>*/}
          {/*      <Button*/}
          {/*        title={roomCurrentCoordinates.latitude ? 'Изменить финишную точку' : 'Добавить финишную точку'}*/}
          {/*      ></Button>*/}
          {/*    </View>*/}
          {/*    : null*/}
          {/*}*/}
        </View>

        {
          !isViewMode ?
            <View style={styles.roomActionsContainer}>
              <Button
                title="Отмена"
                onPress={cancelCreateRoom}
                type="outline"
              >
              </Button>

              <Button
                title={isEditRoom ? 'Сохранить' : 'Создать'}
                disabled={!roomName}
                onPress={createRoom}
              ></Button>
            </View>
            : null
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  saveArea: {
    flex: 1,
  },

  roomContainer: {
    padding: 40,
    flex: 1,
  },

  roomControlsContainer: {},

  roomActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 10,
  },
});
