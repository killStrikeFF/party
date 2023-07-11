import {
  useEffect,
  useState,
} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Button } from '@rneui/themed';
import { ClientStorage } from '../utils/client.utils';
import { Socket } from 'socket.io-client';

export function InitUser({
                           socket,
                           clientStorage,
                         }: { socket: Socket, clientStorage: ClientStorage }) {
  const [clientName, changeClientName] = useState('');

  useEffect(() => {
    clientStorage.setClientName('');
  });

  const saveClientName = () => {
    clientStorage.setClientName(clientName).then(() => socket.emit('updateName', { name: clientName }));
  };

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={changeClientName}
        value={clientName}
        style={styles.input}
        placeholder={'Write your name, cocksucker'}
      />

      <Button
        title="Save your name"
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

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
