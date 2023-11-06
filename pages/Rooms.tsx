import React, {
  useEffect,
  useState,
} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { RoomListItem } from '../components/RoomListItem';
import { RoomInfo } from '../types/room';
import { RouteProp } from '@react-navigation/native';
import {
  RootStackParamList,
  ROUTES,
} from '../types/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { roomDataService } from '../utils/shared.utils';

interface RoomsProps {
  route: RouteProp<RootStackParamList, ROUTES.ROOMS>;
  navigation: NativeStackNavigationProp<RootStackParamList, ROUTES.ROOMS>;
}

export function Rooms({
                        navigation,
                        route,
                      }: RoomsProps) {
  const { currentUserUuid } = route.params;

  const [allRooms, setAllRooms] = useState<RoomInfo[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    roomDataService.rooms$.subscribe(rooms => {
      setAllRooms(rooms);
      setIsRefreshing(false);
    });
  }, [navigation]);

  const joinRoom = (roomUuid: string): void => {
    roomDataService.joinRoom(roomUuid, currentUserUuid).then(() => {
      navigation.navigate(ROUTES.MAP, {});
    });
  };

  const refreshRooms = (): void => {
    roomDataService.updateAllRooms();
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <FlatList
          style={{
            flex: 1,
            padding: 15,
          }}
          data={allRooms}
          renderItem={({ item }) => <RoomListItem
            room={item}
            connectToRoom={joinRoom}
          />}
          refreshControl={<RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshRooms}
          ></RefreshControl>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
  },

  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
