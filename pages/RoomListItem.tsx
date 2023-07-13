import {
  StyleSheet,
  View,
} from 'react-native';
import { RoomInfo } from '../types/room';
import {
  Icon,
  ListItem,
  Text,
} from '@rneui/themed';

export function RoomListItem({
                               room,
                               connectToRoom,
                               leaveRoom,
                             }: { room: RoomInfo, connectToRoom: (roomId: string) => void, leaveRoom: () => void }) {
  return (
    <ListItem bottomDivider>
      <ListItem.Content>
        <View style={styles.listItemSubtitleContainer}>
          <Text h4>{room.name}</Text>

          <View
            style={{
              ...styles.listItemSubtitleItem,
              columnGap: 15,
            }}
          >
            <Icon
              onPress={() => {
                connectToRoom(room.uuid);
              }}
              name={'link'}
            />
            <Icon
              onPress={() => {
                leaveRoom();
              }}
              name={'link-off'}
            />
          </View>
        </View>
        <View style={styles.listItemSubtitleContainer}>
          <View style={styles.listItemSubtitleItem}>
            <Text>Owner: {room?.owner}</Text>
          </View>

          <View style={styles.listItemSubtitleItem}>
            <Icon name={'person'}/>
            <Text>{room.clientsCount}</Text>
          </View>
        </View>
      </ListItem.Content>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  listItemSubtitleContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  listItemSubtitleItem: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
});
