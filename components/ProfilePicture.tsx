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
                                 borderColor,
                               }: {
  size: number,
  text?: string,
  image?: string | null,
  borderColor?: string
}) => {
  const styles = StyleSheet.create({
    picturePlaceholder: {
      height: Dimensions.get('window').height * size,
      width: Dimensions.get('window').height * size,
      borderRadius: Math.round((Dimensions.get('window').height + Dimensions.get('window').width) / 2),
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: '#c0f8b4',
      borderColor: borderColor || '#c0f8b4',
      borderWidth: borderColor ? 3 : 0,
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
      borderColor: borderColor || '#c0f8b4',
      borderWidth: borderColor ? 3 : 0,
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
          >{text && text.substring(0, 1)}</Text>
        </View>}
    </View>
  );
};


