import {
  StyleSheet,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
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
import { socket } from './utils/shared.utils';
import { Settings } from './pages/Settings';
import { Users } from './pages/Users';
import { User } from './pages/User';
import { RoomPage } from './pages/RoomPage';

export default function App() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const [isLoadingApp, setIsLoadingApp] = useState(true);

  useEffect(() => {
    socket.on('disconnect', () => {
      console.log('disconnect');
    });

    socket.on('connect', () => {
      console.log('connected');
    });

    const connection = socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto"/>
      {
        isLoadingApp ? <InitUser setIsLoading={setIsLoadingApp}/> :

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
