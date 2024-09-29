import {createKnexClient} from "./knex-client";
import {createPostgresClient} from "./postgres-client";
import {createMessageStore} from "./message-store";
import {createHome} from "../app/home"
import {AppEnv} from "./env";
import Bluebird from "bluebird";
import {Knex} from "knex";
import {VideoPage} from "../app/types/common-types";
import {createRecordViewings} from "../app/record-viewings";

export interface AppConfig {
    env: AppEnv;
    db: Bluebird<Knex>;
    homeApp: VideoPage;
    recordViewingApp: VideoPage;
    messageStore: any; //TODO
}

export default function createConfig({ env }: {env: AppEnv}): AppConfig {
    const knexClient: Bluebird<Knex> = createKnexClient({connectionString: env.databaseUrl});
    const postgresClient = createPostgresClient({connectionString: env.messageStoreUrl});
    const messageStore = createMessageStore({db: postgresClient});
    const homeApp: VideoPage = createHome({db: knexClient});
    const recordViewingApp = createRecordViewings({messageStore});
    return {
        env,
        db: knexClient,
        homeApp,
        recordViewingApp,
        messageStore
    }
}