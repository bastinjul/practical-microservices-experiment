import {AuthenticateContext} from "./authenticate-types";
import {NotFoundError} from "../errors/NotFoundError";

export function ensureUserCredentialFound(context: AuthenticateContext): AuthenticateContext {
    if(!context.userCredentials) {
        throw new NotFoundError('no record found with that email');
    }
    return context;
}