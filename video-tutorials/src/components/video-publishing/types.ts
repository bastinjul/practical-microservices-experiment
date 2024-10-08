import {Component} from "../../types/common-types";
import {AggregatorHandler} from "../../types/aggregator-types";
import {MessageStore} from "../../message-store/message-store-types";
import {Message} from "../../types/event-types";

export interface VideoPublishingComponent extends Component {
    handlers: AggregatorHandler;
}

export interface VideoPublishingComponentContext {
    messageStore: MessageStore;
    video: VideoPublishing;
    command: Message;
    transcodedUri: string;
}

export interface VideoPublishing {
    id: string | null;
    publishedAttempted: boolean;
    sourceUri: string | null;
    transcodedUri: string | null;
    ownerId: string | null | undefined;
}