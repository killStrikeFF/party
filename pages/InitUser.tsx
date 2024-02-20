import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  fontWeightBold,
  fontWeightRegular,
  mainBg,
  mainGreyIcons,
  sizing0125,
  sizing05,
  sizing075,
  sizing1,
  sizing125,
  sizing150,
  sizing2,
  sizing25,
} from '../styles/style.variables';
import {
  Button,
  Divider,
  Input,
} from '@rneui/themed';
import GoogleLoginIcon from '../assets/icons/login-google.svg';
import VkLoginIcon from '../assets/icons/login-vk.svg';
import YandexLoginIcon from '../assets/icons/login-yandex.svg';
import EyeHidden from '../assets/icons/eye-password-hidden.svg';

export function InitUser({
                           isLoading,
                           registry,
                         }: { isLoading: boolean, registry: (clientName: string) => void }) {
  const [clientName, changeClientName] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleIsShowPassword = (event: any) => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    isLoading ?
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large"/>
        <Text style={{ marginTop: 15 }}>Загружаем данные...</Text>
      </View>
      :
      <ScrollView
        contentContainerStyle={{
          width: '100%',
          padding: sizing125,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            width: '100%',
            fontSize: sizing2,
            fontWeight: fontWeightBold,
            marginTop: sizing25,
            lineHeight: sizing25,
          }}
        >Рады видеть тебя в Party</Text>
        <Text
          style={{
            width: '100%',
            fontSize: sizing1,
            fontWeight: fontWeightRegular,
            lineHeight: sizing150,
            marginTop: sizing05,
          }}
        >Общайся, знакомься, будь на одной волне с друзьями</Text>
        <Image
          style={{
            width: '100%',
            marginTop: sizing150,
            height: 214,
          }}
          source={require('../assets/images/welcome.png')}
        ></Image>
        <View
          style={{
            marginTop: sizing150,
            gap: sizing075,
            width: '100%',
          }}
        >
          <Input
            onChangeText={changeClientName}
            value={clientName}
            placeholder={'Логин'}
          />
          <Input
            onChangeText={setPassword}
            value={password}
            placeholder={'Пароль'}
            secureTextEntry={secureTextEntry}
            rightIcon={<EyeHidden onPress={toggleIsShowPassword}/>}
            rightIconContainerStyle={{
              margin: 0,
              marginVertical: 0,
              paddingVertical: 0,
              padding: 0,
              paddingHorizontal: 0,
              marginHorizontal: 0,
              height: 'auto',
            }}
          />
          <Button
            title="Зарегистрироваться"
            onPress={() => registry(clientName)}
            disabled={!clientName}
            containerStyle={{ width: '100%' }}
          />
        </View>
        <View
          style={{
            marginTop: sizing2,
            flexDirection: 'row',
            gap: sizing05,
            alignItems: 'center',
          }}
        >
          <Divider
            style={{ flex: 1 }}
          />
          <Text
            style={{
              color: mainGreyIcons,
              fontWeight: fontWeightRegular,
              lineHeight: sizing1,
              fontSize: sizing075,
              letterSpacing: sizing0125,
            }}
          >
            Войти с помощью</Text>
          <Divider style={{ flex: 1 }}/>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: sizing1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: sizing1,
          }}
        >
          <Button
            isIconButton
            buttonStyle={{
              backgroundColor: mainBg,
            }}
          >
            <GoogleLoginIcon/>
          </Button>

          <Button
            isIconButton
            buttonStyle={{
              backgroundColor: mainBg,
            }}
          >
            <VkLoginIcon/>
          </Button>

          <Button
            isIconButton
            buttonStyle={{
              backgroundColor: mainBg,
            }}
          >
            <YandexLoginIcon/>
          </Button>
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
