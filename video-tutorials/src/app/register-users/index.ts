import {VideoActions, VideoHandlers, VideoQueries} from "../../types/common-types";
import express, {NextFunction, Request, Response, Router} from "express";
import {v4 as uuid} from "uuid";
import {ValidationError} from "../errors/ValidationError";
import {validation} from "./validate";
import {loadExistingIdentity} from "./load-existing-identity";
import {Knex} from "knex";
import camelCaseKeys from "../../camelcase/camelcase-keys"
import {UserCredentials} from "../../types/aggregator-types";
import {ensureThereWasNoExistingIdentity} from "./ensure-there-was-no-existing-identity";
import {hashPassword} from "./hash-password";
import {MessageStore} from "../../message-store";
import {writeRegisterCommand} from "./write-register-command";
import bodyParser from "body-parser";

export interface RegisterUserApp {
    actions: RegisterUsersActions;
    handlers: RegisterUsersHandlers;
    queries: RegisterUsersQueries;
    router: Router;
}

export interface RegisterUsersActions extends VideoActions {
    registerUser: (traceId: string, attributes: UserRegistrationAttributes) => Promise<void>;
}

export interface RegisterUsersHandlers extends VideoHandlers {
    handleRegistrationForm: (req: Request, res: Response) => void;
    handleRegistrationComplete: (req: Request, res: Response) => void;
    handleRegisterUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export interface RegisterUsersQueries extends VideoQueries {
    byEmail: (email: string) => Promise<UserCredentials>;
}

export interface UserRegistrationAttributes {
    id: string;
    email: string;
    password: string;
}

export interface UserRegistrationChainContext {
    attributes: UserRegistrationAttributes;
    traceId: string;
    messageStore: MessageStore;
    queries: RegisterUsersQueries;
    existingIdentity?: UserCredentials;
    passwordHash?: string;
}

function createHandlers({actions}: {actions: RegisterUsersActions}): RegisterUsersHandlers {
    function handleRegistrationForm(req: Request, res: Response): void {
        const userId = uuid();
        res.render('register-users/templates/register', {userId});
    }
    function handleRegistrationComplete(req: Request, res: Response): void {
        res.render('register-users/templates/registration-complete');
    }
    function handleRegisterUser(req: Request, res: Response, next: NextFunction) {
        const attributes = {
            id: req.body.id,
            email: req.body.email,
            password: req.body.password
        } as UserRegistrationAttributes;
        return actions
            .registerUser(res.locals.traceId, attributes)
            .then(() => res.redirect(301, 'register/registration-complete'))
            .catch((err: ValidationError) =>
                res
                    .status(400)
                    .render(
                        'register-users/templates/register',
                        { userId: attributes.id, errors: err.errors}
                    )
            )
            .catch(next)
    }
    return {
        handleRegistrationForm,
        handleRegistrationComplete,
        handleRegisterUser
    }
}

export function createActions({messageStore, queries}: {messageStore: MessageStore, queries: RegisterUsersQueries}): RegisterUsersActions {
    function registerUser(traceId: string, attributes: UserRegistrationAttributes): Promise<void> {
        const context: UserRegistrationChainContext = {attributes, traceId, messageStore, queries};
        return Promise.resolve(context)
            .then(validation)
            .then(loadExistingIdentity)
            .then(ensureThereWasNoExistingIdentity)
            .then(hashPassword)
            .then(writeRegisterCommand)
    }
    return {
        registerUser
    }
}

export function createQueries({db}: {db: Promise<Knex>}): RegisterUsersQueries {
    function byEmail (email: string): Promise<UserCredentials> {
        return db.then(client =>
            client('user_credentials')
                .where({email})
                .limit(1)
        )
            .then(camelCaseKeys)
            .then(rows => rows[0] as UserCredentials)
    }
    return {
        byEmail
    }
}

export function createUserRegistration({db, messageStore}: {db: Promise<Knex>, messageStore: MessageStore}): RegisterUserApp {
    const queries = createQueries({db});
    const actions = createActions({messageStore, queries});
    const handlers = createHandlers({actions});
    const router = express.Router();
    router
        .route('/')
        .get(handlers.handleRegistrationForm)
        .post(bodyParser.urlencoded({ extended: false }), handlers.handleRegisterUser)
    router.route('/registration-complete')
        .get(handlers.handleRegistrationComplete)
    return {actions, handlers, queries, router};
}