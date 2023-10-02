import {
  Animated,
  Dimensions,
  FlatList,
  GestureResponderEvent,
  Keyboard,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { ChatNode } from '../types/messages';
import { ChatElem } from '../components/ChatElem';
import { chatDataService } from '../utils/shared.utils';
import { filter } from 'rxjs';

const { height } = Dimensions.get('window');

export enum DrawerState {
  Open = height - 90,
  Peek = 300,
  Closed = 0,
}

const numberDrawerStates = Object.values(DrawerState).filter(elem => typeof elem === 'number');

export const animateMove = (
  y: Animated.Value,
  toValue: number | Animated.Value,
  isSkipUpdate = false,
) => {
  if (numberDrawerStates.includes(toValue as number)) {
    const isClosedChat = toValue === DrawerState.Closed;
    if (isClosedChat !== chatDataService.isClosedChat$.getValue() && numberDrawerStates.includes(toValue as number) && !isSkipUpdate) {
      chatDataService.setIsClosedChat(isClosedChat);
    }

    Animated.spring(y, {
      toValue: -toValue,
      tension: 20,
      useNativeDriver: true,
    }).start((finished) => true);
  }
};

export const getNextState = (
  currentState: DrawerState,
  val: number,
  margin: number,
): DrawerState => {
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
  setIsShowContent: (isShow: boolean) => void;
  currentClientUuid?: string,
}

export function ChatDrawer({
                             setIsShowContent,
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
    animateMove(y, movementValue(moveY));
  };

  const onPanResponderRelease = (
    _: GestureResponderEvent,
    { moveY }: PanResponderGestureState,
  ) => {
    const valueToMove = movementValue(moveY);
    const nextState = getNextState((state as unknown as { _value: any })._value, valueToMove, margin);
    state.setValue(nextState);
    setNumberState(nextState);

    if (nextState === DrawerState.Peek) {
      Keyboard.dismiss();
    }

    setIsShowContent(nextState !== DrawerState.Closed);
    animateMove(y, nextState);
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

      if (numberState !== DrawerState.Open) {
        animateMove(y, DrawerState.Open);
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

  const change = () => {
    chatDataService.isClosedChat$.pipe(
      filter(isClosedChat => isClosedChat),
    ).subscribe(() => {
      state.setValue(DrawerState.Closed);
      setNumberState(DrawerState.Closed);
      animateMove(y, DrawerState.Closed, true);
      setIsShowContent(false);
    });
  };

  useEffect(() => {
    change();
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
          paddingTop: 5,
          zIndex: 52,
        },
      ]}
      {...panResponder.panHandlers} >
      <TouchableOpacity style={style.actionLineWrapper}>
        <View style={style.actionLine}></View>
      </TouchableOpacity>
      <View
        style={{
          ...style.contentContainer,
          height: numberState === DrawerState.Peek ? DrawerState.Peek - 30 : (height * 0.9) - (heightKeyboard + 25),
        }}
      >
        <FlatList
          style={{
            paddingLeft: 10,
            paddingRight: 10,
          }}
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
  actionLineWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 0,
    top: 0,
    marginBottom: 5,
    width: '100%',
    height: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#e3dfdf',
  },
  actionLine: {
    width: 70,
    height: 2,
    backgroundColor: 'black',
  },
  horizontalLine: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 0,
    top: 0,
    marginBottom: 15,
    width: 50,
  },
  contentContainer: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
});
