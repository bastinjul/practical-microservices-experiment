import {v4 as uuidv4} from "uuid";
import {Request, Response, NextFunction} from "express";

export default function primeRequestContext(req: Request, res: Response, next: NextFunction): void {
    res.locals.context = {
        traceId: uuidv4()
    }
    next();
}