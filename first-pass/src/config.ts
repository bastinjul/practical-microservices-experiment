import {createKnexClient} from "./knex-client";
import {createHome} from "./app/home"
import {AppEnv} from "./env";
import Bluebird from "bluebird";
import {Knex} from "knex";
import {VideoPage} from "./commons";
import {createRecordViewings} from "./app/record-viewings";

export interface AppConfig {
    env: AppEnv;
    db: Bluebird<Knex>;
    homeApp: VideoPage;
    recordViewingApp: VideoPage;
}

export default function createConfig({ env }: {env: AppEnv}): AppConfig {
    const db: Bluebird<Knex> = createKnexClient({connectionString: env.databaseUrl})
    const homeApp: VideoPage = createHome({db});
    const recordViewingApp = createRecordViewings({});
    return {
        env,
        db,
        homeApp,
        recordViewingApp
    }
}