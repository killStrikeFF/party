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
import { useEffect } from 'react';
import { socket } from './utils/shared.utils';

export default function App() {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar style="auto"/>
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
            name={ROUTES.INIT_USER}
            component={InitUser}
            options={{
              headerShown: false,
            }}
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
