import {AuthenticateContext} from "./authenticate-types";
import bcrypt from "bcrypt";
import {CredentialsMismatchError} from "../errors/CredentialsMismatchError";

export function validatePassword(context: AuthenticateContext): Promise<AuthenticateContext> {
    return bcrypt
        .compare(context.password, context.userCredentials.passwordHash)
        .then(matched => {
            if(!matched) {
                throw new CredentialsMismatchError();
            }
            return context;
        });
}