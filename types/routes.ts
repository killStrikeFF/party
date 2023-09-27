import {RoomsDataService} from "../services/RoomsDataService";
import {UserLocationTracking} from "../utils/userLocationTracking";
import {ChatDataService} from "../services/chat-data.service";
import {Socket} from "socket.io-client";
import {ClientStorage} from "../utils/client.utils";

export enum ROUTES {
    MAP = "Map",
    ROOMS = "Rooms",
    SETTINGS = "Settings",
    INIT_USER = "InitUser"
}

export type RootStackParamList = {
    [ROUTES.MAP]: {
        roomDataService: RoomsDataService,
        userLocationTracking: UserLocationTracking,
        chatDataService: ChatDataService,
        currentClientUuid: string,
    };
    [ROUTES.ROOMS]: {
        clientUuid: string,
        roomDataService: RoomsDataService,
        userLocationTracking: UserLocationTracking
    };
    [ROUTES.INIT_USER]: {
        socket: Socket,
        clientStorage: ClientStorage,
        roomDataService: RoomsDataService,
        userLocationTracking: UserLocationTracking,
        chatDataService: ChatDataService,
    };
};



