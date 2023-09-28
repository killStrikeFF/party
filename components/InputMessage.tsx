import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import {
  Icon,
  Input,
} from '@rneui/themed';
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { DrawerState } from '../pages/ChatDrawer';
import { chatDataService } from '../utils/shared.utils';

export enum InputMessageDrawState {
  Open = 0,
  Closed = -50,
}

export const animateMoveInputMessage = (
  y: Animated.Value,
  toValue: number | Animated.Value,
) => {
  Animated.spring(y, {
    toValue: -toValue,
    tension: 20,
    useNativeDriver: true,
  }).start();
};

export const getNextStateInputMessage = (currentState: InputMessageDrawState): InputMessageDrawState => {
  if (currentState === InputMessageDrawState.Open) {
    return InputMessageDrawState.Closed;
  }

  return InputMessageDrawState.Open;
};

export function InputMessage({ isShowInputMessage }: { isShowInputMessage: boolean }) {
  const [message, setMessage] = useState('');
  const y = useRef(new Animated.Value(DrawerState.Closed)).current;

  const sendMessage = (): void => {
    if (message.trim().length) {
      chatDataService.sendMessage(message.trim());
      setMessage('');
    }
  };

  useEffect(() => {
    const nextState = getNextStateInputMessage(isShowInputMessage ?
      InputMessageDrawState.Closed :
      InputMessageDrawState.Open);
    animateMoveInputMessage(y, nextState);
  }, [isShowInputMessage]);

  return (
    <Animated.View
      style={{
        ...styles.message,
        transform: [{ translateY: y }],
      }}
    >
      <View style={{ width: '100%' }}>
        <Input
          onChangeText={setMessage}
          placeholder={'Сообщение'}
          errorStyle={{ display: 'none' }}
          value={message}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          rightIcon={<Icon
            name="send"
            color="black"
            onPress={sendMessage}
          />}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  message: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    zIndex: 1000,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#aeaeae',
    paddingRight: 0,
  },
});
