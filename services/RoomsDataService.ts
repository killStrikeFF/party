import {
  BehaviorSubject,
  take,
} from 'rxjs';
import {
  CreateRoom,
  RoomInfo,
} from '../types/room';
import axios from 'axios';
import { BACKEND_API } from '../utils/backend';
import { UserCoordinates } from '../types/user-coordinates';
import { Socket } from 'socket.io-client';

export class RoomsDataService {

  public readonly rooms$ = new BehaviorSubject<RoomInfo[]>([]);
  public readonly connectedRoomId$ = new BehaviorSubject<string>('');
  public readonly usersCoordinates$ = new BehaviorSubject<UserCoordinates[]>([]);

  constructor(private readonly socket: Socket) {
    this.socket.on('allParties', response => {
      this.rooms$.next(response.parties);
    });

    this.updateAllRooms();
    this.subscribeOnUserCoordinatesOfRoom();
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
    userUuid: string,
  ): void {
    axios.post(`http://${BACKEND_API}/party/join`,
      {
        roomUuid,
        userUuid,
      },
    ).then(res => {
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

  private subscribeOnUserCoordinatesOfRoom(): void {
    this.socket.on('usersCoordinates', (res) => {
      this.connectedRoomId$.pipe(take(1)).subscribe(coonectedRoomId => {
        if (coonectedRoomId) {
          this.usersCoordinates$.next(res);
        } else {
          this.usersCoordinates$.next([]);
        }
      });
    });
  }
}
