import {
  StyleSheet,
  View,
} from 'react-native';
import './UserAgent';
import { Map } from './pages/Map';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import {
  RootStackParamList,
  ROUTES,
} from './types/routes';
import { Rooms } from './pages/Rooms';
import { InitUser } from './pages/InitUser';
import {
  useEffect,
  useState,
} from 'react';
import { Settings } from './pages/Settings';
import { Users } from './pages/Users';
import { User } from './pages/User';
import { RoomPage } from './pages/RoomPage';
import {
  roomDataService,
  userStorage,
} from './utils/shared.utils';
import * as Linking from 'expo-linking';
import { UserDetailsAuthorizedResponse } from './types/userDetails';
import { setJSExceptionHandler } from 'react-native-exception-handler';
import axios from 'axios';
import { BACKEND_API } from './utils/backend';
import { ThemeProvider } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import { socket } from './utils/socketConnection';
import { themeProviderParty } from './styles/theme.provider';

setJSExceptionHandler((
  error,
  isFatal,
) => {
  console.log(error);
  axios.post(`http://${BACKEND_API}/logging`, { message: 'Error from RN APP ' + error.message });
});

export default function App() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const subscribeForExternalLinks = (event: Linking.EventType) => {
    setRoomIdFromLink(event.url?.split('room=')[1]);
  };

  const setRoomIdFromLink = (urlWithRoomId: string | null | undefined): void => {
    if (urlWithRoomId) {
      roomDataService.setRoomFromExternalLink(urlWithRoomId);
    }
  };

  const auth = (): void => {
    userStorage.getUserUuid().then(userUuid => {
      if (userUuid) {
        socket.emit('auth', { uuid: userUuid });
      } else {
        setIsLoadingUser(false);
      }
    });
  };

  const registry = (clientName: string): void => {
    userStorage.registry(clientName).then(() => auth());
  };

  useEffect(() => {
    socket.connect();

    socket.on('isAuthorized', (userDetails: UserDetailsAuthorizedResponse) => {
      if (userDetails.auth) {
        userStorage.updateCurrentUserDetails(userDetails);

        Linking.getInitialURL().then(url => {
          const roomId = url?.split('room=')[1];
          if (roomId) {
            setRoomIdFromLink(roomId);
          } else if (userDetails.currentRoom) {
            roomDataService.joinRoom(userDetails.currentRoom.uuid, userDetails.uuid).then();
          }
        });

        setIsLoadingApp(false);
      } else {
        setIsLoadingUser(false);
      }
    });

    auth();
    Linking.addEventListener('url', subscribeForExternalLinks);
  }, []);

  return (
    <ThemeProvider theme={themeProviderParty}>
      <View style={styles.container}>
        <StatusBar style="auto"/>
        {
          isLoadingApp ?
            <InitUser
              isLoading={isLoadingUser}
              registry={registry}
            /> :

            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen
                  name={ROUTES.MAP}
                  component={Map}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name={ROUTES.ROOMS}
                  component={Rooms}
                  options={{ title: 'Список комнат' }}
                />
                <Stack.Screen
                  name={ROUTES.SETTINGS}
                  component={Settings}
                  options={{ title: 'Настройки' }}
                />
                <Stack.Screen
                  name={ROUTES.USERS}
                  component={Users}
                  options={{ title: 'Пользователи' }}
                />
                <Stack.Screen
                  name={ROUTES.USER}
                  component={User}
                />
                <Stack.Screen
                  name={ROUTES.ROOM_PAGE}
                  component={RoomPage}
                  options={{ title: 'Создание комнаты' }}
                />
              </Stack.Navigator>
            </NavigationContainer>
        }
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
