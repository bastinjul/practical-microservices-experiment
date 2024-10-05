export interface VideoTutorialEvent<P extends VideoTutorialEventMetadata> {
    id: string;
    type: string;
    metadata: P;
    data: {};
}

export interface VideoTutorialEventMetadata {
    traceId: string;
}

export interface UserIdEventMetadata extends VideoTutorialEventMetadata {
    userId: string;
}

export interface Message {
    globalPosition: number;
    position: number;
    time: Date;
    streamName: string;
    type: string;
    data: any;
    metadata: VideoTutorialEventMetadata;
    id: string;
}

export interface Data {}

export interface SubscriptionMessage extends Message {
    data: DataWithPosition
}

export interface DataWithPosition {
    position: number;
}