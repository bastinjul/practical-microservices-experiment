import {IdentityHandlerContext} from "./identity-types";
import {AlreadyRegisteredError} from "../../errors/AlreadyRegisteredError";

export function ensureNotRegistered(context: IdentityHandlerContext): IdentityHandlerContext {
    if(context.identity.isRegistered) {
        throw new AlreadyRegisteredError();
    }
    return context;
}