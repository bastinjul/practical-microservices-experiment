import {MessageStore} from "../../message-store/message-store-types";
import {
    CreatorsPortalActions,
    CreatorsPortalApp,
    CreatorsPortalHandlers,
    CreatorsPortalQueries
} from "./creators-portal-types";
import {Knex} from "knex";
import {NextFunction, Router, Request, Response} from "express";
import {UserIdEventMetadata, VideoTutorialEvent} from "../../types/event-types";
import {v4 as uuid} from "uuid";
import bodyParser from "body-parser";

function createActions({messageStore}: {messageStore: MessageStore}): CreatorsPortalActions {
    function publishVideo({traceId, userId, videoId, sourceUri}:{traceId: string, userId: string, sourceUri: string, videoId: string}): Promise<any> {
        const streamName = `videoPublishing:command-${videoId}`;
        const command : VideoTutorialEvent<UserIdEventMetadata> = {
            id: uuid(),
            type: 'PublishVideo',
            metadata: {
                traceId,
                userId
            },
            data: {
                ownerId: userId,
                sourceUri,
                videoId
            }
        }
        return messageStore.write(streamName, command);
    }
    return {
        publishVideo
    }
}

function createQueries({db}: {db: Promise<Knex>}): CreatorsPortalQueries {
    return {};
}

function createHandlers({actions}: {actions: CreatorsPortalActions}): CreatorsPortalHandlers {
    function handlePublishVideo(req: Request, res: Response, next: NextFunction): Promise<any> {
        return actions
            .publishVideo({
                traceId: res.locals.context.traceId,
                userId: res.locals.context.userId,
                videoId: req.body.videoId,
                sourceUri: req.body.url
            })
            .then(() => res.json('"ok"'))
            .catch(next);
    }

    function handleDashboard(req: Request, res: Response, next: NextFunction): void {
        const newVideoId = uuid();
        const videos: any[] = [];
        res.render('creators-portal/templates/dashboard', {newVideoId, videos});
    }

    return {
        handlePublishVideo,
        handleDashboard
    }
}

export function createCreatorsPortalApp({db, messageStore}: {db: Promise<Knex>, messageStore: MessageStore}): CreatorsPortalApp {
    // const queries = createQueries({db});
    const actions = createActions({messageStore});
    const handlers = createHandlers({actions});
    const router = Router();
    router.route('/publish-video').post(bodyParser.json(), handlers.handlePublishVideo)
    router.route('/').get(handlers.handleDashboard)
    return {
        handlers,
        router
    }
}