import { useState } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Input,
} from '@rneui/themed';
import { ClientStorage } from '../utils/client.utils';
import { Socket } from 'socket.io-client';

export function InitUser({
                           socket,
                           clientStorage,
                           setClientName,
                         }: {
  socket: Socket,
  clientStorage: ClientStorage,
  setClientName: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const [clientName, changeClientName] = useState('');

  const saveClientName = () => {
    clientStorage.setClientName(clientName).then(() => {
      socket.emit('updateName', { name: clientName });
      setClientName(clientName);
    });
  };

  return (
    <View style={styles.container}>
      <Input
        onChangeText={changeClientName}
        value={clientName}
        placeholder={'Write your name, cocksucker'}
      />

      <Button
        title="Save"
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
