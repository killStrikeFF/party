import React, {
  useEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import axios from 'axios';
import { BACKEND_API } from '../utils/backend';
import { Button } from '@rneui/themed';
import { getUserRegion } from '../utils/userLocation';
import MapView, { Marker } from 'react-native-maps';
import { RoomListItem } from './RoomListItem';

export function Rooms({
                        socket,
                        socketId,
                      }) {
  const [allRooms, setAllRooms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRoomName, setModalRoomName] = useState('');
  const [selectedCoord, setCoord] = useState();

  const pressMap = (event) => setCoord(event.nativeEvent.coordinate);

  const [initialRegion, setInitialRegion] = useState();

  const updateRooms = () => {
    axios.get(`http://${BACKEND_API}/party/all`).then(res => {
      console.log(res.data);
      setAllRooms(res.data.parties);
    });
  };

  useEffect(() => {
    updateRooms();
    getUserRegion().then(region => {
      console.log(region);
      setInitialRegion(region);
    });

    return () => {
      setCoord(null);
      setModalRoomName('');
    };
  }, []);

  const createRoom = (name) => {
    const data = {
      name: modalRoomName,
      socket: socketId,
      coords: { ...selectedCoord },
    };

    axios.post(
      `http://${BACKEND_API}/party`, data)
         .then(res => {
           updateRooms();
           setModalVisible(false);
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

      {modalVisible &&
        <Modal
          animationType="slide"
          transparent={false}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <TextInput
                onChangeText={setModalRoomName}
                value={modalRoomName}
                style={styles.input}
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

              <View style={styles.modalActions}>
                <Button
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </Button>

                <Button
                  style={[styles.button, styles.buttonClose]}
                  disabled={!modalRoomName || !selectedCoord}
                  onPress={createRoom}
                >
                  <Text style={styles.textStyle}>Create room</Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>}

      <View style={styles.addButton}>
        <Button
          style={styles.addButton}
          title={'Add room'}
          onPress={() => setModalVisible(true)}
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalActions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  modalMap: {
    flex: 1,
    height: 'auto',
    width: 'auto',
  },

  modalMapContainer: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },

  modalView: {
    flexDirection: 'column',
    justifyContent: 'space-between',

    height: '100%',
    width: '100%',

    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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

  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});
