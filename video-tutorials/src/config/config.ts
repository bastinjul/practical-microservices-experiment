import {createKnexClient} from "./knex-client";
import {createPostgresClient, PostgresClient} from "./postgres-client";
import {createHome} from "../app/home"
import {AppEnv} from "./env";
import {Knex} from "knex";
import {Aggregator, Component, App} from "../types/common-types";
import {createRecordViewingsApp} from "../app/record-viewings";
import {createMessageStore} from "../message-store";
import {build as createHomePageAggregator} from "../aggregators/home-page"
import {createUserRegistration, RegisterUserApp} from "../app/register-users";
import {MessageStore} from "../message-store/message-store-types";
import {createIdentityComponent} from "../components/identity";
import {IdentityComponent} from "../components/identity/identity-types";
import {createUserCredentialsAggregator, UserCredentialsAggregator} from "../aggregators/user-credentials";
import {createAuthenticateApp} from "../app/authenticate";
import {AuthenticateApp} from "../app/authenticate/authenticate-types";
import {createSendEmailComponent} from "../components/send-email";
import createPickupTransport from "nodemailer-pickup-transport";
import {SendEmailComponent} from "../components/send-email/send-email-types";
import {Transport} from "nodemailer";
import {CreatorsPortalApp} from "../app/creators-portal/creators-portal-types";
import {createCreatorsPortalApp} from "../app/creators-portal";

export interface AppConfig {
    env: AppEnv;
    db: Promise<Knex>;
    homeApp: App;
    recordViewingApp: App;
    messageStore: MessageStore;
    aggregators: Aggregator[];
    components: Component[];
    registerUsersApp: RegisterUserApp;
    identityComponent: IdentityComponent;
    userCredentialsAggregator: UserCredentialsAggregator;
    authenticateApp: AuthenticateApp;
    sendEmailComponent: SendEmailComponent;
    creatorsPortalApp: CreatorsPortalApp;
}

export default function createConfig({ env }: {env: AppEnv}): AppConfig {
    const knexClient: Promise<Knex> = createKnexClient({connectionString: env.databaseUrl});
    const postgresClient: PostgresClient = createPostgresClient({connectionString: env.messageStoreUrl});
    const messageStore: MessageStore = createMessageStore({db: postgresClient});
    const homePageAggregator = createHomePageAggregator({db: knexClient, messageStore});
    const userCredentialsAggregator =  createUserCredentialsAggregator({db: knexClient, messageStore});
    const aggregators: Aggregator[] = [homePageAggregator, userCredentialsAggregator];
    const identityComponent = createIdentityComponent({messageStore});
    const transport = createPickupTransport({directory: env.emailDirectory}) as Transport;
    const sendEmailComponent = createSendEmailComponent({messageStore, systemSenderEmailAddress: env.systemSenderEmailAddress, transport})
    const components: Component[] = [identityComponent, sendEmailComponent];
    const homeApp: App = createHome({db: knexClient});
    const recordViewingApp = createRecordViewingsApp({messageStore});
    const registerUsersApp = createUserRegistration({db: knexClient, messageStore});
    const authenticateApp = createAuthenticateApp({db: knexClient, messageStore});
    const creatorsPortalApp = createCreatorsPortalApp({db: knexClient, messageStore});
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
        userCredentialsAggregator,
        authenticateApp,
        sendEmailComponent,
        creatorsPortalApp
    }
}