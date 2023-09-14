export interface ChatEvent {
  message: string;
  time: Date;
}

export interface ChatMessage extends ChatEvent {
  senderUuid: string;
  senderName: string;
}

export interface ChatPrivateMessage extends ChatMessage {
  receiverUuid: string;
  receiverName: string;
}

export type ChatNode = ChatEvent & ChatMessage & ChatPrivateMessage;
