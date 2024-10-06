import {IdentityHandlerContext} from "./identity-types";
import {AlreadySentRegistrationEmailError} from "../../errors/AlreadySentRegistrationEmailError";

export function ensureRegistrationEmailNotSent(context: IdentityHandlerContext): IdentityHandlerContext {
    if(context.identity.registrationEmailSent) {
        throw new AlreadySentRegistrationEmailError();
    }
    return context;
}