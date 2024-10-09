import {CreateSubscriptionConfig, MessageStore} from "../message-store/message-store-types";
import {Knex} from "knex";
import {Aggregator, AppQueries} from "../types/common-types";
import {AggregatorHandler} from "../types/aggregator-types";
import {Message} from "../types/event-types";

export interface VideoOperationsAggregator extends Aggregator {
    queries: VideoOperationsAggregatorQueries;
}

export interface VideoOperationsAggregatorQueries extends AppQueries {
    writeResult: (operation: Operation) => Promise<any>;
}

interface Operation {
    traceId: string;
    videoId: string;
    succeeded: boolean;
    failureReason: string | null;
}

function createQueries({db}: {db: Promise<Knex>}): VideoOperationsAggregatorQueries {
    function writeResult(operation: Operation): Promise<any> {
        const rawQuery = `
            INSERT INTO
                video_operations (trace_id, video_id, succeeded, failure_reason) 
            VALUES 
                (:traceId, :videoId, :succeeded, :failureReason)
            ON CONFLICT (trace_id) DO NOTHING;
        `
        return db.then(client => client.raw(rawQuery, operation));
    }
    return {
        writeResult
    }
}

function streamToEntityId (streamName: string): string {
    return streamName.split(/-(.+)/)[1]
}

function createhandlers({queries}: {queries: VideoOperationsAggregatorQueries}): AggregatorHandler {
    return {
        VideoNamed: (event: Message) => {
            const videoId = streamToEntityId(event.streamName)
            const wasSuccessful = true;
            const failureReason = null;
            return queries.writeResult({
                traceId: event.metadata.traceId,
                videoId,
                succeeded: wasSuccessful,
                failureReason,
            });
        },
        VideoNameRejected: (event: Message) => {
            const videoId = streamToEntityId(event.streamName);
            const wasSuccessful = false;
            const failureReason = event.data.reason;
            return queries.writeResult({
                traceId: event.metadata.traceId,
                videoId,
                succeeded: wasSuccessful,
                failureReason
            });
        }
    }
}

export function createVideoOperationsAggregator({messageStore, db}: {messageStore: MessageStore, db: Promise<Knex>}): VideoOperationsAggregator {
    const queries = createQueries({db});
    const handlers = createhandlers({queries});
    const subscription = messageStore.createSubscription({
        streamName: 'videoPublishing',
        handlers,
        subscriberId: 'aggregators:video-operations',
    } as CreateSubscriptionConfig)

    function start() {
        subscription.start();
    }
    return {
        queries,
        handlers,
        start
    }
}