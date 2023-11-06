import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  shareReplay,
} from 'rxjs';
import {
  CreateRoom,
  RoomInfo,
} from '../types/room';
import axios from 'axios';
import { BACKEND_API } from '../utils/backend';
import { Socket } from 'socket.io-client';

export class RoomsDataService {

  public readonly rooms$ = new BehaviorSubject<RoomInfo[]>([]);
  public readonly connectedRoomId$ = new BehaviorSubject<string>('');
  public readonly connectedRoomName$ = combineLatest([
    this.rooms$,
    this.connectedRoomId$,
  ]).pipe(
    map(([rooms, connectedRoomId]) => {
      const room = rooms.find(room => room.uuid === connectedRoomId);

      if (room) {
        return room.name;
      }

      return null;
    }),
    distinctUntilChanged(),
    shareReplay(1),
  );

  constructor(private readonly socket: Socket) {
    this.socket.on('allParties', response => {
      this.rooms$.next(response.parties);
    });
  }

  public updateAllRooms(): void {
    this.socket.emit('updateAllParties');
  }

  public async createRoom(roomDto: CreateRoom): Promise<void> {
    await axios.post(`http://${BACKEND_API}/party`, roomDto);
    this.updateAllRooms();
  };

  public async joinRoom(
    roomUuid: string,
    userUuid: string,
  ): Promise<void> {
    const res = await axios.post(
      `http://${BACKEND_API}/party/join`,
      {
        roomUuid,
        userUuid,
      },
    );
    this.updateAllRooms();
    this.connectedRoomId$.next(res.data.uuid || '');
  };

  public async leaveRoom(): Promise<void> {
    await axios.post(`http://${BACKEND_API}/party/leave`, { uuid: this.connectedRoomId$.getValue() });
    this.updateAllRooms();
    this.connectedRoomId$.next('');
  };
}
