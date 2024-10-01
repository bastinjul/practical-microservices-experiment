import {MessageStore} from "../message-store";
import {Knex} from "knex";
import {Aggregator, VideoQueries} from "../types/common-types";
import {Message} from "../types/event-types";
import {AggregatorHandler} from "../types/aggregator-types";
import {CreateSubscriptionConfig, Subscription} from "../message-store/subscribe";

export interface HomePageAggregator extends Aggregator{
    queries: HomePageAggregatorQueries;
    handlers: AggregatorHandler;
    init: () => Promise<any>;
    start: () => void;
}

export interface HomePageAggregatorQueries extends VideoQueries {
    incrementVideosWatched: (globalPosition: number) => Promise<any>;
    ensureHomePage: () => Promise<any>;
}

function createHandlers ({queries}: {queries: HomePageAggregatorQueries}): AggregatorHandler {
    return {
        VideoViewed: (evt: Message) => queries.incrementVideosWatched(evt.globalPosition)
    }
}

function createQueries({db}: {db: Promise<Knex>}): HomePageAggregatorQueries {
    async function incrementVideosWatched (globalPosition: number): Promise<any> {
        const queryString = `
            UPDATE
                pages
            SET
                page_data = jsonb_set(
                    jsonb_set(
                        page_data,
                        '{videosWatched}',
                        ((page_data ->> 'videosWatched')::int + 1)::text::jsonb
                    ),
                    '{lastViewProcessed}',
                    :globalPosition::text::jsonb
                )
            WHERE
                page_name = 'home' AND
                (page_data->>'lastViewProcessed')::int < :globalPosition
            `
        return db.then(client => client.raw(queryString, {globalPosition}));
    }
    async function ensureHomePage (): Promise<any> {
        const initialData = {
            pageData: { lastViewProcessed: 0, videoWatched: 0}
        }
        const queryString = `INSERT INTO pages(page_name, page_data) VALUES ('home', :pageData) ON CONFLICT DO NOTHING`
        return db.then(client => client.raw(queryString, initialData));
    }
    return {
        incrementVideosWatched,
        ensureHomePage
    }
}

export function build({db, messageStore}: {db: Promise<Knex>, messageStore: MessageStore}): HomePageAggregator {
    const queries = createQueries({db});
    const handlers = createHandlers({queries});
    const subscription: Subscription = messageStore.createSubscription({
        streamName: 'viewing',
        handlers,
        subscriberId: 'aggregators::home-page'
    } as CreateSubscriptionConfig);
    function init(): Promise<any> {
        return queries.ensureHomePage();
    }

    function start(): void {
        init().then(() => subscription.start());
    }

    return {
        queries,
        handlers,
        init,
        start
    }
}