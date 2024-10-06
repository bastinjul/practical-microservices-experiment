import {UserRegistrationChainContext} from "./index";
import {ValidationError} from "../../errors/ValidationError";

export function ensureThereWasNoExistingIdentity(context: UserRegistrationChainContext): UserRegistrationChainContext {
    if(context.existingIdentity) {
        throw new ValidationError({email: ['already taken']});
    }
    return context;
}