import {createKnexClient} from "./knex-client";
import {createHome} from "./app/home"
import {AppEnv} from "./env";
import Bluebird from "bluebird";
import {Knex} from "knex";
import {VideoPage} from "./video-commons";

export interface AppConfig {
    env: AppEnv;
    db: Bluebird<Knex>;
    homeApp: VideoPage;
}

export default function createConfig({ env }: {env: AppEnv}): AppConfig {
    const db: Bluebird<Knex> = createKnexClient({connectionString: env.databaseUrl})
    const homeApp: VideoPage = createHome({db})
    return {
        env,
        db,
        homeApp,
    }
}