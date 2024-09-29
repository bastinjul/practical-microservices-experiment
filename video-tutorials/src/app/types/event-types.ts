export interface VideoTutorialEvent<P extends VideoTutorialEventMetadata> {
    id: string;
    type: string;
    metadata: P;
    data: {};
}

export interface VideoTutorialEventMetadata {
    traceId: string;
}