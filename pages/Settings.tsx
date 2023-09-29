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
import { clientStorage } from '../utils/shared.utils';
import {
  Button,
  Text,
} from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';

interface SettingsProps {
  route: RouteProp<RootStackParamList, ROUTES.SETTINGS>;
  navigation: NativeStackNavigationProp<RootStackParamList, ROUTES.SETTINGS>;
}

export const Settings = ({
                           navigation,
                           route,
                         }: SettingsProps) => {
  const [clientName, setClientName] = useState<string>('');
  const [initialClientName, setInitialClientName] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [inputRef, setInputRef] = useState<TextInput>();
  const [userImage, setUserImage] = useState<string | null>();

  useEffect(() => {
    clientStorage.getClientName().then(res => {
      setClientName(res || '');
      setInitialClientName(res || '');

      checkValidity();
    });
  }, []);

  useEffect(() => {
    checkValidity();
  }, [clientName]);

  const checkValidity = () => {
    setIsValid(Boolean(clientName?.length));
  };

  const openImageCrop = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
      quality: 1,
    }).then(res => {
      if (res.assets && res.assets[0]?.base64) {
        const base64Img = res.assets[0].base64;
        clientStorage.updateUserInfo({ image: base64Img }).then(() => {
          setUserImage(base64Img);
        });
      }
    });
  };

  const saveClientsInfo = () => {
    clientStorage.updateUserInfo({ name: clientName }).then(() => {
      setInitialClientName(clientName);
      setClientName(clientName);
      clientStorage.setClientName(clientName);
      inputRef?.clear();
      checkValidity();
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={openImageCrop}
        style={styles.profileCard}
      >
        <ProfilePicture
          size={0.15}
          text={clientName?.substring(0, 1)}
          image={userImage}
        ></ProfilePicture>

        <View style={styles.profileInfo}>
          <Text>Name</Text>
          <TextInput
            ref={input => { input && setInputRef(input); }}
            maxLength={25}
            style={styles.nameInput}
            placeholder={initialClientName || ''}
            onChangeText={setClientName}
          ></TextInput>
        </View>
      </TouchableOpacity>

      <View>
        <Button
          onPress={saveClientsInfo}
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
