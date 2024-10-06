import {AppHandlers} from "./common-types";
import {Message} from "./event-types";

export interface AggregatorHandler extends AppHandlers {
    [key: string]: (message: Message) => Promise<any>;
}

export interface UserCredentials {
    id: string;
    email: string;
    passwordHash: string;
}