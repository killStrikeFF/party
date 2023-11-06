import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from '@rneui/themed';

export const ProfilePicture = ({
                                 size,
                                 text,
                                 image,
                                 isShowBorderColor = false,
                               }: {
  size: number,
  text?: string,
  image?: string | null,
  isShowBorderColor?: boolean
}) => {
  const styles = StyleSheet.create({
    picturePlaceholder: {
      height: Dimensions.get('window').height * size,
      width: Dimensions.get('window').height * size,
      borderRadius: Math.round((Dimensions.get('window').height + Dimensions.get('window').width) / 2),
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: '#c0f8b4',
      borderColor: '#22bfd4',
      borderWidth: isShowBorderColor ? 3 : 0,
    },

    picturePlaceholderText: {
      color: 'white',
      fontSize: Dimensions.get('window').height * size * 0.75,
      bottom: '3%',
      textTransform: 'capitalize',
    },

    profilePicture: {
      height: Dimensions.get('window').height * size,
      width: Dimensions.get('window').height * size,
      borderRadius: Math.round((Dimensions.get('window').height + Dimensions.get('window').width) / 2),
      resizeMode: 'cover',
      borderColor: '#22bfd4',
      borderWidth: isShowBorderColor ? 3 : 0,
    },
  });

  return (
    <View>
      {image ?
        <Image
          style={styles.profilePicture}
          source={{ uri: `data:image/png;base64,${image}` }}
        /> :
        <View style={styles.picturePlaceholder}>
          <Text
            style={styles.picturePlaceholderText}
          >{text}</Text>
        </View>}
    </View>
  );
};


