import { RouteProp } from '@react-navigation/native';
import {
  RootStackParamList,
  ROUTES,
} from '../types/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  BackHandler,
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

interface AddRoomProps {
  route: RouteProp<RootStackParamList, ROUTES.ADD_ROOM>;
  navigation: NativeStackNavigationProp<RootStackParamList, ROUTES.ADD_ROOM>;
}

export function AddRoom({
                          route,
                          navigation,
                        }: AddRoomProps) {
  const {
    currentUserUuid,
    coords,
  } = route.params;
  const [modalRoomName, setModalRoomName] = useState<string>('');

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      cancelCreateRoom();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => {
        return <HeaderBackButton {...props} onPress={cancelCreateRoom}></HeaderBackButton>;
      },
    });
  }, [navigation]);

  const cancelCreateRoom = (): void => {
    setModalRoomName('');
    navigation.navigate(ROUTES.MAP, { isCreateRoomMode: false });
  };

  const createRoom = (): void => {
    const room: CreateRoom = {
      name: modalRoomName,
      uuid: currentUserUuid,
      coords,
    };

    roomDataService.createRoom(room).then(() => cancelCreateRoom());
  };

  return (
    <View style={styles.addRoomContainer}>
      <View style={styles.addRoomControlsContainer}>
        <Input
          onChangeText={setModalRoomName}
          value={modalRoomName}
          placeholder={'Название комнаты'}
        />
      </View>

      <View style={styles.actionsContainer}>
        <Button
          title="Отмена"
          onPress={cancelCreateRoom}
          type="outline"
        >
        </Button>

        <Button
          title="Создать"
          disabled={!modalRoomName}
          onPress={createRoom}
        ></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addRoomContainer: {
    padding: 40,
    flex: 1,
  },

  addRoomControlsContainer: {},

  actionsContainer: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 10,
  },
});
