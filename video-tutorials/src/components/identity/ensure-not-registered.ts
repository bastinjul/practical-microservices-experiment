import {IdentityCommandHandlerContext} from "./identity-types";
import {AlreadyRegisteredError} from "../../app/errors/AlreadyRegisteredError";

export function ensureNotRegistered(context: IdentityCommandHandlerContext): IdentityCommandHandlerContext {
    if(context.identity.isRegistered) {
        throw new AlreadyRegisteredError();
    }
    return context;
}