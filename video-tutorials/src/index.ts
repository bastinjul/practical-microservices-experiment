import createExpressApp from "./app/express";
import createConfig from "./config/config";
import {appEnv as env} from "./config/env";

export const config = createConfig({env});
export const app = createExpressApp({config, env});

export function start() {
    config.aggregators.forEach(a => a.start());
    config.components.forEach(a => a.start());
    app.listen(env.port, signalAppStart);
}

function signalAppStart() {
    console.log(`${env.appName} started`);
    console.table([['Port', env.port], ['Environment', env.env]]);
}