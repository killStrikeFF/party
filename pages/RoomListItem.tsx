import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RoomInfo } from '../types/room';

export function RoomListItem({
                               room,
                             }: { room: RoomInfo }) {
  return (
    <View style={styles.container}>
      <Text>{room.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#AEAEAE',
    height: 70,
    marginTop: 20,
  },
});
