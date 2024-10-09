import {App, AppActions, AppHandlers, AppQueries} from "../../types/common-types";
import {NextFunction, Request, Response} from "express";

export interface CreatorsPortalApp extends App {
    handlers: CreatorsPortalHandlers
}

export interface CreatorsPortalActions extends AppActions {
    publishVideo: ({traceId, userId, videoId, sourceUri}:{traceId: string, userId: string, sourceUri: string, videoId: string}) => Promise<any>;
    nameVideo: ({traceId, userId, name, videoId}: {traceId: string, userId: string, name: string, videoId: string}) => Promise<any>;
}

export interface CreatorsPortalHandlers extends AppHandlers {
    handlePublishVideo: (req: Request, res: Response, next: NextFunction) => Promise<any>;
    handleDashboard: (req: Request, res: Response, next: NextFunction) => Promise<any>;
    handleShowVideo: (req: Request, res: Response, next: NextFunction) => Promise<any>;
    handleNameVideo: (req: Request, res: Response, next: NextFunction) => void;
    handleShowVideoOperation: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}

export interface CreatorsPortalQueries extends AppQueries {
    videoByIdAndOwnerId: (id: string, ownerId: string) => Promise<CreatorsPortalView>;
    videosByOwnerId: (ownerId: string) => Promise<CreatorsPortalView[]>;
    videoOperationByTraceId: (traceId: string) => Promise<VideoOperationView>;
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

export interface VideoOperationView {
    traceId: string;
    videoId: string;
    succeeded: boolean;
    failureReason: string;
}