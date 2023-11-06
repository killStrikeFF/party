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
  socket,
  userStorage,
} from '../utils/shared.utils';
import { UserDetailsAuthorizedResponse } from '../types/userDetails';

interface InitUserProps {
  route: RouteProp<RootStackParamList, ROUTES.INIT_USER>;
  navigation: NativeStackNavigationProp<RootStackParamList, ROUTES.INIT_USER>;
}

export function InitUser({
                           navigation,
                           route,
                         }: InitUserProps) {

  const [clientName, changeClientName] = useState('');

  const saveClientName = (): void => {
    userStorage.registry(clientName).then(() => auth());
  };

  const auth = (): void => {
    userStorage.getUserUuid().then(userUuid => {
      if (userUuid) {
        socket.on('connect', () => {
          console.log('connected');
        });

        socket.connect();
        socket.emit('auth', { uuid: userUuid });
      }

      socket.on('isAuthorized', (userDetails: UserDetailsAuthorizedResponse) => {
        if (userDetails.auth) {
          navigation.navigate(ROUTES.MAP, {});

          userStorage.updateCurrentUserDetails(userDetails);
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
