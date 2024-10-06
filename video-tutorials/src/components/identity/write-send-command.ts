import {IdentityHandlerContext} from "./identity-types";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import {OriginStreamEventMetadata, UserIdEventMetadata, VideoTutorialEvent} from "../../types/event-types";

const uuidv5Namespace = '0c46e0b7-dfaf-443a-b150-053b67905cc2';

export function writeSendCommand(context: IdentityHandlerContext): Promise<IdentityHandlerContext> {
    const event = context.message;
    const identity = context.identity;
    const email = context.email;
    const emailId = uuidv5(identity.email!, uuidv5Namespace);
    const metadata = event.metadata as UserIdEventMetadata;
    const sendEmailCommand: VideoTutorialEvent<OriginStreamEventMetadata> = {
        id: uuidv4(),
        type: 'Send',
        metadata: {
            originStreamName: `identity-${identity.id}`,
            traceId: metadata.traceId,
            userId: metadata.userId
        },
        data: {
            emailId,
            to: identity.email!,
            subject: email.subject,
            text: email.text,
            html: email.html,
        }
    }
    const streamName = `sendEmail:command-${emailId}`;
    return context.messageStore
        .write(streamName, sendEmailCommand)
        .then(() => context);
}