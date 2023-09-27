import {
  StyleSheet,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { io } from 'socket.io-client';
import './UserAgent';
import { BACKEND_API } from './utils/backend';
import { ClientStorage } from './utils/client.utils';
import { RoomsDataService } from './services/RoomsDataService';
import { UserLocationTracking } from './utils/userLocationTracking';
import { ChatDataService } from './services/chat-data.service';
import { Map } from './pages/Map';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import {RootStackParamList, ROUTES} from "./types/routes";
import {Rooms} from "./pages/Rooms";
import {InitUser} from "./pages/InitUser";

export const socket = io(`ws://${BACKEND_API}`, {
  autoConnect: false,
});

export const roomDataService = new RoomsDataService(socket);
export const clientStorage = new ClientStorage();
export const chatDataService = new ChatDataService(socket);
export const userLocationTracking = new UserLocationTracking(socket, roomDataService);

export default function App() {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <View style={styles.container}>
      <StatusBar style="auto"/>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
              name={ROUTES.INIT_USER}
              component={InitUser}
              initialParams={{socket, roomDataService, userLocationTracking, chatDataService, clientStorage}}
          />
          <Stack.Screen
              name={ROUTES.MAP}
              component={Map}
          />
          <Stack.Screen
              name={ROUTES.ROOMS}
              component={Rooms}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
