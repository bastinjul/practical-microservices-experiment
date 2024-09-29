import {VideoActions, VideoHandlers, VideoPage} from "../../commons";
import express, {Request, Response} from "express";

export interface RecordViewingsActions extends VideoActions {
    recordViewing: (traceId: string, videoId: number) => Promise<boolean>;
}

export interface RecordViewingHandlers extends VideoHandlers {
    handleRecordViewing: () => any;
}

function createActions(_empty = {}): RecordViewingsActions {
    function recordViewing(traceId: string, videoId: number): Promise<boolean> {
        // implementation not possible at this stage of the book (chapter 1)
        // open discussion on how to implement that in the last section of this chapter.
        console.log(`traceId: ${traceId}, videoId: ${videoId}`);
        return Promise.resolve(true);
    }
    return {
        recordViewing
    };
}

function createHandlers({actions}: {actions: RecordViewingsActions}): RecordViewingHandlers {
    function handleRecordViewing(req: Request, res: Response): any {
        return actions
            .recordViewing(res.locals.context.traceId as string, parseInt(req.params['videoId']))
            .then(() => res.redirect('/'));
    }
    return {
        handleRecordViewing
    } as RecordViewingHandlers;
}

export function createRecordViewings(_empty = {}): VideoPage {
    const actions = createActions({});
    const handlers = createHandlers({actions});
    const router = express.Router();
    router.route('/:videoId').post(handlers.handleRecordViewing);
    return {actions, handlers, router};
}