import React, {
  useEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Dialog,
  Input,
  Text,
} from '@rneui/themed';
import MapView, { Marker } from 'react-native-maps';
import { RoomListItem } from './RoomListItem';
import {
  CreateRoom,
  RoomInfo,
} from '../types/room';
import { Coordinates } from '../types/coordinates';
import { UserRegion } from '../types/user-region';
import { RoomsDataService } from '../services/RoomsDataService';
import { UserLocationTracking } from '../utils/userLocationTracking';

export function Rooms({
                        navigation,
                        clientUuid,
                        roomDataService,
                        userLocationTracking,
                      }: {
                        navigation: any,
                        clientUuid: string,
                        roomDataService: RoomsDataService,
                        userLocationTracking: UserLocationTracking
                      },
) {

  const [allRooms, setAllRooms] = useState<RoomInfo[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalRoomName, setModalRoomName] = useState<string>('');
  const [selectedCoord, setCoord] = useState<Coordinates | null>();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const pressMap = (event: any) => setCoord(event.nativeEvent.coordinate);
  const toggleModalVisible = () => {
    setModalVisible(!modalVisible);
    setModalRoomName('');
    setCoord(null);
  };

  const [initialRegion, setInitialRegion] = useState<UserRegion>();

  useEffect(() => {
    roomDataService.rooms$.subscribe(rooms => setAllRooms(rooms));

    userLocationTracking.initialRegion$.subscribe(region => setInitialRegion(region));

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return (): void => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const createRoom = (): void => {
    const room: CreateRoom = {
      name: modalRoomName,
      uuid: clientUuid,
      coords: { ...selectedCoord } as Coordinates,
    };

    roomDataService.createRoom(room).then(() => setModalVisible(false));
  };

  const joinRoom = (roomUuid: string): void => {
    roomDataService.joinRoom(roomUuid, clientUuid);
  };

  const leaveRoom = (): void => {
    roomDataService.leaveRoom(clientUuid);
  };

  return (
    <View style={styles.container}>
      <View style={styles.roomsList}>
        <FlatList
          data={allRooms}
          renderItem={({ item }) => <RoomListItem
            room={item}
            connectToRoom={joinRoom}
            leaveRoom={leaveRoom}
          />}
          keyExtractor={item => item.uuid}
        />
      </View>

      {modalVisible ?
        <Dialog
          isVisible={modalVisible}
          onBackdropPress={toggleModalVisible}
          overlayStyle={styles.dialogContainer}
        >
          <Dialog.Title title={'Create room'}/>
          <Input
            onChangeText={setModalRoomName}
            value={modalRoomName}
            placeholder={'Write a name of the room'}
          />

          <View
            style={{
              ...styles.modalMapContainer,
              height: isKeyboardVisible ? '65%' : '75%',
            }}
          >
            {initialRegion ?
              <MapView
                style={styles.modalMap}
                initialRegion={initialRegion}
                onPress={pressMap}
              >
                {selectedCoord ?
                  <Marker coordinate={selectedCoord}></Marker> :
                  null}
              </MapView> :
              <ActivityIndicator size={'large'}/>
            }
          </View>

          <Dialog.Actions>
            <View style={styles.actionsContainer}>
              <Dialog.Button onPress={() => toggleModalVisible()}>
                <Text>Close</Text>
              </Dialog.Button>

              <Button
                title={'Create room'}
                disabled={!modalRoomName || !selectedCoord}
                onPress={createRoom}
              ></Button>
            </View>
          </Dialog.Actions>
        </Dialog> : null}

      <View style={styles.addButton}>
        <Button
          title={'Add room'}
          onPress={() => toggleModalVisible()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
  },

  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dialogContainer: {
    width: '100%',
    height: '90%',
    justifyContent: 'space-between',
  },

  modalMapContainer: {
    width: '100%',
  },

  modalMap: {
    flex: 1,
    height: 'auto',
    width: 'auto',
  },

  roomsList: {
    padding: 15,
    flex: 1,
  },

  addButton: {
    position: 'absolute',
    top: '90%',
    left: '30%',
    right: '30%',
  },
});
