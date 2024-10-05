import {createKnexClient} from "./knex-client";
import {createPostgresClient, PostgresClient} from "./postgres-client";
import {createHome} from "../app/home"
import {AppEnv} from "./env";
import {Knex} from "knex";
import {Aggregator, Component, VideoPage} from "../types/common-types";
import {createRecordViewings} from "../app/record-viewings";
import {createMessageStore} from "../message-store";
import {build as createHomePageAggregator} from "../aggregators/home-page"
import {createUserRegistration, RegisterUserApp} from "../app/register-users";
import {MessageStore} from "../message-store/message-store-types";
import {createIdentityComponent} from "../components/identity";
import {IdentityComponent} from "../components/identity/identity-types";

export interface AppConfig {
    env: AppEnv;
    db: Promise<Knex>;
    homeApp: VideoPage;
    recordViewingApp: VideoPage;
    messageStore: MessageStore;
    aggregators: Aggregator[];
    components: Component[];
    registerUsersApp: RegisterUserApp;
    identityComponent: IdentityComponent;
}

export default function createConfig({ env }: {env: AppEnv}): AppConfig {
    const knexClient: Promise<Knex> = createKnexClient({connectionString: env.databaseUrl});
    const postgresClient: PostgresClient = createPostgresClient({connectionString: env.messageStoreUrl});
    const messageStore: MessageStore = createMessageStore({db: postgresClient});
    const homePageAggregator = createHomePageAggregator({db: knexClient, messageStore});
    const aggregators: Aggregator[] = [homePageAggregator];
    const identityComponent = createIdentityComponent({messageStore});
    const components: Component[] = [identityComponent];
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
        registerUsersApp,
        identityComponent,
    }
}