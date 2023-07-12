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
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import './UserAgent';
import { Rooms } from './pages/Rooms';
import { Map } from './pages/Map';
import { NavBar } from './components/NavBar';
import { BACKEND_API } from './utils/backend';
import { ClientStorage } from './utils/client.utils';
import { InitUser } from './pages/InitUser';

export default function App() {
  const Tab = createBottomTabNavigator();
  const clientStorage = new ClientStorage();
  const socket = io(`ws://${BACKEND_API}`, {
    autoConnect: false,
  });

  const [socketId, setSocketId] = useState<string>('');
  const [clientName, setClientName] = useState<string | null>('');
  const [isPermissionsGranted, setIsPermissionsGranted] = useState<boolean>(false);
  const [isShowLoading, setIsShowLoading] = useState<boolean>(true);

  useEffect(() => {
    socket.on('connect', () => {
      setSocketId(socket.id);
    });

    socket.connect();
    getPermissions().then(res => {
      setIsPermissionsGranted(res);
    });

    clientStorage.getClientName().then(name => {
      setIsShowLoading(false);
      setClientName(name);
      socket.emit('updateName', { name });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  };

  return (
    <View style={styles.container}>
      {isShowLoading ?
        <StatusBar style="auto"/> :
        clientName ?
          <NavigationContainer>
            <Tab.Navigator tabBar={props => <NavBar navigation={props.navigation}/>}>
              <Tab.Screen name="Map">
                {props =>
                  <Map
                    navigation={props.navigation}
                    socket={socket}
                  />}
              </Tab.Screen>
              <Tab.Screen name="Rooms">
                {props =>
                  <Rooms
                    navigation={props.navigation}
                    socket={socket}
                    socketId={socketId}
                  />}
              </Tab.Screen>
            </Tab.Navigator>
          </NavigationContainer> :
          <InitUser
            clientStorage={clientStorage}
            socket={socket}
            setClientName={setClientName}
          />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
