import { RouteProp } from '@react-navigation/native';
import {
  RootStackParamList,
  ROUTES,
} from '../types/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import {
  useEffect,
  useState,
} from 'react';
import {
  Button,
  Icon,
  Text,
} from '@rneui/themed';
import {
  roomDataService,
  usersData,
} from '../utils/shared.utils';
import { UserMap } from '../types/user-map';
import { UserListItem } from '../components/UserListItem';

interface UsersProps {
  route: RouteProp<RootStackParamList, ROUTES.USERS>;
  navigation: NativeStackNavigationProp<RootStackParamList, ROUTES.USERS>;
}

export function Users({
                        navigation,
                        route,
                      }: UsersProps) {
  const [users, setUsers] = useState<UserMap[]>([]);

  useEffect(() => {
    navigation.setOptions({ headerRight: leaveTemplateRef });
  }, [navigation]);

  useEffect(() => {
    usersData.users$.subscribe(users => setUsers(users));
    roomDataService.connectedRoomName$.subscribe(connectedRoomName => {
      navigation.setOptions({ title: connectedRoomName || 'Пользователи' });
    });
  }, []);

  const leaveRoom = () => {
    roomDataService.leaveRoom().then(() => {
      navigation.navigate(ROUTES.MAP, {});
    });
  };

  const leaveTemplateRef = () => {
    return (
      <Button
        type="outline"
        buttonStyle={{
          borderColor: 'black',
        }}
        onPress={leaveRoom}
      >
        <Text>Выйти</Text>
        <Icon
          name="logout"
          size={14}
          style={{ marginLeft: 5 }}
        ></Icon>
      </Button>
    );
  };

  return (
    <View style={styles.usersContainer}>
      <FlatList
        style={{ padding: 15 }}
        data={users}
        renderItem={({ item }) => {
          return <UserListItem
            user={item}
            navigation={navigation}
          ></UserListItem>;
        }}
        keyExtractor={item => item.uuid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  usersContainer: {
    height: '100%',
    flex: 1,
  },
});
