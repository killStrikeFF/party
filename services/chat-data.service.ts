import { Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { ChatNode } from '../types/messages';

export enum ChatEvents {
  ChatEvents = 'chatEvents',
  SendChatMessage = 'sendChatMessage',
}

export class ChatDataService {

  public readonly chatMessages$ = new BehaviorSubject<ChatNode[]>([]);

  constructor(private readonly socket: Socket) {
    this.subscribeOnChatMessages();
  }

  public sendMessage(message: string): void {
    this.socket.emit(ChatEvents.SendChatMessage, { message });
  }

  private subscribeOnChatMessages(): void {
    this.socket.on(ChatEvents.ChatEvents, (chatMessages: ChatNode[] | ChatNode) => {
      if(Array.isArray(chatMessages)) {
        this.chatMessages$.next(chatMessages);
      } else {
        const messages = this.chatMessages$.getValue();
        messages.push(chatMessages);
        this.chatMessages$.next(messages);
      }
    });
  }
}
