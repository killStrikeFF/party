import React, {
  useEffect,
  useState,
} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { io } from 'socket.io-client';
import './UserAgent';
import { BACKEND_API } from './utils/backend';
import { ClientStorage } from './utils/client.utils';
import { InitUser } from './pages/InitUser';
import { RoomsDataService } from './services/RoomsDataService';
import { UserLocationTracking } from './utils/userLocationTracking';
import { ChatDataService } from './services/chat-data.service';
import {
  Dialog,
  Icon,
  Text,
} from '@rneui/themed';
import { Map } from './pages/Map';
import { Rooms } from './pages/Rooms';

export const socket = io(`ws://${BACKEND_API}`, {
  autoConnect: false,
});

export const roomDataService = new RoomsDataService(socket);
export const clientStorage = new ClientStorage();
export const chatDataService = new ChatDataService(socket);

export const userLocationTracking = new UserLocationTracking(socket, roomDataService);

export default function App() {
  const [socketId, setSocketId] = useState<string>('');
  const [clientUuid, setClientUuid] = useState<string | null>('');
  const [isShowLoading, setIsShowLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState(false);

  const [isVisibleModalRooms, setIsVisibleModalRooms] = useState(false);

  const toggleIsVisisbleModalRooms = (): void => {
    setIsVisibleModalRooms(!isVisibleModalRooms);
  };

  const auth = (): void => {
    clientStorage.getClientUuid().then(clientUuid => {
      setIsShowLoading(false);
      setClientUuid(clientUuid);

      if(clientUuid) {
        socket.on('connect', () => {
          setSocketId(socket.id);
          setIsConnected(true);
        });

        socket.connect();
        socket.emit('auth', { uuid: clientUuid });
      }

      socket.on('isAuthorized', (isAuthed: { auth: boolean }) => {
        if(!isAuthed.auth) {
          setClientUuid('');
        }
      });
    });
  };

  const registry = (name: string): void => {
    clientStorage.registry(name).then(() => auth());
  };

  useEffect(() => {
    auth();
    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      {isShowLoading ?
        <StatusBar style="auto"/> :
        clientUuid ?

          <View style={styles.contentContainer}>
            <Map
              roomDataService={roomDataService}
              userLocationTracking={userLocationTracking}
              chatDataService={chatDataService}
              currentClientUuid={clientUuid}
              toggleIsVisisbleModalRooms={toggleIsVisisbleModalRooms}
            ></Map>

            <Dialog
              isVisible={isVisibleModalRooms}
              overlayStyle={styles.roomsDialogContainer}
            >
              <View style={styles.roomsDialogHeaderContainer}>
                <Icon
                  name="arrow-back"
                  backgroundColor="white"
                  color="black"
                  onPress={toggleIsVisisbleModalRooms}
                />
                <Text h4>Список комнат</Text>
              </View>
              <Rooms
                clientUuid={clientUuid}
                roomDataService={roomDataService}
                userLocationTracking={userLocationTracking}
              />
            </Dialog>
          </View>

          : <InitUser setClientName={registry}/>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  isConnectedIndicator: {
    width: 10,
    height: 10,
    borderRadius: 50,
    position: 'absolute',
    top: 25,
    right: 25,
  },

  roomsDialogContainer: {
    width: '100%',
    height: '100%',
  },

  roomsDialogHeaderContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 20,
  },
});
