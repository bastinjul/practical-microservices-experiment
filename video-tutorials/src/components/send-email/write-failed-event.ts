import {SendEmailHandlerContext} from "./send-email-types";
import {SendError} from "../../app/errors/SendError";
import {v4 as uuid} from "uuid";
import {OriginStreamEventMetadata, VideoTutorialEvent} from "../../types/event-types";

export function writeFailedEvent(context: SendEmailHandlerContext, err: SendError): Promise<SendEmailHandlerContext> {
    const sendCommand = context.sendCommand;
    const streamName = `sendEmail-${sendCommand.data.emailId}`;
    const metadata = sendCommand.metadata as OriginStreamEventMetadata;
    const event: VideoTutorialEvent<OriginStreamEventMetadata> = {
        id: uuid(),
        type: 'Failed',
        metadata: {
            originStreamName: metadata.originStreamName,
            traceId: metadata.traceId,
            userId: metadata.userId
        },
        data: {
            ...sendCommand.data,
            reason: err.message
        }
    }
    return context.messageStore.write(streamName, event)
        .then(() => context);
}