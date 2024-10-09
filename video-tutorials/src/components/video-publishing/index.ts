import {CreateSubscriptionConfig, MessageStore} from "../../message-store/message-store-types";
import {VideoPublishingComponent, VideoPublishingComponentContext} from "./types";
import {AggregatorHandler} from "../../types/aggregator-types";
import {Message} from "../../types/event-types";
import Bluebird from "bluebird";
import {AlreadyPublishedError} from "../../errors/AlreadyPublishedError";
import {loadVideo} from "./load-video";
import {ensureVideoPublishingNotAttempted} from "./ensure-video-publishing-not-attempted";
import {transcodeVideo} from "./transcode-video";
import {writeVideoPublishedEvent} from "./write-video-published-event";
import {writeVideoPublishedFailedEvent} from "./write-video-published-failed-event";
import {ValidationError} from "../../errors/ValidationError";
import {CommandAlreadyProcessedError} from "../../errors/CommandAlreadyProcessedError";
import {ensureCommandHasNotBeenProcessed} from "./ensure-command-has-not-been-processed";
import {ensureNameIsValid} from "./ensure-name-is-valid";
import {writeVideoNamedEvent} from "./write-video-named-event";
import {writeVideoNameRejectedEvent} from "./write-video-name-rejected-event";

function createHandlers({messageStore}: {messageStore: MessageStore}): AggregatorHandler {
    return {
        PublishVideo: (message: Message) => {
            const context: VideoPublishingComponentContext = {
                messageStore,
                command: message
            } as VideoPublishingComponentContext;
            return Bluebird.resolve(context)
                .then(loadVideo)
                .then(ensureVideoPublishingNotAttempted)
                .then(transcodeVideo)
                .then(writeVideoPublishedEvent)
                .catch(AlreadyPublishedError, () => {})
                .catch((err: Error) => writeVideoPublishedFailedEvent(err, context));
        },
        NameVideo: (message: Message) => {
            const context: VideoPublishingComponentContext = {
                messageStore,
                command: message
            } as VideoPublishingComponentContext;
            return Bluebird.resolve(context)
                .then(loadVideo)
                .then(ensureCommandHasNotBeenProcessed)
                .then(ensureNameIsValid)
                .then(writeVideoNamedEvent)
                .catch(CommandAlreadyProcessedError, () => {})
                .catch(ValidationError, err => writeVideoNameRejectedEvent(context, err.message))
        }
    }
}

export function createVideoPublishingComponent({messageStore}: {messageStore: MessageStore}): VideoPublishingComponent {
    const handlers = createHandlers({messageStore});
    const subscription = messageStore.createSubscription({
        streamName: 'videoPublishing:command',
        handlers,
        subscriberId: 'components:video-publishing'
    } as CreateSubscriptionConfig);
    function start() {
        subscription.start();
    }
    return {
        handlers,
        start
    }
}