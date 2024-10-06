import {MessageStore} from "../../message-store/message-store-types";
import {AggregatorHandler} from "../../types/aggregator-types";
import {Message} from "../../types/event-types";
import {Component} from "../../types/common-types";
import {EmailMessage} from "email-templates";

export interface Identity {
    id: string | null;
    email: string | null;
    isRegistered: boolean;
    registrationEmailSent: boolean;
}

export interface IdentityComponent extends Component {
    identityCommandHandlers: AggregatorHandler;
    identityEventHandlers: AggregatorHandler;
    sendEmailEventHandlers: AggregatorHandler;
}

export interface IdentityHandlerContext {
    messageStore: MessageStore;
    message: Message;
    identityId: string;
    identity: Identity;
    email: Partial<EmailMessage>;
}