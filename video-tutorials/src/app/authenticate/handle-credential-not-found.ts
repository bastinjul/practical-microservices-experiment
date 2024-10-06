import {AuthenticateContext} from "./authenticate-types";
import {AuthenticationError} from "../../errors/AuthenticationError";

export function handleCredentialNotFound(context: AuthenticateContext) {
    throw new AuthenticationError();
}