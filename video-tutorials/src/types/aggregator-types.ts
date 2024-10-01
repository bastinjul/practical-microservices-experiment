import {VideoHandlers} from "./common-types";
import {Message} from "./event-types";

export interface AggregatorHandler extends VideoHandlers {
    [key: string]: (message: Message) => Promise<any>;
}