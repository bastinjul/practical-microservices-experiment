import {VideoActions, VideoHandlers, VideoPage} from "../../types/common-types";
import express, {Request, Response} from "express";
import {VideoTutorialEvent, VideoTutorialEventMetadata} from "../../types/event-types";
import {v4 as uuid} from "uuid";
import {MessageStore} from "../../message-store";
import {QueryResult} from "pg";

export interface RecordViewingsActions extends VideoActions {
    recordViewing: (traceId: string, videoId: number, userId: string) => Promise<QueryResult>;
}

export interface RecordViewingHandlers extends VideoHandlers {
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
            .recordViewing(res.locals.context.traceId as string, parseInt(req.params['videoId']), "") //TODO add user id
            .then(() => res.redirect('/'));
    }
    return {
        handleRecordViewing
    } as RecordViewingHandlers;
}

export function createRecordViewings({messageStore}: {messageStore: any}): VideoPage {
    const actions = createActions({messageStore});
    const handlers = createHandlers({actions});
    const router = express.Router();
    router.route('/:videoId').post(handlers.handleRecordViewing);
    return {actions, handlers, router};
}