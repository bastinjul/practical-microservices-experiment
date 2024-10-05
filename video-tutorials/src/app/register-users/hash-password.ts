import {UserRegistrationChainContext} from "./index";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
export function hashPassword(context: UserRegistrationChainContext): Promise<UserRegistrationChainContext> {
    return bcrypt
        .hash(context.attributes.password, SALT_ROUNDS)
        .then(passwordHash => {
            context.passwordHash = passwordHash;
            return context;
        });
}