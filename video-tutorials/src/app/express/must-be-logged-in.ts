import {NextFunction, Request, Response} from "express";

export function mustBeLoggedIn(req: Request, res: Response, next: NextFunction) {
    if(!res.locals.context.userId) {
        return res.redirect('/auth/log-in');
    }
    return next();
}