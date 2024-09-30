export class VersionConflictError extends Error {
    constructor(stream: string, expected: number, actual: number) {
        const message = `VersionConflict: stream ${stream} expected version ${expected} but was at version ${actual}`;
        super(message);

        // Capture la trace de la pile en excluant ce constructeur
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        this.name = 'VersionConflictError';
    }
}
