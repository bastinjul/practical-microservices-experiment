import {SendEmailHandlerContext} from "./send-email-types";
import {OriginStreamEventMetadata, VideoTutorialEvent} from "../../types/event-types";
import {v4 as uuid} from "uuid";

export function writeSentEvent(context: SendEmailHandlerContext): Promise<SendEmailHandlerContext> {
    const sendCommand = context.sendCommand;
    const streamName = `sendEmail-${sendCommand.data.emailId}`;
    const metadata = sendCommand.metadata as OriginStreamEventMetadata;
    const event: VideoTutorialEvent<OriginStreamEventMetadata> = {
        id: uuid(),
        type: 'Sent',
        metadata: {
            originStreamName: metadata.originStreamName,
            traceId: metadata.traceId,
            userId: metadata.userId
        },
        data: sendCommand.data
    }
    return context.messageStore.write(streamName, event)
        .then(() => context);
}