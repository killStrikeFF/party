import { useState } from 'react';
import {
  TextInput,
  View,
} from 'react-native';
import { Button } from '@rneui/themed';

export function InitUser({
                           socket,
                           client,
                         }) {
  const [clientName, changeClientName] = useState('Loh');

  const saveClientName = () => {
    client.setClientName(clientName).then(() => socket.emit('updateName', { name: clientName }));
  };

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={changeClientName}
        value={clientName}
        style={styles.input}
      />

      <Button
        title="Save your name"
        onPress={() => saveClientName()}
        disabled={!clientName}
      />
    </View>
  );
}

const styles = {
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
};
