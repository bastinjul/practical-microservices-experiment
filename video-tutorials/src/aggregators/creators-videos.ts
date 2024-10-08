import {Knex} from "knex";
import {CreateSubscriptionConfig, MessageStore} from "../message-store/message-store-types";
import {Aggregator, AppQueries} from "../types/common-types";
import {AggregatorHandler} from "../types/aggregator-types";
import {Message} from "../types/event-types";

export interface CreatorsVideosAggregator extends Aggregator {
    queries: CreatorsVideosAggregatorQueries;
}

export interface CreatorsVideosAggregatorQueries extends AppQueries {
    createVideo: (ownerId: string, sourceUri: string, videoId: string, position: number, transcodeUri: string) => Promise<any>;
}

function createQueries({db}: {db: Promise<Knex>}): CreatorsVideosAggregatorQueries {
    function createVideo(ownerId: string, sourceUri: string, videoId: string, position: number, transcodedUri: string): Promise<any> {
        const rawQuery = `
            INSERT INTO
                creators_portal_videos (id, owner_id, source_uri, position, transcoded_uri)
            VALUES 
                (:videoId, :ownerId, :sourceUri, :position, :transcodedUri)
            ON CONFLICT (id) DO NOTHING;
        `
        return db.then(client => client.raw(rawQuery, {videoId, ownerId, sourceUri, position, transcodedUri}));
    }
    return {
        createVideo
    }
}

function createHandlers({queries}: {queries: CreatorsVideosAggregatorQueries}): AggregatorHandler {
    return {
        VideoPublished: (event: Message) => queries.createVideo(event.data.ownerId, event.data.sourceUri, event.data.videoId, event.position, event.data.transcodedUri)
    }
}

export function createCreatorsVideosAggregator({db, messageStore}: {db: Promise<Knex>, messageStore: MessageStore}): CreatorsVideosAggregator {
    const queries = createQueries({db});
    const handlers = createHandlers({queries});
    const subscription = messageStore.createSubscription({
        streamName: 'videoPublishing',
        handlers,
        subscriberId: 'aggregators:creators-videos'
    } as CreateSubscriptionConfig);

    function start(): void {
        subscription.start();
    }

    return {
        handlers,
        queries,
        start
    }
}