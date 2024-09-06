
import { RoomsClient } from '@azure/communication-rooms';
import { Constants } from './constants';


export class AcsUtils {

    private static instance: AcsUtils;

    private connectionString: string;

    roomsClient: RoomsClient;

    private constructor(connectionString: string) {
        this.connectionString = connectionString;
        this.roomsClient = new RoomsClient(this.connectionString);
    }

    public static getInstance(): AcsUtils {
        if (!AcsUtils.instance) {
            AcsUtils.instance = new AcsUtils(Constants.URLS.ACS_CONNECTION_STRING)
        }
        return AcsUtils.instance
    }
}