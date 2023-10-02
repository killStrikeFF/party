import {
  BehaviorSubject,
  take,
} from 'rxjs';
import {
  ConnectToRoom,
  CreateRoom,
  RoomInfo,
} from '../types/room';
import axios from 'axios';
import { BACKEND_API } from '../utils/backend';
import { ClientCoordinates } from '../types/client-coordinates';
import { Socket } from 'socket.io-client';

export class RoomsDataService {

  public readonly rooms$ = new BehaviorSubject<RoomInfo[]>([]);
  public readonly connectedRoomId$ = new BehaviorSubject<string>('');
  public readonly clientsCoordinatesRoom$ = new BehaviorSubject<ClientCoordinates[]>([]);

  constructor(private readonly socket: Socket) {
    this.socket.on('allParties', response => {
      this.rooms$.next(response.parties);
    });

    this.updateAllRooms();
    this.subscribeOnClientsCoordinatesOfRoom();
  }

  public updateAllRooms(): void {
    this.socket.emit('updateAllParties');
  }

  public createRoom(roomDto: CreateRoom): Promise<void> {
    return axios.post(`http://${BACKEND_API}/party`, roomDto).then((res) => {
      this.updateAllRooms();
    });
  };

  public joinRoom(
    roomUuid: string,
    clientUuid: string,
  ): void {
    const roomConnectData: ConnectToRoom = {
      clientUuid,
      roomUuid,
    };

    axios.post(`http://${BACKEND_API}/party/join`, roomConnectData).then(res => {
      this.updateAllRooms();
      this.connectedRoomId$.next(res.data.uuid || '');
    });
  };

  public leaveRoom(uuid: string): void {
    axios.post(`http://${BACKEND_API}/party/leave`, { uuid }).then(() => {
      this.updateAllRooms();
      this.connectedRoomId$.next('');
    });
  };

  private subscribeOnClientsCoordinatesOfRoom(): void {
    this.socket.on('clientsCoordinates', (res) => {
      this.connectedRoomId$.pipe(take(1)).subscribe(coonectedRoomId => {
        if (coonectedRoomId) {
          this.clientsCoordinatesRoom$.next(res);
        } else {
          this.clientsCoordinatesRoom$.next([]);
        }
      });
    });
  }
}
