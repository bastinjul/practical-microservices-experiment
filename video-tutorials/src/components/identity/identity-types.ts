import {MessageStore} from "../../message-store/message-store-types";
import {AggregatorHandler} from "../../types/aggregator-types";
import {Message} from "../../types/event-types";
import {Component} from "../../types/common-types";

export interface Identity {
    id: string | null;
    email: string | null;
    isRegistered: boolean;
}

export interface IdentityComponent extends Component {
    identityCommandHandlers: AggregatorHandler;
}

export interface IdentityCommandHandlerContext {
    messageStore: MessageStore;
    command: Message;
    identityId: string;
    identity: Identity;
}