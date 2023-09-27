import {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Input,
} from '@rneui/themed';
import {RouteProp} from "@react-navigation/native";
import {RootStackParamList, ROUTES} from "../types/routes";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

interface InitUserProps {
  route: RouteProp<RootStackParamList, ROUTES.INIT_USER>;
  navigation: NativeStackNavigationProp<RootStackParamList, ROUTES.INIT_USER>;
}

export function InitUser({ navigation, route }: InitUserProps) {
  const {socket, clientStorage, roomDataService, userLocationTracking, chatDataService} = route.params

  const [clientName, changeClientName] = useState('');
  const [socketId, setSocketId] = useState<string>('');
  const [clientUuid, setClientUuid] = useState<string | null>('');


  const saveClientName = (): void => {
      clientStorage.registry(clientName).then(() => auth());
  };

  const auth = (): void => {
    clientStorage.getClientUuid().then(clientUuid => {
      setClientUuid(clientUuid);

      if(clientUuid) {
        socket.on('connect', () => {
          setSocketId(socket.id);
        });

        socket.on('disconnect', () => {
          socket.connect();
        });

        socket.connect();
        socket.emit('auth', { uuid: clientUuid });
      }

      socket.on('isAuthorized', (isAuthed: { auth: boolean }) => {
          navigation.navigate(ROUTES.MAP, {
            roomDataService,
            userLocationTracking,
            chatDataService,
            currentClientUuid: clientUuid as string
          })
      });
    });
  };

  useEffect(() => {
    auth();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Input
        onChangeText={changeClientName}
        value={clientName}
        placeholder={'Write your name'}
      />

      <Button
        title="Registry"
        onPress={() => saveClientName()}
        disabled={!clientName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    columnGap: 20,
    padding: 50,
  },
});
