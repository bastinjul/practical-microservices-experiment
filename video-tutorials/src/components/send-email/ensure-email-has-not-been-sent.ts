import {SendEmailHandlerContext} from "./send-email-types";
import {AlreadySentError} from "../../app/errors/AlreadySentError";

export function ensureEmailHasNotBeenSent(context: SendEmailHandlerContext): SendEmailHandlerContext {
    if(context.email.isSent) {
        throw new AlreadySentError()
    }
    return context;
}