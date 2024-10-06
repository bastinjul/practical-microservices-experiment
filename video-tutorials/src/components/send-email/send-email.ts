import {SendEmailHandlerContext} from "./send-email-types";
import Mail from "nodemailer/lib/mailer";

export function sendEmail(context: SendEmailHandlerContext): Promise<SendEmailHandlerContext> {
    const justSendIt = context.justSendIt;
    const sendCommand = context.sendCommand;
    const systemSenderEmailAddress = context.systemSenderEmailAddress;

    const email: Mail.Options = {
        from: systemSenderEmailAddress,
        to: sendCommand.data.to,
        subject: sendCommand.data.subject,
        text: sendCommand.data.subject,
        html: sendCommand.data.html,
    }
    return justSendIt.send(email)
        .then(() => context);
}