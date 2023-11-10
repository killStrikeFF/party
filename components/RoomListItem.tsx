import {
  StyleSheet,
  View,
} from 'react-native';
import { RoomInfo } from '../types/room';
import {
  Button,
  Icon,
  ListItem,
  Text,
} from '@rneui/themed';
import React from 'react';
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import { BACKEND_API } from '../utils/backend';

export function RoomListItem({
                               room,
                               connectToRoom,
                             }: { room: RoomInfo, connectToRoom: (roomId: string) => void }) {
  const copyLink = (uuid: string) => {
    const appUrl = Linking.createURL('');
    const localAppLink = appUrl.substring(
      appUrl.indexOf('//') + 2,
      appUrl.lastIndexOf(':'),
    );
    const localPort = appUrl.substring(appUrl.lastIndexOf(':') + 1);
    const url = Linking.createURL(
      'party/join-private-room',
      {
        queryParams: {
          roomId: uuid,
          localAppLink,
          localPort,
        },
      },
    );
    const replacedWithBackend = url.replace(url.substring(0, url.indexOf('/--/') + 3), `http://${BACKEND_API}`);
    Clipboard.setStringAsync(replacedWithBackend).then();
  };

  return (
    <ListItem
      bottomDivider
      containerStyle={{
        borderRadius: 10,
        marginBottom: 5,
      }}
    >
      <ListItem.Content style={styles.listItemSubtitleContainer}>
        <View>
          <Text h4>{room.name}</Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}
          >
            <Text>Владелец: {room.owner.name}</Text>

            <View style={styles.devider}></View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Icon
                name={'person'}
              />
              <Text>{room.userCount}</Text>
            </View>
          </View>
        </View>
        <View>
          <Button
            radius={'sm'}
            type="outline"
            buttonStyle={{
              backgroundColor: 'white',
              borderColor: 'black',
            }}
            onPress={() => connectToRoom(room.uuid)}
          >
            <Text>Войти</Text>
            <Icon
              name="login"
              color="black"
              style={{ marginLeft: 5 }}
            />
          </Button>

          <Button onPress={() => copyLink(room.uuid)}>LINK</Button>
        </View>
      </ListItem.Content>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  listItemSubtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  devider: {
    marginLeft: 8,
    marginRight: 5,
    height: '100%',
    borderLeftWidth: 1,
  },
});
