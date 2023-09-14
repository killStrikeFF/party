import {
  Animated,
  Dimensions,
  FlatList,
  GestureResponderEvent,
  Keyboard,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  View,
} from 'react-native';
import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { Icon } from '@rneui/themed';
import { ChatNode } from '../types/messages';
import { ChatDataService } from '../services/chat-data.service';
import { ChatElem } from '../components/ChatElem';

const { height } = Dimensions.get('window');

export enum DrawerState {
  Open = height - 50,
  Peek = 300,
  Closed = 0,
}

export const animateMove = (
  y: Animated.Value,
  toValue: number | Animated.Value,
  callback?: any,
) => {
  // console.log('animateMove', y, toValue, callback);
  Animated.spring(y, {
    toValue: -toValue,
    tension: 20,
    useNativeDriver: true,
  }).start((finished) => {
    /* Optional: But the purpose is to call this after the the animation has finished. Eg. Fire an event that will be listened to by the parent component */
    finished && callback && callback();
  });
};

export const getNextState = (
  currentState: DrawerState,
  val: number,
  margin: number,
): DrawerState => {
  // console.log('getNextState', currentState, val, margin);
  switch (currentState) {
    case DrawerState.Peek:
      return val >= currentState + margin
        ? DrawerState.Open
        : val <= DrawerState.Peek - margin
          ? DrawerState.Closed
          : DrawerState.Peek;
    case DrawerState.Open:
      return val >= currentState
        ? DrawerState.Open
        : val <= DrawerState.Peek
          ? DrawerState.Closed
          : DrawerState.Peek;
    case DrawerState.Closed:
      return val >= currentState + margin
        ? val <= DrawerState.Peek + margin
          ? DrawerState.Peek
          : DrawerState.Open
        : DrawerState.Closed;
    default:
      return currentState;
  }
};

interface BottomDrawerProps {
  children?: React.ReactNode;
  onDrawerStateChange?: (nextState: DrawerState) => void;
  setIsShowContent: (isShow: boolean) => void;
  chatDataService: ChatDataService,
  currentClientUuid: string,
}

export function ChatDrawer({
                             children,
                             onDrawerStateChange,
                             setIsShowContent,
                             chatDataService,
                             currentClientUuid,
                           }: BottomDrawerProps) {
  const { height } = Dimensions.get('window');
  const y = useRef(new Animated.Value(DrawerState.Closed)).current;
  const state = useRef(new Animated.Value(DrawerState.Closed)).current;
  const margin = 0.05 * height;
  const movementValue = (moveY: number) => height - moveY;

  const [isShownKeyboard, setIsShownKeyboard] = useState(false);
  const [messages, setMessages] = useState<ChatNode[]>([]);

  const [heightKeyboard, setHeightKeyboard] = useState(0);
  const [numberState, setNumberState] = useState(DrawerState.Closed);

  const onPanResponderMove = (
    _: GestureResponderEvent,
    { moveY }: PanResponderGestureState,
  ) => {
    const val = movementValue(moveY);
    animateMove(y, val);
  };

  const openMessages = (): void => {
    if(numberState === DrawerState.Closed) {
      setIsShowContent(true);
      animateMove(y, DrawerState.Peek);
      setNumberState(DrawerState.Peek);
    }
  };

  const onPanResponderRelease = (
    _: GestureResponderEvent,
    { moveY }: PanResponderGestureState,
  ) => {
    const valueToMove = movementValue(moveY);
    const nextState = getNextState((state as unknown as { _value: any })._value, valueToMove, margin);
    state.setValue(nextState);
    setNumberState(nextState);

    if(nextState === DrawerState.Peek) {
      Keyboard.dismiss();
    }

    setIsShowContent(nextState !== DrawerState.Closed);
    animateMove(y, nextState, onDrawerStateChange?.(nextState));
  };

  const onMoveShouldSetPanResponder = (
    _: GestureResponderEvent,
    { dy }: PanResponderGestureState,
  ) => {
    return Math.abs(dy) >= 10;
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder,
      onStartShouldSetPanResponderCapture: onMoveShouldSetPanResponder,
      onPanResponderMove,
      onPanResponderRelease,
    }),
  ).current;

  useEffect(() => {
    const keyboardDidShowSubscription = Keyboard.addListener('keyboardDidShow', (event) => {
      setIsShownKeyboard(() => true);
      setHeightKeyboard(event.endCoordinates.height);

      if(numberState !== DrawerState.Open) {
        animateMove(y, DrawerState.Open, onDrawerStateChange?.(DrawerState.Open));
        setNumberState(DrawerState.Open);
      }
    });

    const keyboardDidHideSubscription = Keyboard.addListener('keyboardDidHide', (event) => {
      setIsShownKeyboard(() => false);
      setHeightKeyboard(event.endCoordinates.height);
    });

    chatDataService.chatMessages$.subscribe(chatMessages => setMessages([...chatMessages].reverse()));

    return () => {
      keyboardDidHideSubscription.remove();
      keyboardDidShowSubscription.remove();
    };
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: '100%',
          height: '100%',
          maxHeight: '100%',
          overflow: 'scroll',
          backgroundColor: '#fff',
          borderRadius: 25,
          position: 'absolute',
          bottom: -height + 40,
          transform: [{ translateY: y }],
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          columnGap: 20,
          padding: 20,
          paddingTop: 5,
          zIndex: 52,
        },
      ]}
      {...(numberState === DrawerState.Closed ? {} : panResponder.panHandlers)} >
      <Icon
        name="horizontal-rule"
        style={style.horizontalLine}
        onPress={openMessages}
      />
      <View
        style={{
          ...style.contentContainer,
          height: numberState === DrawerState.Peek ? DrawerState.Peek - 50 : (height * 0.9) - (heightKeyboard + 25),
        }}
      >
        <FlatList
          data={messages}
          inverted={true}
          renderItem={(item) => <ChatElem
            chatNode={item.item}
            currentClientUuid={currentClientUuid}
          ></ChatElem>}
        ></FlatList>
      </View>
    </Animated.View>
  );
}

const style = StyleSheet.create({
  horizontalLine: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 0,
    top: 0,
    marginBottom: 15,
  },
  contentContainer: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
});
