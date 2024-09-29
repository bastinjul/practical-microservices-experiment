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