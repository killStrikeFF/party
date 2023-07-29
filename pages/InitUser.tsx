import { useState } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Input,
} from '@rneui/themed';

export function InitUser({ setClientName }: { setClientName: (name: string) => void }) {
  const [clientName, changeClientName] = useState('');

  const saveClientName = (): void => {
    setClientName(clientName);
  };

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
