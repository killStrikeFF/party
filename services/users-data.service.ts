import { Socket } from 'socket.io-client';
import {
  RoomEvent,
  RoomUserEventData,
} from '../types/room-events';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  shareReplay,
  take,
} from 'rxjs';
import { RoomsDataService } from './rooms-data.service';
import { UserCoordinates } from '../types/user-coordinates';
import { UserMap } from '../types/user-map';

export const TEST_CHEC_MOCK = {
  name: 'Test Chel',
  uuid: 'test',
  coords: {
    latitude: 54.50,
    longitude: 36.26,
  },
};

export class UsersDataService {

  public readonly usersCoordinates$ = new BehaviorSubject<UserCoordinates[]>([]);
  public readonly usersRoom$ = new BehaviorSubject<RoomUserEventData[]>([]);

  public readonly users$: Observable<UserMap[]> = combineLatest([
    this.usersCoordinates$,
    this.usersRoom$,
  ]).pipe(
    map(([usersCoordinates, usersRoom]) => {
      return usersRoom.map(userRoom => {
        const userCoordinates = usersCoordinates.find(user => user.name === userRoom.name);
        if (userCoordinates) {
          return { ...userCoordinates, ...userRoom } as UserMap;
        }

        return null;
      }).filter(userMap => Boolean(userMap)) as UserMap[];
    }),
    map(users => {
      return [
        ...users,
        TEST_CHEC_MOCK,
      ];
    }),
    shareReplay(1),
  );

  constructor(
    private readonly socket: Socket,
    private readonly roomsDataService: RoomsDataService,
  ) {
    this.subscribeOnRoomEvents();
    this.subscribeOnUserCoordinatesOfRoom();
  }

  private subscribeOnRoomEvents(): void {
    this.socket.on('roomEvents', (roomEvent: RoomEvent<any>) => {
      if (roomEvent.payload.hasOwnProperty('users')) {
        this.usersRoom$.next(roomEvent.payload.users);
      }
    });
  }

  private subscribeOnUserCoordinatesOfRoom(): void {
    this.socket.on('usersCoordinates', (res) => {
      this.roomsDataService.connectedRoomId$.pipe(take(1)).subscribe(coonectedRoomId => {
        if (coonectedRoomId) {
          this.usersCoordinates$.next(res);
        } else {
          this.usersCoordinates$.next([]);
        }
      });
    });
  }
}
