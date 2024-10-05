import {createKnexClient} from "./knex-client";
import {createPostgresClient, PostgresClient} from "./postgres-client";
import {createHome} from "../app/home"
import {AppEnv} from "./env";
import {Knex} from "knex";
import {Aggregator, Component, VideoPage} from "../types/common-types";
import {createRecordViewings} from "../app/record-viewings";
import {createMessageStore, MessageStore} from "../message-store";
import {build as createHomePageAggregator} from "../aggregators/home-page"
import {createUserRegistration, RegisterUserApp} from "../app/register-users";

export interface AppConfig {
    env: AppEnv;
    db: Promise<Knex>;
    homeApp: VideoPage;
    recordViewingApp: VideoPage;
    messageStore: MessageStore;
    aggregators: Aggregator[];
    components: Component[];
    registerUsersApp: RegisterUserApp;
}

export default function createConfig({ env }: {env: AppEnv}): AppConfig {
    const knexClient: Promise<Knex> = createKnexClient({connectionString: env.databaseUrl});
    const postgresClient: PostgresClient = createPostgresClient({connectionString: env.messageStoreUrl});
    const messageStore: MessageStore = createMessageStore({db: postgresClient});
    const homePageAggregator = createHomePageAggregator({db: knexClient, messageStore});
    const aggregators: Aggregator[] = [homePageAggregator];
    const components: Component[] = []
    const homeApp: VideoPage = createHome({db: knexClient});
    const recordViewingApp = createRecordViewings({messageStore});
    const registerUsersApp = createUserRegistration({db: knexClient, messageStore});
    return {
        env,
        db: knexClient,
        homeApp,
        recordViewingApp,
        messageStore,
        aggregators,
        components,
        registerUsersApp
    }
}