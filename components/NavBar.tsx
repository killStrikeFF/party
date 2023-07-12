import {
  StyleSheet,
  View,
} from 'react-native';
import { Button } from '@rneui/themed';
import React from 'react';

export function NavBar({
                         navigation,
                       }: any) {
  return (
    <View style={styles.navBar}>
      <Button
        onPress={() => navigation.navigate('Rooms')}
        title={'Комнаты'}
        containerStyle={{
          width: '40%',
          marginVertical: 10,
          marginHorizontal: 10,
        }}
      />
      <Button
        onPress={() => navigation.navigate('Map')}
        title={'Карта'}
        containerStyle={{
          width: '40%',
          marginVertical: 10,
          marginHorizontal: 10,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
