import {createWrite, WriteFunction} from "./write";
import {PostgresClient} from "../config/postgres-client";

export interface MessageStore {
    write: WriteFunction
}

export function createMessageStore({db}: {db: PostgresClient}): MessageStore {
    const write = createWrite({db});
    return {
        write
    }
}
