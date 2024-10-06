export interface VideoTutorialEvent<P extends VideoTutorialEventMetadata> {
    id: string;
    type: string;
    metadata: P;
    data: {};
}

export interface VideoTutorialEventMetadata {
    traceId: string;
}

export function isEventMetadata(obj: any): obj is VideoTutorialEventMetadata {
    return typeof obj.traceId === 'string';
}

export interface UserIdEventMetadata extends VideoTutorialEventMetadata {
    userId: string;
}

export function isUserIdEventMetadata (obj: any): obj is UserIdEventMetadata {
    return typeof obj.userId === 'string' && isEventMetadata(obj);
}

export interface OriginStreamEventMetadata extends UserIdEventMetadata {
    originStreamName: string;
}

export function isOriginStreamEventMetadata(obj: any): obj is OriginStreamEventMetadata {
    return typeof obj.originStreamName === 'string' && isUserIdEventMetadata(obj);
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