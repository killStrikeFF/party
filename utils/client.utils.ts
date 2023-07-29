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

  public setClientName(name: string): Promise<void> {
    return AsyncStorage.setItem(this.clientLocalStorageKey, name);
  }

  public setClientUuid(uuid: string): Promise<void> {
    return AsyncStorage.setItem(this.clientLocalStorageKeyUuid, uuid);
  }

  public getClientUuid(): Promise<string | null> {
    return AsyncStorage.getItem(this.clientLocalStorageKeyUuid);
  }
}
