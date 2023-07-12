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

export function RoomListItem({ room }: { room: RoomInfo }) {
  return (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title><Text h4>{room.name}</Text></ListItem.Title>
        <View style={styles.listItemSubtitleContainer}>
          <View style={styles.listItemSubtitleItem}>
            <Text>Owner: {room?.owner?.name}</Text>
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
