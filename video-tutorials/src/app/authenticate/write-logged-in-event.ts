import {AuthenticateContext} from "./authenticate-types";
import {UserIdEventMetadata, VideoTutorialEvent} from "../../types/event-types";
import {v4 as uuid} from "uuid";

export function writeLoggedInEvent(context: AuthenticateContext): Promise<AuthenticateContext> {
    const event: VideoTutorialEvent<UserIdEventMetadata> = {
        id: uuid(),
        type: 'UserLoggedIn',
        metadata: {
            traceId: context.traceId,
            userId: context.userCredentials.id
        },
        data: {
            userId: context.userCredentials.id
        }
    }
    const streamName = `authentication-${context.userCredentials.id}`
    return context.messageStore.write(streamName, event)
        .then(() => context);
}