import {CreateSubscriptionConfig, MessageStore} from "../../message-store/message-store-types";
import {JustSendIt, SendEmailComponent, SendEmailHandlerContext} from "./send-email-types";
import {AggregatorHandler} from "../../types/aggregator-types";
import {createSend} from "./send";
import {Message} from "../../types/event-types";
import Bluebird from "bluebird";
import {AlreadySentError} from "../../errors/AlreadySentError";
import {SendError} from "../../errors/SendError";
import {loadEmail} from "./load-email";
import {ensureEmailHasNotBeenSent} from "./ensure-email-has-not-been-sent";
import {sendEmail} from "./send-email";
import {writeSentEvent} from "./write-sent-event";
import {writeFailedEvent} from "./write-failed-event";
import {Transport} from "nodemailer";

function createHandlers({messageStore, justSendIt, systemSenderEmailAddress}: {messageStore: MessageStore, justSendIt: JustSendIt, systemSenderEmailAddress: string}): AggregatorHandler {
    return {
        Send: (command: Message) => {
            const context: SendEmailHandlerContext = {
                messageStore,
                justSendIt,
                systemSenderEmailAddress,
                sendCommand: command
            } as SendEmailHandlerContext;
            return Bluebird.resolve(context)
                .then(loadEmail)
                .then(ensureEmailHasNotBeenSent)
                .then(sendEmail)
                .then(writeSentEvent)
                .catch(AlreadySentError, () => {})
                .catch(SendError, (err: SendError) => writeFailedEvent(context, err));
        }
    }
}

export function createSendEmailComponent(
    {messageStore, systemSenderEmailAddress, transport}: {messageStore: MessageStore, systemSenderEmailAddress: string, transport: Transport}
): SendEmailComponent {
    const justSendIt = createSend({transport});
    const handlers = createHandlers({messageStore, justSendIt, systemSenderEmailAddress});
    const subscription = messageStore.createSubscription({
        streamName: 'sendEmail:command',
        handlers,
        subscriberId: 'components:send-email'
    } as CreateSubscriptionConfig);

    function start() {
        subscription.start();
    }
    return {
        handlers,
        start
    }
}