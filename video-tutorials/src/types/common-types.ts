import {Router} from "express";

export interface VideoHandlers {
}

export interface VideoQueries {
}

export interface VideoActions {
}

export interface VideoPage {
    handlers: VideoHandlers;
    queries?: VideoQueries;
    router: Router;
    actions?: VideoActions;
}

export interface StartupI {
    start: () => void;
}

export interface Aggregator extends StartupI {
    queries: VideoQueries;
    handlers: VideoHandlers;
    init: () => Promise<any>;
}

export interface Component extends StartupI {
}