import {Knex} from "knex";
import {MessageStore} from "../../message-store/message-store-types";
import {
    AuthenticateActions,
    AuthenticateApp,
    AuthenticateContext,
    AuthenticateHandlers,
    AuthenticateQueries
} from "./authenticate-types";
import {Router, Request, Response, NextFunction} from "express";
import bodyParser from "body-parser";
import {AuthenticationError} from "../../errors/AuthenticationError";
import {NotFoundError} from "../../errors/NotFoundError";
import {CredentialsMismatchError} from "../../errors/CredentialsMismatchError";
import Bluebird from "bluebird";
import {loadUserCredentials} from "./load-user-credentials";
import {UserCredentials} from "../../types/aggregator-types";
import camelCaseKeys from "../../camelcase/camelcase-keys"
import {ensureUserCredentialFound} from "./ensure-user-credential-found";
import {validatePassword} from "./validate-password";
import {writeLoggedInEvent} from "./write-logged-in-event";
import {handleCredentialNotFound} from "./handle-credential-not-found";
import {handleCredentialMismatch} from "./handle-credential-mismatch";

function createQueries({db}: {db: Promise<Knex>}): AuthenticateQueries {
    function byEmail(email: string): Promise<UserCredentials> {
        return db
            .then(client =>
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

function createActions({queries, messageStore}: {queries: AuthenticateQueries, messageStore: MessageStore}): AuthenticateActions {
    function authenticate(traceId: string, email: string, password: string): Promise<AuthenticateContext> {
        const context: AuthenticateContext = {
            traceId,
            email,
            password,
            messageStore,
            queries
        } as AuthenticateContext;
        return Bluebird.resolve(context)
            .then(loadUserCredentials)
            .then(ensureUserCredentialFound)
            .then(validatePassword)
            .then(writeLoggedInEvent)
            .catch(NotFoundError, (err: NotFoundError) => handleCredentialNotFound(context))
            .catch(CredentialsMismatchError, (err: CredentialsMismatchError) => handleCredentialMismatch(context));
    }
    return {
        authenticate
    }
}

function createHandlers({actions}: {actions: AuthenticateActions}): AuthenticateHandlers {
    function handleShowLoginForm(req: Request, res: Response): void {
        res.render("authenticate/templates/login-form");
    }
    function handleLogOut(req: Request, res: Response): void {
        req.session = null;
        res.redirect("/");
    }
    function handleAuthenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {email, password} = req.body;
        const traceId = res.locals.traceId;
        return actions
            .authenticate(traceId, email, password)
            .then(context => {
                if(req.session) {
                    req.session.userId = context.userCredentials ? context.userCredentials.id : undefined
                    res.redirect('/')
                }
            })
            .catch((err: AuthenticationError) => res.status(401).render('authenticate/templates/login-form', {errors: true}))
            .catch(next);
    }

    return {
        handleAuthenticate, handleLogOut, handleShowLoginForm
    };
}

export function createAuthenticateApp({db, messageStore}: {db: Promise<Knex>, messageStore: MessageStore}): AuthenticateApp {
    const queries = createQueries({db});
    const actions = createActions({queries, messageStore});
    const handlers = createHandlers({actions});
    const router = Router();
    router
        .route('/log-in')
        .get(handlers.handleShowLoginForm)
        .post(
            bodyParser.urlencoded({ extended: false }),
            handlers.handleAuthenticate
        );
    router.route('/log-out').get(handlers.handleLogOut);
    return {
        actions,
        queries,
        handlers,
        router
    }
}