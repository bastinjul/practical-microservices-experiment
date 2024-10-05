import {UserRegistrationChainContext} from "./index";
import {UserCredentials} from "../../types/aggregator-types";

export function loadExistingIdentity(context: UserRegistrationChainContext): Promise<UserRegistrationChainContext> {
    return context.queries
        .byEmail(context.attributes.email)
        .then((existingIdentity: UserCredentials) => {
            context.existingIdentity = existingIdentity;
            return context;
        });
}