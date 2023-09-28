import {
  useEffect,
  useState,
} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Input,
} from '@rneui/themed';
import { RouteProp } from '@react-navigation/native';
import {
  RootStackParamList,
  ROUTES,
} from '../types/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  clientStorage,
  socket,
} from '../utils/shared.utils';

interface InitUserProps {
  route: RouteProp<RootStackParamList, ROUTES.INIT_USER>;
  navigation: NativeStackNavigationProp<RootStackParamList, ROUTES.INIT_USER>;
}

export function InitUser({
                           navigation,
                           route,
                         }: InitUserProps) {

  const [clientName, changeClientName] = useState('');
  const [socketId, setSocketId] = useState<string>('');
  const [clientUuid, setClientUuid] = useState<string | null>('');

  const saveClientName = (): void => {
    clientStorage.registry(clientName).then(() => auth());
  };

  const auth = (): void => {
    clientStorage.getClientUuid().then(clientUuid => {
      setClientUuid(clientUuid);

      if (clientUuid) {
        socket.on('connect', () => {
          setSocketId(socket.id);
          setClientUuid(clientUuid);
        });

        socket.connect();
        socket.emit('auth', { uuid: clientUuid });
      }

      socket.on('isAuthorized', (isAuthed: { auth: boolean }) => {
        if (isAuthed.auth) {
          navigation.navigate(ROUTES.MAP, {
            currentClientUuid: clientUuid as string,
          });
        }
      });
    });
  };

  useEffect(() => {
    auth();
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
