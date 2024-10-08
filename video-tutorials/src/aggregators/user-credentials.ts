import {CreateSubscriptionConfig, MessageStore} from "../message-store/message-store-types";
import {Aggregator, AppQueries} from "../types/common-types";
import {AggregatorHandler} from "../types/aggregator-types";
import {Knex} from "knex";
import {Message} from "../types/event-types";

export interface UserCredentialsAggregator extends Aggregator {
    queries: UserCredentialsAggregatorQueries;
}

export interface UserCredentialsAggregatorQueries extends AppQueries {
    createUserCredentials: (userId: string, email: string, passwordHash: string) => Promise<any>;
}

function createQueries({db}: {db: Promise<Knex>}): UserCredentialsAggregatorQueries {
    function createUserCredentials(id: string, email: string, passwordHash: string) {
        const rawQuery = `
            INSERT INTO
                user_credentials (id, email, password_hash) 
            VALUES 
                (:id, :email, :passwordHash)
            ON CONFLICT DO NOTHING;
        `
        return db.then(client => client.raw(rawQuery, {id, email, passwordHash}));
    }
    return {createUserCredentials};
}

function createHandlers({queries}: {queries: UserCredentialsAggregatorQueries}): AggregatorHandler {
    return {
        Registered: (event: Message) => queries.createUserCredentials(event.data.userId, event.data.email, event.data.passwordHash)
    }
}

export function createUserCredentialsAggregator({db, messageStore}: {db: Promise<Knex>, messageStore: MessageStore}): UserCredentialsAggregator {
    const queries = createQueries({db});
    const handlers = createHandlers({queries});
    const subscription = messageStore.createSubscription({
        streamName: 'identity',
        handlers,
        subscriberId: 'aggregators:user-credentials'
    } as CreateSubscriptionConfig)
    function start(): void {
        subscription.start();
    }
    return {
        handlers,
        queries,
        start
    }
}