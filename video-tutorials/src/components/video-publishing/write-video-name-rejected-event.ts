import {VideoPublishingComponentContext} from "./types";
import {UserIdEventMetadata, VideoTutorialEvent} from "../../types/event-types";
import {v4 as uuid} from "uuid";

export function writeVideoNameRejectedEvent(context: VideoPublishingComponentContext, reason: string): Promise<VideoPublishingComponentContext> {
    const messageStore = context.messageStore;
    const command = context.command;
    const metadata = command.metadata as UserIdEventMetadata;
    const streamName = `videoPublishing-${command.data.videoId}`
    const event: VideoTutorialEvent<UserIdEventMetadata> = {
        id: uuid(),
        type: 'VideoNameRejected',
        metadata: {
            traceId: metadata.traceId,
            userId: metadata.userId
        },
        data: {
            name: command.data.name,
            reason,
        }
    }
    return messageStore.write(streamName, event)
        .then(() => context);
}