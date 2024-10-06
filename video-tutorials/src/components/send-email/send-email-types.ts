import {Component} from "../../types/common-types";
import {AggregatorHandler} from "../../types/aggregator-types";
import {SentMessageInfo} from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import {MessageStore} from "../../message-store/message-store-types";
import {Message} from "../../types/event-types";

export interface SendEmailComponent extends Component {
    handlers: AggregatorHandler
}

export interface SendEmailData {
    emailId: string;
    to: string;
    subject: string;
    text: string;
    html: string;
}

export interface JustSendIt {
    send: (email: Mail.Options) => Promise<SentMessageInfo>;
}

export interface SendEmailHandlerContext {
    messageStore: MessageStore;
    justSendIt: JustSendIt;
    systemSenderEmailAddress: string;
    sendCommand: Message;
    email: IsEmailSent;
}

export interface IsEmailSent {
    isSent: boolean;
}