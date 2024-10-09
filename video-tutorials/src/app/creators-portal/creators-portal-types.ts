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
    handleDashboard: (req: Request, res: Response, next: NextFunction) => Promise<any>;
    handleShowVideo: (req: Request, res: Response, next: NextFunction) => Promise<any>
}

export interface CreatorsPortalQueries extends AppQueries {
    videoByIdAndOwnerId: (id: string, ownerId: string) => Promise<CreatorsPortalView>;
    videosByOwnerId: (ownerId: string) => Promise<CreatorsPortalView[]>;
}

export interface CreatorsPortalView {
    id: string;
    ownerId: string;
    name: string;
    description: string;
    views: string;
    sourceUri: string;
    transcodedUri: string;
    position: string;
}