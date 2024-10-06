import {Router} from "express";

export interface AppHandlers {
}

export interface AppQueries {
}

export interface AppActions {
}

export interface App {
    handlers: AppHandlers;
    queries?: AppQueries;
    router: Router;
    actions?: AppActions;
}

export interface StartupI {
    start: () => void;
}

export interface Aggregator extends StartupI {
    queries: AppQueries;
    handlers: AppHandlers;
    init?: () => Promise<any>;
}

export interface Component extends StartupI {
}