import {createKnexClient} from "./knex-client";
import {createPostgresClient, PostgresClient} from "./postgres-client";
import {createHome} from "../app/home"
import {AppEnv} from "./env";
import {Knex} from "knex";
import {VideoPage} from "../app/types/common-types";
import {createRecordViewings} from "../app/record-viewings";
import {createMessageStore, MessageStore} from "../message-store";

export interface AppConfig {
    env: AppEnv;
    db: Promise<Knex>;
    homeApp: VideoPage;
    recordViewingApp: VideoPage;
    messageStore: MessageStore;
}

export default function createConfig({ env }: {env: AppEnv}): AppConfig {
    const knexClient: Promise<Knex> = createKnexClient({connectionString: env.databaseUrl});
    const postgresClient: PostgresClient = createPostgresClient({connectionString: env.messageStoreUrl});
    const messageStore: MessageStore = createMessageStore({db: postgresClient});
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