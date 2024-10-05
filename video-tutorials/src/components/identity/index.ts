import {CreateSubscriptionConfig, MessageStore} from "../../message-store/message-store-types";
import {AggregatorHandler} from "../../types/aggregator-types";
import {IdentityCommandHandlerContext, IdentityComponent} from "./identity-types";
import {AlreadyRegisteredError} from "../../app/errors/AlreadyRegisteredError";
import {loadIdentity} from "./load-identity";
import {ensureNotRegistered} from "./ensure-not-registered";
import {writeRegisteredEvent} from "./write-registered-event";

function createIdentityCommandHandlers({messageStore}: {messageStore: MessageStore}): AggregatorHandler {
    return {
        Register: command => {
            const context = {
                messageStore: messageStore,
                command,
                identityId: command.data.userId
            } as IdentityCommandHandlerContext;

            return Promise.resolve(context)
                .then(loadIdentity)
                .then(ensureNotRegistered)
                .then(writeRegisteredEvent)
                .catch((err: AlreadyRegisteredError) => {})
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
    function start(): void {
        identityCommandSubscription.start();
    }
    return {
        identityCommandHandlers,
        start
    }
}