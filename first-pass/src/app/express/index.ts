import express, {Express} from 'express';
import { join } from "path";
import mountMiddleware from "./mount-middleware";
import mountRoutes from "./mount-routes";
import {AppEnv} from "../../env";

interface AppConfig {
    config: any;
    env: AppEnv;
}


export default function createExpressApp({config, env}: AppConfig) : Express {
    const app: Express = express();
    app.set('views', join(__dirname, '..'));
    app.set('view engine', 'pug');

    mountMiddleware(app, env);
    mountRoutes(app, env)

    return app;
}