import {CreateSubscriptionConfig, MessageStore} from "../../message-store/message-store-types";
import {AggregatorHandler} from "../../types/aggregator-types";
import {IdentityHandlerContext, IdentityComponent} from "./identity-types";
import {AlreadyRegisteredError} from "../../errors/AlreadyRegisteredError";
import {loadIdentity} from "./load-identity";
import {ensureNotRegistered} from "./ensure-not-registered";
import {writeRegisteredEvent} from "./write-registered-event";
import {Message, OriginStreamEventMetadata} from "../../types/event-types";
import Bluebird from "bluebird";
import {AlreadySentRegistrationEmailError} from "../../errors/AlreadySentRegistrationEmailError";
import {ensureRegistrationEmailNotSent} from "./ensure-registration-email-not-sent";
import {writeSendCommand} from "./write-send-command";
import {writeRegistrationEmailSentEvent} from "./write-registration-email-sent-event";
import {renderRegistrationEmail} from "./render-registration-email";

function streamNameToId (streamName: string): string {
    return streamName.split(/-(.+)/)[1]
}

function createIdentityCommandHandlers({messageStore}: {messageStore: MessageStore}): AggregatorHandler {
    return {
        Register: command => {
            const context = {
                messageStore: messageStore,
                message: command,
                identityId: command.data.userId
            } as IdentityHandlerContext;

            return Promise.resolve(context)
                .then(loadIdentity)
                .then(ensureNotRegistered)
                .then(writeRegisteredEvent)
                .catch((err: AlreadyRegisteredError) => {})
        }
    }
}

function createSendEmailEventHandlers({messageStore}: {messageStore: MessageStore}): AggregatorHandler {
    return {
        Sent: (event: Message) => {
            const metadata = event.metadata as OriginStreamEventMetadata;
            const originStreamName = metadata.originStreamName;
            const identityId = streamNameToId(originStreamName);
            const context = {
                messageStore,
                message: event,
                identityId,
            } as IdentityHandlerContext;
            return Bluebird.resolve(context)
                .then(loadIdentity)
                .then(ensureRegistrationEmailNotSent)
                .then(writeRegistrationEmailSentEvent)
                .catch(AlreadySentRegistrationEmailError, () => {});
        }
    }
}

function createIdentityEventHandlers({messageStore}: {messageStore: MessageStore}): AggregatorHandler {
    return {
        Registered: (event: Message) => {
            const context = {
                messageStore,
                message: event,
                identityId: event.data.userId
            } as IdentityHandlerContext;
            return Bluebird.resolve(context)
                .then(loadIdentity)
                .then(ensureRegistrationEmailNotSent)
                .then(renderRegistrationEmail)
                .then(writeSendCommand)
                .catch(AlreadySentRegistrationEmailError, () => {})
        }
    }
}

export function createIdentityComponent({messageStore}: {messageStore: MessageStore}): IdentityComponent {
    const identityCommandHandlers = createIdentityCommandHandlers({messageStore});
    const identityCommandSubscription = messageStore.createSubscription({
        streamName: 'identity:command',
        handlers: identityCommandHandlers,
        subscriberId: 'components:identity:command'
    } as CreateSubscriptionConfig);
    const identityEventHandlers = createIdentityEventHandlers({messageStore});
    const identityEventSubscription = messageStore.createSubscription({
        streamName: 'identity',
        handlers: identityEventHandlers,
        subscriberId: 'components:identity'
    } as CreateSubscriptionConfig);
    const sendEmailEventHandlers = createSendEmailEventHandlers({messageStore});
    const sendEmailSubscription = messageStore.createSubscription({
        streamName: 'sendEmail',
        handlers: sendEmailEventHandlers,
        originStreamName: 'identity',
        subscriberId: 'components:identity:sendEmailEvents'
    } as CreateSubscriptionConfig)
    function start(): void {
        identityCommandSubscription.start();
        identityEventSubscription.start();
        sendEmailSubscription.start();
    }
    return {
        identityCommandHandlers,
        identityEventHandlers,
        sendEmailEventHandlers,
        start
    }
}