import {PostgresClient} from "../config/postgres-client";
import {deserializeMessage} from "./deserialize-message";
import {Message} from "../types/event-types";
import {CreateRead, Projection} from "./message-store-types";

const getLastMessageSql = 'SELECT * from get_last_stream_message($1)'

const getCategoryMessagesSql = 'SELECT * FROM get_category_messages($1, $2, $3)'
const getStreamMessagesSql = 'SELECT * FROM get_stream_messages($1, $2, $3)'


function project(events: Message[], projection: Projection<any>) {
    return events.reduce((entity: any, event: Message) => {
        if(!projection[event.type]) {
            return entity;
        }
        return projection[event.type](entity, event);
    }, projection.$init())
}

export function createRead({db}: {db: PostgresClient}): CreateRead {
    function readLastMessage(streamName: string): Promise<Message> {
        return db.query(getLastMessageSql, [streamName])
            .then(res => deserializeMessage(res.rows[0]));
    }

    function read(streamName: string, fromPosition: number = 0, maxMessages: number = 1000): Promise<Message[]> {
        let query = null;
        let values = [];
        if(streamName.includes('-')) {
            query = getStreamMessagesSql;
            values = [streamName, fromPosition, maxMessages];
        } else {
            query = getCategoryMessagesSql;
            values = [streamName, fromPosition, maxMessages];
        }
        return db.query(query, values)
            .then(res => res.rows.map(deserializeMessage));
    }

    function fetch(streamName: string, projection: Projection<any>): Promise<any> {
        return read(streamName).then((messages: Message[]) => project(messages, projection));
    }

    return {
        readLastMessage,
        read,
        fetch
    }
}