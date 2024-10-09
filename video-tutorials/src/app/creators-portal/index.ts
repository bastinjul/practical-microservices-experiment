import {MessageStore} from "../../message-store/message-store-types";
import {
    CreatorsPortalActions,
    CreatorsPortalApp,
    CreatorsPortalHandlers,
    CreatorsPortalQueries, CreatorsPortalView
} from "./creators-portal-types";
import {Knex} from "knex";
import {NextFunction, Router, Request, Response} from "express";
import {UserIdEventMetadata, VideoTutorialEvent} from "../../types/event-types";
import {v4 as uuid} from "uuid";
import bodyParser from "body-parser";
import camelCaseKeys from "../../camelcase/camelcase-keys"

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
    function videoByIdAndOwnerId(id: string, ownerId: string): Promise<CreatorsPortalView> {
        const queryParams = {
            id,
            owner_id: ownerId,
        }
        return db.then(client =>
            client('creators_portal_videos')
                .where(queryParams)
                .limit(1))
            .then(camelCaseKeys)
            .then(rows => rows[0] as CreatorsPortalView)
    }

    function videosByOwnerId(ownerId: string): Promise<CreatorsPortalView[]> {
        return db.then(client =>
            client('creators_portal_videos')
                .where({owner_id: ownerId}))
            .then(camelCaseKeys);
    }
    return {
        videoByIdAndOwnerId,
        videosByOwnerId
    };
}

function createHandlers({actions, queries}: {actions: CreatorsPortalActions, queries: CreatorsPortalQueries}): CreatorsPortalHandlers {
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

    function handleDashboard(req: Request, res: Response, next: NextFunction): Promise<any> {
        return queries
            .videosByOwnerId(res.locals.context.userId)
            .then(videos => {
                const newVideoId = uuid();
                const renderContext = {newVideoId, videos};
                res.render('creators-portal/templates/dashboard', renderContext);
            })
            .catch(next);
    }

    function handleShowVideo(req: Request, res: Response, next: NextFunction): Promise<any> {
        const videoId = req.params.id;
        const ownerId = res.locals.context.userId;
        return queries
            .videoByIdAndOwnerId(videoId, ownerId)
            .then(video => {
                const template = video
                    ? 'creators-portal/templates/video'
                    : 'common-templates/404'
                return res.render(template, {video});
            });
    }

    return {
        handlePublishVideo,
        handleDashboard,
        handleShowVideo
    }
}

export function createCreatorsPortalApp({db, messageStore}: {db: Promise<Knex>, messageStore: MessageStore}): CreatorsPortalApp {
    const queries = createQueries({db});
    const actions = createActions({messageStore});
    const handlers = createHandlers({actions, queries});
    const router = Router();
    router.route('/publish-video').post(bodyParser.json(), handlers.handlePublishVideo)
    router.route('/videos/:id').get(handlers.handleShowVideo)
    router.route('/').get(handlers.handleDashboard)
    return {
        handlers,
        router
    }
}