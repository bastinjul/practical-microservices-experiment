import {createWrite, WriteFunction} from "./write";
import {PostgresClient} from "../config/postgres-client";
import {CreateRead, createRead} from "./read";
import {configureCreateSubscription, CreateSubscriptionConfig, Subscription} from "./subscribe";

export interface MessageStore {
    write: WriteFunction,
    createSubscription: (subscriptionConfig: CreateSubscriptionConfig) => Subscription;
    read: any;
    readLastMessage: any;
}

export function createMessageStore({db}: {db: PostgresClient}): MessageStore {
    const write = createWrite({db});
    const read: CreateRead = createRead({db});
    const createSubscription = configureCreateSubscription({
        read: read.read,
        readLastMessage: read.readLastMessage,
        write: write
    });
    return {
        write,
        createSubscription,
        read: read.read,
        readLastMessage: read.readLastMessage,
    }
}
