import { ChatNode } from '../types/messages';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Text } from '@rneui/themed';

export interface ChatElemProps {
  chatNode: ChatNode;
  currentUserUuid?: string;
}

export function ChatElem({
                           chatNode,
                           currentUserUuid,
                         }: ChatElemProps) {
  return (
    <View style={styles.container}>
      {chatNode.senderUuid ?
        <Text
          style={{
            ...styles.elem,
            marginLeft: currentUserUuid === chatNode?.senderUuid ? 'auto' : 0,
            marginRight: currentUserUuid !== chatNode?.senderUuid && chatNode.senderUuid ? 'auto' : 0,
          }}
        >{chatNode.message}</Text> :

        <Text
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: 5,
          }}
        >{chatNode.message}</Text>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  elem: {
    padding: 5,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor: '#EAFAFF',
  },
});
