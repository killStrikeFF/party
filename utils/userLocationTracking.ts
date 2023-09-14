import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Socket } from 'socket.io-client';
import { RoomsDataService } from '../services/RoomsDataService';
import {
  filter,
  ReplaySubject,
  take,
} from 'rxjs';
import { ClientCoordinatesForRoomDto } from '../types/room';
import { UserRegion } from '../types/user-region';
import { getUserRegion } from './userRegion';

const BACKGROUND_TASK_NAME = 'BACKGROUND_LOCATION_TASK';

export class UserLocationTracking {

  public readonly initialRegion$ = new ReplaySubject<UserRegion>();

  private readonly backgroundTaskName = BACKGROUND_TASK_NAME;

  constructor(
    private readonly socket: Socket,
    private readonly roomDataService: RoomsDataService,
  ) {
    const requestPermissions = async () => {
      const foreground = await Location.requestForegroundPermissionsAsync();
      if(foreground.granted) await Location.requestBackgroundPermissionsAsync();
    };

    requestPermissions().then(() => getUserRegion()).then((userRegion) => {
      this.initialRegion$.next(userRegion);
    });

    this.roomDataService.connectedRoomId$.subscribe(roomId => {
      if(roomId) {
        this.initBackgroundDefineLocationTask();
        this.startTrackingBackground();
      } else {
        this.stopTrackingBackground();
      }
    });
  }

  private async stopTrackingBackground(): Promise<void> {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(this.backgroundTaskName);
    if(hasStarted) {
      await Location.stopLocationUpdatesAsync(this.backgroundTaskName);
    }
  }

  private async startTrackingBackground(): Promise<void> {
    const { granted } = await Location.getBackgroundPermissionsAsync();
    if(!granted) {
      return;
    }

    const isTaskDefined = await TaskManager.isTaskDefined(this.backgroundTaskName);
    if(!isTaskDefined) {
      return;
    }

    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      this.backgroundTaskName,
    );

    if(hasStarted) {
      return;
    }

    await Location.startLocationUpdatesAsync(this.backgroundTaskName, {
      accuracy: Location.Accuracy.BestForNavigation,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'Location',
        notificationBody: 'Location tracking in background from Party',
        notificationColor: '#fff',
      },
      timeInterval: 1000,
    });
  };

  private initBackgroundDefineLocationTask(): void {
    TaskManager.defineTask(
      BACKGROUND_TASK_NAME,
      async ({
               data,
               error,
             }) => {
        if(error) {
          console.error(error);
          return;
        }

        if(data) {
          const { locations } = data as { locations: LocationObject[] };
          const location = locations[0];

          if(location && this.socket.id) {
            this.roomDataService.connectedRoomId$.pipe(take(1), filter(Boolean)).subscribe(roomUuid => {
              const clientCoordinatesForRoom: ClientCoordinatesForRoomDto = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              };
              this.socket.emit('updateClientCoordinates', clientCoordinatesForRoom);
            });
          }
        }
      },
    );
  }
}


