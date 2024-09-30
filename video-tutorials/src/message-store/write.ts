import {PostgresClient} from "../config/postgres-client";
import {QueryResult} from "pg";
import {VideoTutorialEvent, VideoTutorialEventMetadata} from "../app/types/event-types";
import {VersionConflictError} from "./version-conflict-error";

const versionConflictErrorRegex = /^Wrong.*Stream Version: (\d+)\)/
const writeFunctionSql = 'SELECT message_store.write_message($1, $2, $3, $4, $5, $6)';

export type WriteFunction = (streamName: string, message: VideoTutorialEvent<VideoTutorialEventMetadata>, expectedVersion?: number) => Promise<QueryResult>;

export function createWrite({db}: {db: PostgresClient}): WriteFunction {
    return (streamName: string, message: VideoTutorialEvent<VideoTutorialEventMetadata>, expectedVersion?: number): Promise<QueryResult> => {
        if(!message.type) {
            throw new Error('Messages must have a type');
        }

        const values = [
            message.id,
            streamName,
            message.type,
            message.data,
            message.metadata,
            expectedVersion,
        ]
        return db.query(writeFunctionSql, values)
            .catch((err: Error) => {
                const errorMatch = RegExp(versionConflictErrorRegex).exec(err.message);
                const notVersionConflict = errorMatch === null;
                if(notVersionConflict) {
                    throw err;
                }
                const actualVersion = parseInt(errorMatch[1], 10);
                const versionConflictError = new VersionConflictError(streamName, expectedVersion ?? -1, actualVersion);
                versionConflictError.stack = err.stack;
                throw versionConflictError;
            })
    }
}