import {VideoPublishingComponentContext} from "./types";

export function transcodeVideo(context: VideoPublishingComponentContext): VideoPublishingComponentContext {
    context.transcodedUri = 'https://fakeuri';
    console.log(`Transcode ${context.command.data.sourceUri} to ${context.transcodedUri}`)
    return context;
}