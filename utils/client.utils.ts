import AsyncStorage from '@react-native-async-storage/async-storage';

export class ClientStorage {

  clientLocalStorageKey = 'clientName';
  clientName = AsyncStorage.getItem(this.clientLocalStorageKey);

  setClientName(name: string): Promise<void> {
    return AsyncStorage.setItem(this.clientLocalStorageKey, name);
  }

  getClientName(): Promise<string | null> {
    return this.clientName;
  }

}
