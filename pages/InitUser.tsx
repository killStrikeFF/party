import { useState } from 'react';
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

export function InitUser({
                           isLoading,
                           registry,
                         }: { isLoading: boolean, registry: (clientName: string) => void }) {
  const [clientName, changeClientName] = useState('');

  return (
    isLoading ?
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
          onPress={() => registry(clientName)}
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
