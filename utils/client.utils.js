import AsyncStorage from '@react-native-async-storage/async-storage';

export class Client {

  clientLocalStorageKey = 'clientName';
  clientName = AsyncStorage.getItem(this.clientLocalStorageKey);

  setClientName(name) {
    return AsyncStorage.setItem(this.clientLocalStorageKey, name).then(r => this.clientName = name);
  }

  getClientName() {
    return this.clientName;
  }

}
