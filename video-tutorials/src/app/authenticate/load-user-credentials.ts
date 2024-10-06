import {AuthenticateContext} from "./authenticate-types";
import {UserCredentials} from "../../types/aggregator-types";

export function loadUserCredentials(context: AuthenticateContext): Promise<AuthenticateContext> {
    return context.queries
        .byEmail(context.email)
        .then((userCredentials: UserCredentials) => {
            context.userCredentials = userCredentials;
            return context;
        });
}