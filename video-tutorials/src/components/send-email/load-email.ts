import {IsEmailSent, SendEmailHandlerContext} from "./send-email-types";
import {Projection} from "../../message-store/message-store-types";
import {Message} from "../../types/event-types";

const emailProjection: Projection<IsEmailSent> = {
    $init(): IsEmailSent {
        return {isSent: false}
    },
    Sent(email: IsEmailSent, sent: Message): IsEmailSent {
        email.isSent = true;
        return email;
    }
}

export function loadEmail(context: SendEmailHandlerContext): Promise<SendEmailHandlerContext> {
    const messageStore = context.messageStore;
    const sendCommand: Message = context.sendCommand;
    const streamName = `sendEmail-${sendCommand.data.emailId}`

    return messageStore
        .fetch(streamName, emailProjection)
        .then((email: IsEmailSent) => {
            context.email = email;
            return context;
        })
}