import {UserRegistrationChainContext} from "./index";
import validate from "validate.js";
import {ValidationError} from "../../errors/ValidationError";

const constraints = {
    email: {
        email: true,
        presence: true
    },
    password: {
        length: { minimum: 8},
        presence: true
    }
}

export function validation(context: UserRegistrationChainContext): UserRegistrationChainContext {
    const validationErrors = validate(context.attributes, constraints);
    if(validationErrors) {
        throw new ValidationError(validationErrors);
    }
    return context;
}