import {App, AppActions, AppHandlers, AppQueries} from "../../types/common-types";
import {NextFunction, Request, Response} from "express";

export interface CreatorsPortalApp extends App {
    handlers: CreatorsPortalHandlers
}

export interface CreatorsPortalActions extends AppActions {
    publishVideo: ({traceId, userId, videoId, sourceUri}:{traceId: string, userId: string, sourceUri: string, videoId: string}) => Promise<any>;
}

export interface CreatorsPortalHandlers extends AppHandlers {
    handlePublishVideo: (req: Request, res: Response, next: NextFunction) => Promise<any>;
    handleDashboard: (req: Request, res: Response, next: NextFunction) => void;
}

export interface CreatorsPortalQueries extends AppQueries {

}