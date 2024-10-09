import {VideoPublishingComponentContext} from "./types";
import {CommandAlreadyProcessedError} from "../../errors/CommandAlreadyProcessedError";

export function ensureCommandHasNotBeenProcessed(context: VideoPublishingComponentContext): VideoPublishingComponentContext {
    const command = context.command;
    const video = context.video;
    if(video.sequence > command.globalPosition) {
        throw new CommandAlreadyProcessedError();
    }
    return context;
}