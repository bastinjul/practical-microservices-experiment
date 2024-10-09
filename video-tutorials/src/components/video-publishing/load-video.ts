import {VideoPublishing, VideoPublishingComponentContext} from "./types";
import {Projection} from "../../message-store/message-store-types";
import {Message} from "../../types/event-types";

const videoPublishingProjection: Projection<VideoPublishing> = {
    $init(): VideoPublishing {
        return {
            id: null,
            publishedAttempted: false,
            sourceUri: null,
            transcodedUri: null,
            sequence: 0,
            name: '',
        } as VideoPublishing;
    },
    VideoPublished(video: VideoPublishing, published: Message): VideoPublishing {
         video.id = published.data.videoId;
         video.publishedAttempted = true;
         video.ownerId = published.data.ownerId;
         video.sourceUri = published.data.sourceUri;
         video.transcodedUri = published.data.transcodedUri;
         return video;
    },
    VidePublishingFailed (video: VideoPublishing, failed: Message): VideoPublishing {
        video.id = failed.data.videoId;
        video.publishedAttempted = true;
        video.ownerId = failed.data.ownerId;
        video.sourceUri = failed.data.sourceUri;
        return video;
    },
    VideoNamed (video: VideoPublishing, named: Message): VideoPublishing {
        video.id = named.data.videoId;
        video.sequence = named.globalPosition;
        return video;
    },
    VideoNameRejected (video: VideoPublishing, rejected: Message): VideoPublishing {
        video.sequence = rejected.globalPosition;
        return video;
    }
}

export function loadVideo(context: VideoPublishingComponentContext): Promise<VideoPublishingComponentContext> {
    const messageStore = context.messageStore;
    const command = context.command;
    const streamName = `videoPublishing-${command.data.videoId}`;

    return messageStore
        .fetch(streamName, videoPublishingProjection)
        .then((video: VideoPublishing) => {
            context.video = video;
            return context;
        })
}