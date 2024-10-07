import {AppActions, AppHandlers, App} from "../../types/common-types";
import express, {Request, Response} from "express";
import {VideoTutorialEvent, VideoTutorialEventMetadata} from "../../types/event-types";
import {v4 as uuid} from "uuid";
import {MessageStore} from "../../message-store/message-store-types";
import {QueryResult} from "pg";

export interface RecordViewingsActions extends AppActions {
    recordViewing: (traceId: string, videoId: number, userId: string) => Promise<QueryResult>;
}

export interface RecordViewingHandlers extends AppHandlers {
    handleRecordViewing: () => any;
}

export interface VideoViewedMetaData extends VideoTutorialEventMetadata {
    userId: string;
}

function createActions({messageStore}: {messageStore: MessageStore}): RecordViewingsActions {
    function recordViewing(traceId: string, videoId: number, userId: string): Promise<QueryResult> {
        const viewedEvent: VideoTutorialEvent<VideoViewedMetaData> = {
            id: uuid(),
            type: 'VideoViewed',
            metadata: {
                traceId,
                userId
            },
            data: {
                userId,
                videoId
            }
        }
        const streamName = `viewing-${videoId}`
        return messageStore.write(streamName, viewedEvent);
    }
    return {
        recordViewing
    };
}

function createHandlers({actions}: {actions: RecordViewingsActions}): RecordViewingHandlers {
    function handleRecordViewing(req: Request, res: Response): any {
        return actions
            .recordViewing(res.locals.context.traceId as string, parseInt(req.params['videoId']), res.locals.context.userId)
            .then(() => res.redirect('/'));
    }
    return {
        handleRecordViewing
    } as RecordViewingHandlers;
}

export function createRecordViewingsApp({messageStore}: {messageStore: MessageStore}): App {
    const actions = createActions({messageStore});
    const handlers = createHandlers({actions});
    const router = express.Router();
    router.route('/:videoId').post(handlers.handleRecordViewing);
    return {actions, handlers, router};
}