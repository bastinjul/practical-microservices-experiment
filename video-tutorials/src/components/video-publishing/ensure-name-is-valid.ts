import {VideoPublishingComponentContext} from "./types";
import {ValidationError} from "../../errors/ValidationError";
import validate from 'validate.js';

const constraints = {
    name: {
        presence: {allowEmpty: false}
    }
}

export function ensureNameIsValid(context: VideoPublishingComponentContext): VideoPublishingComponentContext {
    const command = context.command;
    const validateMe = {name: command.data.name};
    const validationErrors = validate(validateMe, constraints);
    if(validationErrors) {
        throw new ValidationError(validationErrors, constraints, context.video);
    }
    return context;
}