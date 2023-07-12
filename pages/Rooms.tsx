import React, {
  useEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import axios from 'axios';
import { BACKEND_API } from '../utils/backend';
import {
  Button,
  Dialog,
  Input,
  Text,
} from '@rneui/themed';
import { getUserRegion } from '../utils/userLocation';
import MapView, { Marker } from 'react-native-maps';
import { RoomListItem } from './RoomListItem';
import {
  CreateRoom,
  RoomInfo,
} from '../types/room';
import { Coordinates } from '../types/coordinates';
import { UserRegion } from '../types/user-region';

export function Rooms({
                        socket,
                        socketId,
                      }: any) {
  const [allRooms, setAllRooms] = useState<RoomInfo[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalRoomName, setModalRoomName] = useState<string>('');
  const [selectedCoord, setCoord] = useState<Coordinates | null>();

  const pressMap = (event: any) => setCoord(event.nativeEvent.coordinate);
  const toggleModalVisible = () => {
    setModalVisible(!modalVisible);
    setModalRoomName('');
    setCoord(null);
  };

  const [initialRegion, setInitialRegion] = useState<UserRegion>();

  useEffect(() => {
    updateRooms();
    getUserRegion().then(region => setInitialRegion(region));
  }, []);

  const updateRooms = () => {
    axios.get(`http://${BACKEND_API}/party/all`).then(res => {
      setAllRooms(res.data.parties);
    });
  };

  const createRoom = () => {
    const data: CreateRoom = {
      name: modalRoomName,
      socketId: socketId,
      coords: { ...selectedCoord } as Coordinates,
    };

    axios.post(
      `http://${BACKEND_API}/party`, data)
      .then(res => {
        updateRooms();
        toggleModalVisible();
      });
  };
  //
  // const joinRoom = () => {
  //     axios.post('http://192.168.0.138:3000/party/join', {socketId: socket.id, roomUuid: roomId}).then(res => {
  //         console.log(res.data);
  //     })
  // }
  //
  // const leaveRoom = () => {
  //     axios.post('http://192.168.0.138:3000/party/leave', {socketId: socket.id}).then(res => {
  //         console.log(res.data);
  //     })
  // }

  return (
    <View style={styles.container}>
      <View style={styles.roomsList}>
        <FlatList
          data={allRooms}
          renderItem={({ item }) => <RoomListItem room={item}/>}
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

          <View style={styles.modalMapContainer}>
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
    height: '70%',
    width: '100%',
  },

  modalMap: {
    flex: 1,
    height: 'auto',
    width: 'auto',
  },

  roomsList: {
    padding: 20,
    flex: 1,
  },

  addButton: {
    position: 'absolute',
    top: '90%',
    left: '30%',
    right: '30%',
  },
});
