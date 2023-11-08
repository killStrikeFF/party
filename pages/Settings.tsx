import {
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import {
  RootStackParamList,
  ROUTES,
} from '../types/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfilePicture } from '../components/ProfilePicture';
import {
  useEffect,
  useState,
} from 'react';
import { userStorage } from '../utils/shared.utils';
import {
  Button,
  Text,
} from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import {
  manipulateAsync,
  SaveFormat,
} from 'expo-image-manipulator';
import { PRE_DEFINED_COLORS } from '../utils/constants';

interface SettingsProps {
  route: RouteProp<RootStackParamList, ROUTES.SETTINGS>;
  navigation: NativeStackNavigationProp<RootStackParamList, ROUTES.SETTINGS>;
}

export const Settings = ({
                           navigation,
                           route,
                         }: SettingsProps) => {
  const [initialUserName, setInitialUserName] = useState<string>('');
  const [newUserName, setNewUserName] = useState<string>('');
  const [inputRef, setInputRef] = useState<TextInput>();
  const [userImage, setUserImage] = useState<string>();
  const [newUserImage, setNewUserImage] = useState<string>();
  const [isValid, setIsValid] = useState<boolean>(false);
  const [userColor, setUserColor] = useState<string>();
  const [newUserColor, setNewUserColor] = useState<string>();
  const borderColors = PRE_DEFINED_COLORS;

  useEffect(() => {
    userStorage.currentUserDetails$.subscribe(res => {
      setInitialUserName(res.name);
      setUserImage(res.image);
      setUserColor(res.color);
    });
  }, []);

  useEffect(() => {
    setIsValid(Boolean(newUserName || newUserImage || newUserColor));
  }, [newUserName, newUserImage, newUserColor]);

  const openImageCrop = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
    }).then(res => {
      if (res.assets && res.assets[0]?.uri) {
        const img = res.assets[0].uri;

        manipulateAsync(
          img,
          [
            {
              resize: {
                width: 256,
                height: 256,
              },
            },
          ],
          {
            format: SaveFormat.PNG,
            base64: true,
          },
        ).then(resized => {
          setNewUserImage(resized.base64);
        });

      }
    });
  };

  const saveUserInfo = () => {
    userStorage.updateUserInfo({
      name: newUserName,
      image: newUserImage,
      color: newUserColor,
    }).then((res) => {
      userStorage.updateCurrentUserDetails(res.data);
      inputRef?.clear();
      setNewUserName('');
      setNewUserColor('');
      setNewUserImage('');
    });
  };

  const ColorBadge = ({
                        color,
                        selected,
                      }: { color: string, selected: boolean }) => {
    const styles = StyleSheet.create({
      circle: {
        backgroundColor: color,
        borderColor: '#333',
        borderWidth: selected ? 2 : 0,
        height: Dimensions.get('window').height * 0.04,
        width: Dimensions.get('window').height * 0.04,
        borderRadius: Math.round((Dimensions.get('window').height + Dimensions.get('window').width) / 2),
      },
    });

    return <View style={styles.circle}></View>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.profileCardRow}>
          <TouchableOpacity onPress={openImageCrop}>
            <ProfilePicture
              borderColor={newUserColor || userColor}
              size={0.15}
              text={newUserName || initialUserName}
              image={newUserImage || userImage}
            ></ProfilePicture>
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <Text>Name</Text>
            <TextInput
              ref={input => {
                input && setInputRef(input);
              }}
              maxLength={25}
              style={styles.nameInput}
              placeholder={initialUserName || ''}
              onChangeText={setNewUserName}
            ></TextInput>
          </View>
        </View>

        <View style={styles.profileCardRow}>
          {borderColors.map(color => (
            <TouchableOpacity
              onPress={() => setNewUserColor(color)}
              key={color}
            >
              <ColorBadge
                color={color}
                selected={color === newUserColor}
                key={color}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View>
        <Button
          disabled={!isValid}
          onPress={saveUserInfo}
        >SAVE</Button>
      </View>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  profileCard: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 20,
    flexDirection: 'column',
    marginBottom: 20,
    gap: 24,
    position: 'relative',
  },

  profileCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: 12,
  },

  profileInfo: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  nameInput: {
    fontSize: 26,
    width: 'auto',
  },
});
