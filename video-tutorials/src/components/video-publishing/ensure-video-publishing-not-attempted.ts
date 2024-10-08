import {VideoPublishingComponentContext} from "./types";
import {AlreadyPublishedError} from "../../errors/AlreadyPublishedError";

export function ensureVideoPublishingNotAttempted(context: VideoPublishingComponentContext): VideoPublishingComponentContext {
    if(context.video.publishedAttempted) {
        throw new AlreadyPublishedError()
    }
    return context;
}