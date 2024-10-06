import {IdentityHandlerContext} from "./identity-types";
import {OriginStreamEventMetadata, UserIdEventMetadata, VideoTutorialEvent} from "../../types/event-types";
import {v4 as uuid} from "uuid";

export function writeRegistrationEmailSentEvent(context: IdentityHandlerContext): Promise<IdentityHandlerContext> {
    const event = context.message;
    const metadata = event.metadata as OriginStreamEventMetadata;
    const registrationEmailSentEvent: VideoTutorialEvent<UserIdEventMetadata> = {
        id: uuid(),
        type: 'RegistrationEmailSent',
        metadata: {
            traceId: metadata.traceId,
            userId: metadata.userId
        },
        data: {
            userId: context.identityId,
            emailId: event.data.emailId
        }
    }
    const identityStreamName = metadata.originStreamName;
    return context.messageStore
        .write(identityStreamName, registrationEmailSentEvent)
        .then(() => context);
}