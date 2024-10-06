import {Message, VideoTutorialEvent, VideoTutorialEventMetadata} from "../types/event-types";
import {AggregatorHandler} from "../types/aggregator-types";
import {QueryResult} from "pg";

export interface MessageStore {
    write: WriteFunction,
    createSubscription: (subscriptionConfig: CreateSubscriptionConfig) => Subscription;
    read: (streamName: string, currentPosition: number, messagesPerTick: number) => Promise<Message[]>;
    readLastMessage: (subscriberStreamName: string) => Promise<Message>;
    fetch: (streamName: string, projection: Projection<any>) => Promise<any>;
}

export interface CreateRead {
    readLastMessage: (stramName: string) => Promise<Message>;
    read: (streamName: string, fromPosition: number, maxMessages: number) => Promise<Message[]>;
    fetch: (streamName: string, projection: Projection<any>) => Promise<any>;
}
export interface CreateSubscription {
    read: (streamName: string, currentPosition: number, messagesPerTick: number) => Promise<Message[]>;
    readLastMessage: (subscriberStreamName: string) => Promise<Message>;
    write: WriteFunction;
}

export interface CreateSubscriptionConfig {
    streamName: string;
    handlers: AggregatorHandler;
    messagesPerTick: number;
    subscriberId: string;
    positionUpdateInterval: number;
    tickIntervalMs: number;
    originStreamName: string | null;
}

export interface Subscription {
    loadPosition: () => Promise<void>;
    start: () => Promise<void>;
    stop: () => void;
    tick: () => Promise<number | void>;
    writePosition: (position: number) => Promise<QueryResult>;
}

export type WriteFunction = (streamName: string, message: VideoTutorialEvent<VideoTutorialEventMetadata>, expectedVersion?: number) => Promise<QueryResult>;

export interface Projection<T> {
    $init(): T;
    [eventName: string]: (entity: T, event: Message) => T;
}