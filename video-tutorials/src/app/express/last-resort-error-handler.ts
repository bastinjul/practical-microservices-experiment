import {Request, Response, NextFunction} from "express";

export default function lastResortErrorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
    const traceId = res.locals.context ? res.locals.context.traceId : "none";
    console.error(traceId, err);
    res.status(500).send('error');
}