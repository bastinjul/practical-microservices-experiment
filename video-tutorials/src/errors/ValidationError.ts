export class ValidationError extends Error {
    errors: any;
    options: any;
    attributes: any;
    constraints: any;

    constructor(errors: any, options?: any, attributes?: any, constraints?: any) {
        super(`Validation error: ${JSON.stringify(errors)}`);

        this.errors = errors;
        this.options = options;
        this.attributes = attributes;
        this.constraints = constraints;
        this.name = 'ValidationError';

        // Capture la trace de l'erreur
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}