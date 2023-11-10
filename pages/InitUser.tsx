import {
  useEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Input,
  Text,
} from '@rneui/themed';
import {
  roomDataService,
  socket,
  userStorage,
} from '../utils/shared.utils';
import { UserDetailsAuthorizedResponse } from '../types/userDetails';

export function InitUser({ setIsLoading }: { setIsLoading: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [innerLoading, setInnerLoading] = useState(true);
  const [clientName, changeClientName] = useState('');

  const saveClientName = (): void => {
    userStorage.registry(clientName).then(() => auth());
  };

  const auth = (): void => {
    userStorage.getUserUuid().then(userUuid => {
      if (userUuid) {
        socket.emit('auth', { uuid: userUuid });
      } else {
        setInnerLoading(false);
      }
    });
  };

  useEffect(() => {
    socket.on('isAuthorized', (userDetails: UserDetailsAuthorizedResponse) => {
      if (userDetails.auth) {
        if (userDetails.currentRoom) {
          roomDataService.joinRoom(userDetails.currentRoom.uuid, userDetails.uuid).then();
        }

        userStorage.updateCurrentUserDetails(userDetails);
        setIsLoading(false);
      } else {
        setInnerLoading(false);
      }
    });

    auth();

    return () => {
      console.log('destroy init');
    };
  }, []);

  return (
    innerLoading ?
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
        />
        <Text style={{ marginTop: 15 }}>Загружаем данные...</Text>
      </View>
      :
      <View style={styles.container}>
        <Input
          onChangeText={changeClientName}
          value={clientName}
          placeholder={'Введите ваше имя'}
        />

        <Button
          title="Зарегистрироваться"
          onPress={() => saveClientName()}
          disabled={!clientName}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    columnGap: 20,
    padding: 50,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
