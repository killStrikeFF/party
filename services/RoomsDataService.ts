import { Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import {
  ConnectToRoom,
  CreateRoom,
  RoomInfo,
} from '../types/room';
import axios from 'axios';
import { BACKEND_API } from '../utils/backend';

export class RoomsDataService {

  public readonly rooms$ = new BehaviorSubject<RoomInfo[]>([]);

  private socket?: Socket;

  public initRooms(socket: Socket): void {
    this.socket = socket;
    socket.on('allParties', response => {
      this.rooms$.next(response.parties);
    });

    this.updateAllRooms();
  }

  public updateAllRooms(): void {
    this.socket?.emit('updateAllParties');
  }

  public createRoom(roomDto: CreateRoom): Promise<void> {
    return axios.post(`http://${BACKEND_API}/party`, roomDto).then((res) => {
      this.updateAllRooms();
    });
  };

  public joinRoom(
    roomId: string,
    socketId: string,
  ): void {
    const roomConnectData: ConnectToRoom = {
      socketId,
      uuid: roomId,
    };

    axios.post(`http://${BACKEND_API}/party/join`, roomConnectData).then(res => this.updateAllRooms());
  };

  public leaveRoom(socketId: string): void {
    axios.post(`http://${BACKEND_API}/party/leave`, { socketId }).then(() => this.updateAllRooms());
  };
}
