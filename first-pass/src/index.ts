import createExpressApp from "./app/express";
import createConfig from "./config";
import {appEnv as env} from "./env";

export const config = createConfig(env);
export const app = createExpressApp({config, env});

export function start() {
    app.listen(env.port, signalAppStart);
}

function signalAppStart() {
    console.log(`${env.appName} started, cool`);
    console.table([['Port', env.port], ['Environment', env.env]]);
}