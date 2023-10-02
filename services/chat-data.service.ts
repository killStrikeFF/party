import { Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { ChatNode } from '../types/messages';

export enum ChatEvents {
  ChatEvents = 'chatEvents',
  SendChatMessage = 'sendChatMessage',
}

export class ChatDataService {

  public readonly chatMessages$ = new BehaviorSubject<ChatNode[]>([]);
  public readonly isShownChat$ = new BehaviorSubject(false);
  public readonly isClosedChat$ = new BehaviorSubject(true);

  constructor(private readonly socket: Socket) {
    this.subscribeOnChatMessages();
  }

  public sendMessage(message: string): void {
    this.socket.emit(ChatEvents.SendChatMessage, { message });
  }

  public setIsShownChat(isShown: boolean): void {
    this.isShownChat$.next(isShown);
  }

  public setIsClosedChat(isClosed: boolean): void {
    this.isClosedChat$.next(isClosed);
  }

  private subscribeOnChatMessages(): void {
    this.socket.on(ChatEvents.ChatEvents, (chatMessages: ChatNode[] | ChatNode) => {
      if (Array.isArray(chatMessages)) {
        this.chatMessages$.next(chatMessages);
      } else {
        const messages = this.chatMessages$.getValue();
        messages.push(chatMessages);
        this.chatMessages$.next(messages);
      }
    });
  }
}
