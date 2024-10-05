import {v4 as uuid} from 'uuid';
import Bluebird from 'bluebird';
import {Message, SubscriptionMessage} from "../types/event-types";
import {QueryResult} from "pg";
import {CreateSubscription, CreateSubscriptionConfig, Subscription} from "./message-store-types";

export function configureCreateSubscription({read, readLastMessage, write}: CreateSubscription): (subscriptionConfig: CreateSubscriptionConfig) => Subscription {
    return ({streamName, handlers, messagesPerTick = 100, subscriberId, positionUpdateInterval = 100, tickIntervalMs = 100}: CreateSubscriptionConfig): Subscription => {
        const subscriberStreamName = `subscriberPosition-${subscriberId}`;
        let currentPosition = 0;
        let messageSinceLastPositionWrite = 0;
        let keepGoing = true;

        function loadPosition(): Promise<void> {
            return readLastMessage(subscriberStreamName)
                .then(message => {
                    currentPosition = message?.data?.position || 0
                });
        }

        function writePosition(position: number): Promise<QueryResult> {
            const positionEvent = {
                id: uuid(),
                type: 'Read',
                data: {position}
            } as SubscriptionMessage;
            return write(subscriberStreamName, positionEvent);
        }


        function updateReadPosition(position: number): Promise<any> {
            currentPosition = position;
            messageSinceLastPositionWrite += 1;
            if(messageSinceLastPositionWrite === positionUpdateInterval) {
                messageSinceLastPositionWrite = 0;
                return writePosition(position);
            }
            return Promise.resolve(true);
        }

        function getNextBatchOfMessages(): Promise<Message[]> {
            return read(streamName, currentPosition + 1, messagesPerTick)
        }

        async function processBatch(messages: Message[]): Promise<number> {
           return Bluebird.each(messages, message => handleMessage(message)
                .then(() => updateReadPosition(message.globalPosition))
                .catch((err: Error) => {
                    logError(message, err);
                    throw err;
                }))
                .then(() => messages.length);
        }

        function handleMessage(message: Message): Promise<any> {
            const handler = handlers[message.type] || handlers.$any;
            return handler ? handler(message) : Promise.resolve(true);
        }

        function logError (lastMessage: Message, error: Error) {
            // eslint-disable-next-line no-console
            console.error(
                'error processing:\n',
                `\t${subscriberId}\n`,
                `\t${lastMessage.id}\n`,
                `\t${error}\n`
            )
        }

        function stop(): void {
            console.log(`Stopped ${subscriberId}`)
            keepGoing = false;
        }

        function start(): Promise<void> {
            console.log(`Started ${subscriberId}`);
            return poll();
        }

        async function poll(): Promise<void> {
            await loadPosition();
            while (keepGoing) {
                const messagesProcessed = await tick();
                if(messagesProcessed === 0) {
                    await Bluebird.delay(tickIntervalMs);
                }
            }
        }

        function tick(): Promise<number | void> {
            return getNextBatchOfMessages()
                .then(processBatch)
                .catch((err: Error) => {
                    console.error(`Error processing batch`, err);
                    stop();
                });
        }

        return {
            loadPosition,
            start,
            stop,
            tick,
            writePosition
        } as Subscription;
    }
}