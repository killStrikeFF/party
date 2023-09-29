import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BACKEND_API } from './backend';

export class ClientStorage {
  private readonly clientLocalStorageKey = 'clientName';
  private readonly clientLocalStorageKeyUuid = 'uuid';

  public registry(name: string): Promise<void> {
    return axios.post(`http://${BACKEND_API}/registry`, { name })
      .then(response => {
        this.setClientName(name);
        return this.setClientUuid(response.data.uuid);
      });
  }

  public updateUserInfo({
                          name,
                          image,
                        }: { name?: string, image?: string }): Promise<void> {
    return this.getClientUuid().then(uuid => {
      return axios.patch(
        `http://${BACKEND_API}/user-info`,
        {
          name,
          image,
          uuid,
        },
      );
    });
  }

  public setClientName(name: string): Promise<void> {
    return AsyncStorage.setItem(this.clientLocalStorageKey, name);
  }

  public setClientUuid(uuid: string): Promise<void> {
    return AsyncStorage.setItem(this.clientLocalStorageKeyUuid, uuid);
  }

  public getClientUuid(): Promise<string | null> {
    return AsyncStorage.getItem(this.clientLocalStorageKeyUuid);
  }

  public getClientName(): Promise<string | null> {
    return AsyncStorage.getItem(this.clientLocalStorageKey);
  }
}
