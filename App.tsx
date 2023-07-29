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
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import './UserAgent';
import { Rooms } from './pages/Rooms';
import { Map } from './pages/Map';
import { NavBar } from './components/NavBar';
import { BACKEND_API } from './utils/backend';
import { ClientStorage } from './utils/client.utils';
import { InitUser } from './pages/InitUser';
import { RoomsDataService } from './services/RoomsDataService';
import { UserLocationTracking } from './utils/userLocationTracking';

export const socket = io(`ws://${BACKEND_API}`, {
  autoConnect: false,
});

export const roomDataService = new RoomsDataService(socket);
export const clientStorage = new ClientStorage();

export const userLocationTracking = new UserLocationTracking(socket, roomDataService);

export default function App() {
  const Tab = createBottomTabNavigator();

  const [socketId, setSocketId] = useState<string>('');
  const [clientUuid, setClientUuid] = useState<string | null>('');
  const [isShowLoading, setIsShowLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState(false);

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
          <NavigationContainer>
            <Tab.Navigator tabBar={props => <NavBar navigation={props.navigation}/>}>
              <Tab.Screen name="Map">
                {props =>
                  <Map
                    navigation={props.navigation}
                    roomDataService={roomDataService}
                    userLocationTracking={userLocationTracking}
                  />}
              </Tab.Screen>
              {roomDataService ?
                <Tab.Screen name="Rooms">
                  {props =>
                    <Rooms
                      navigation={props.navigation}
                      clientUuid={clientUuid}
                      roomDataService={roomDataService}
                      userLocationTracking={userLocationTracking}
                    />}
                </Tab.Screen>
                : null}
            </Tab.Navigator>

            <View
              style={{
                ...styles.isConnectedIndicator,
                backgroundColor: isConnected ? 'green' : 'red',
              }}
            ></View>
          </NavigationContainer> :
          <InitUser setClientName={registry}/>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  isConnectedIndicator: {
    width: 10,
    height: 10,
    borderRadius: 50,
    position: 'absolute',
    top: 25,
    right: 25,
  },
});
