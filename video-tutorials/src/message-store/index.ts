import {createWrite} from "./write";
import {PostgresClient} from "../config/postgres-client";
import {createRead} from "./read";
import {configureCreateSubscription} from "./subscribe";
import {CreateRead, MessageStore} from "./message-store-types";

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
        fetch: read.fetch
    }
}
