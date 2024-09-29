import express, {Express} from "express";
import {join} from "path";
import lastResortErrorHandler from "./last-resort-error-handler";
import primeRequestContext from "./prime-request-context";

export default function mountMiddleware(app: Express, env: any) {
    app.use(lastResortErrorHandler);
    app.use(primeRequestContext);
    app.use(
        express.static(join(__dirname, '..', 'public'), {maxAge: 86400000})
    )
}


