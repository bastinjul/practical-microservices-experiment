import {VideoPublishingComponentContext} from "./types";
import {UserIdEventMetadata, VideoTutorialEvent} from "../../types/event-types";
import {v4 as uuid} from "uuid";

export function writeVideoPublishedFailedEvent(err: Error, context: VideoPublishingComponentContext): Promise<VideoPublishingComponentContext> {
    const messageStore = context.messageStore;
    const command = context.command;
    const metadata = command.metadata as UserIdEventMetadata;
    const streamName = `videoPublishing-${command.data.videoId}`
    const event: VideoTutorialEvent<UserIdEventMetadata> = {
        id: uuid(),
        type: 'VideoPublishingFailed',
        metadata: {
            traceId: metadata.traceId,
            userId: metadata.userId
        },
        data: {
            ownerId: command.data.ownerId,
            sourceUri: command.data.sourceUri,
            videoId: command.data.videoId,
            reason: err.message,
        }
    }
    return messageStore.write(streamName, event)
        .then(() => context);
}