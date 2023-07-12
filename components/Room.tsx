import React from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/themed';

export function Room({
                       name,
                       count,
                       address,
                     }: any) {
  return (
    <View>
      <Text>{name}</Text>
      <Text>{count}</Text>
      <Text>{address}</Text>
    </View>
  );
}
