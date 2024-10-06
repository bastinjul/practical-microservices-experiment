import {createTransport, SentMessageInfo, Transport} from "nodemailer";
import {SendError} from "../../errors/SendError";
import {JustSendIt} from "./send-email-types";
import Mail from "nodemailer/lib/mailer";

export function createSend({transport}: {transport: Transport}): JustSendIt {
    const sender = createTransport(transport);
    function send(email: Mail.Options): Promise<SentMessageInfo> {
        const potentialError = new SendError();
        return sender.sendMail(email)
            .catch((err: Error) => {
                potentialError.message = err.message;
                throw potentialError;
            })
    }
    return {
        send
    }
}