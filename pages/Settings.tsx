import {
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

interface SettingsProps {
  route: RouteProp<RootStackParamList, ROUTES.SETTINGS>;
  navigation: NativeStackNavigationProp<RootStackParamList, ROUTES.SETTINGS>;
}

export const Settings = ({
                           navigation,
                           route,
                         }: SettingsProps) => {
  const [userName, setUserName] = useState<string>('');
  const [initialUserName, setInitialUserName] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [inputRef, setInputRef] = useState<TextInput>();
  const [userImage, setUserImage] = useState<string | null>();

  useEffect(() => {
    userStorage.currentUserDetails$.subscribe(res => {
      setInitialUserName(res.name || '');
      setUserImage(res.image);
    });
  }, []);

  useEffect(() => {
    checkValidity();
  }, [userName]);

  const checkValidity = () => {
    setIsValid(Boolean(userName?.length));
  };

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
          userStorage.updateUserInfo({ image: resized.base64 }).then(() => {
            setUserImage(resized.base64);
          });
        });

      }
    });
  };

  const saveUserInfo = () => {
    userStorage.updateUserInfo({ name: userName }).then(() => {
      setInitialUserName(userName);
      setUserName(userName);
      inputRef?.clear();
      checkValidity();
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <TouchableOpacity onPress={openImageCrop}>
          <ProfilePicture
            size={0.15}
            text={userName?.substring(0, 1)}
            image={userImage}
          ></ProfilePicture>
        </TouchableOpacity>

        <View style={styles.profileInfo}>
          <Text>Name</Text>
          <TextInput
            ref={input => { input && setInputRef(input); }}
            maxLength={25}
            style={styles.nameInput}
            placeholder={initialUserName || ''}
            onChangeText={setUserName}
          ></TextInput>
        </View>
      </View>

      <View>
        <Button
          onPress={saveUserInfo}
          disabled={!isValid}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
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
