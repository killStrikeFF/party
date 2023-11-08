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

  public async registry(name: string): Promise<void> {
    const response = await axios.post(`http://${BACKEND_API}/registry`, { name });
    return await this.setUserUuid(response.data.uuid);
  }

  public async updateUserInfo({
                                name,
                                image,
                                color,
                              }: { name?: string, image?: string, color?: string }): Promise<{ data: UserDetails }> {
    const uuid = await this.getUserUuid();
    return await axios.patch(
      `http://${BACKEND_API}/user-info`,
      {
        name,
        image,
        uuid,
        color,
      },
    );
  }

  public setUserUuid(uuid: string): Promise<void> {
    return AsyncStorage.setItem(this.userLocalStorageKeyUuid, uuid);
  }

  public getUserUuid(): Promise<string | null> {
    return AsyncStorage.getItem(this.userLocalStorageKeyUuid);
  }
}
