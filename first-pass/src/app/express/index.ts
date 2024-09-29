import express, {Express} from 'express';
import { join } from "path";
import mountMiddleware from "./mount-middleware";
import mountRoutes from "./mount-routes";
import {AppEnv} from "../../env";
import {AppConfig} from "../../config";

interface ExpressAppInput {
    config: AppConfig;
    env: AppEnv;
}


export default function createExpressApp({config, env}: ExpressAppInput) : Express {
    const app: Express = express();
    app.set('views', join(__dirname, '..'));
    app.set('view engine', 'pug');

    mountMiddleware(app, env);
    mountRoutes(app, config)

    return app;
}