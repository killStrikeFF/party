import axios from 'axios';
import { BACKEND_API } from './backend';

export class LoggingService {
  public static log(message: string): void {
    console.log(new Date().toLocaleString(), message);
    axios.post(`http://${BACKEND_API}/logging`, { message });
  }

  public static objectToMessage(obj: Record<string, any>): string {
    return JSON.stringify(obj, null, 2);
  }
}
