import { UserMap } from '../types/user-map';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  RootStackParamList,
  ROUTES,
} from '../types/routes';
import { ProfilePicture } from './ProfilePicture';
import {
  Button,
  Icon,
  ListItem,
  Text,
} from '@rneui/themed';
import React from 'react';

export function UserListItem({
                               user,
                               navigation,
                             }: { user: UserMap, navigation: NativeStackNavigationProp<RootStackParamList> }) {

  const navigateToUserPage = (): void => {
    navigation.navigate(ROUTES.USER, { user });
  };

  const showUserOnMap = () => {
    navigation.navigate(ROUTES.MAP, { mapCenter: user.coords });
  };

  const whisperToUser = (): void => {
    navigation.navigate(ROUTES.MAP, { whisperUserName: user.name });
  };

  return (
    <ListItem
      bottomDivider
      containerStyle={{
        marginBottom: 5,
        borderRadius: 10,
      }}
    >
      <ListItem.Content>
        <TouchableOpacity
          onPress={navigateToUserPage}
          style={styles.userContainer}
        >
          <ProfilePicture
            size={0.1}
            text={user.name}
            image={user.image}
            isShowBorderColor={true}
          ></ProfilePicture>

          <View style={styles.userInfoContainer}>
            <Text style={{ fontSize: 18 }}>{user.name}</Text>

            <View style={styles.userActionContainer}>
              <Button
                radius={'sm'}
                type="outline"
                buttonStyle={{
                  backgroundColor: 'white',
                  borderColor: 'black',
                }}
                onPress={showUserOnMap}
              >
                <Icon
                  name="near-me"
                  color="black"
                  size={16}
                />
              </Button>

              <Button
                radius={'sm'}
                type="outline"
                buttonStyle={{
                  backgroundColor: 'white',
                  borderColor: 'black',
                }}
              >
                <Icon
                  name="explore"
                  color="black"
                  size={16}
                />
              </Button>

              <Button
                radius={'sm'}
                type="outline"
                buttonStyle={{
                  backgroundColor: 'white',
                  borderColor: 'black',
                }}
                onPress={whisperToUser}
              >
                <Icon
                  name="mail"
                  color="black"
                  size={16}
                />
              </Button>
            </View>
          </View>
        </TouchableOpacity>
      </ListItem.Content>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  userContainer: {
    backgroundColor: '#fff',
    padding: 0,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    flexDirection: 'row',
    columnGap: 25,
    alignItems: 'center',
  },

  userInfoContainer: {
    rowGap: 10,
  },

  userActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
});
