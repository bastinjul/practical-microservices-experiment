import {VideoPublishingComponentContext} from "./types";

export function transcodeVideo(context: VideoPublishingComponentContext): VideoPublishingComponentContext {
    context.transcodedUri = 'https://www.youtube.com/watch?v=oNJ4aBoRipg';
    console.log(`Transcode ${context.command.data.sourceUri} to ${context.transcodedUri}`)
    return context;
}