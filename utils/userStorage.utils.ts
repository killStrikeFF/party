import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BACKEND_API } from './backend';
import { ReplaySubject } from 'rxjs';
import { UserDetails } from '../types/userDetails';

export class UserStorage {

  public readonly currentUserDetails$ = new ReplaySubject<UserDetails>(1);

  private readonly userLocalStorageKeyUuid = 'uuid';

  public updateCurrentUserDetails(userDetails: UserDetails): void {
    this.currentUserDetails$.next(userDetails);
  }

  public registry(name: string): Promise<void> {
    return axios.post(`http://${BACKEND_API}/registry`, { name })
      .then(response => this.setUserUuid(response.data.uuid));
  }

  public updateUserInfo({
                          name,
                          image,
                          color,
                        }: { name?: string, image?: string, color?: string }): Promise<{ data: UserDetails }> {
    return this.getUserUuid().then(uuid => {
      return axios.patch(
        `http://${BACKEND_API}/user-info`,
        {
          name,
          image,
          uuid,
          color,
        },
      );
    });
  }

  public setUserUuid(uuid: string): Promise<void> {
    return AsyncStorage.setItem(this.userLocalStorageKeyUuid, uuid);
  }

  public getUserUuid(): Promise<string | null> {
    return AsyncStorage.getItem(this.userLocalStorageKeyUuid);
  }
}
