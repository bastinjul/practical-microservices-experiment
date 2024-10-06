import {App, AppActions, AppHandlers, AppQueries} from "../../types/common-types";
import {NextFunction, Request, Response} from "express";
import {MessageStore} from "../../message-store/message-store-types";
import {UserCredentials} from "../../types/aggregator-types";

export interface AuthenticateApp extends App {
    queries: AuthenticateQueries;
    actions: AuthenticateActions;
    handlers: AuthenticateHandlers;
}

export interface AuthenticateActions extends AppActions {
    authenticate: (traceId: string, email: string, password: string) => Promise<AuthenticateContext>;
}

export interface AuthenticateQueries extends AppQueries {
    byEmail: (email: string) => Promise<UserCredentials>;
}

export interface AuthenticateHandlers extends AppHandlers {
    handleShowLoginForm: (req: Request, res: Response) => void;
    handleAuthenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    handleLogOut: (req: Request, res: Response) => void;
}

export interface AuthenticateContext {
    traceId: string;
    email: string;
    password: string;
    messageStore: MessageStore;
    queries: AuthenticateQueries;
    userCredentials: UserCredentials;
}