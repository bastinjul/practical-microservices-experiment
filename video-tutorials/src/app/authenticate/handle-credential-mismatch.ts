import {AuthenticateContext} from "./authenticate-types";
import {VideoTutorialEvent, VideoTutorialEventMetadata} from "../../types/event-types";
import {v4 as uuid} from "uuid";
import {AuthenticationError} from "../errors/AuthenticationError";

export function handleCredentialMismatch(context: AuthenticateContext) {
    const event: VideoTutorialEvent<VideoTutorialEventMetadata> = {
        id: uuid(),
        type: 'UserLoginFailed',
        metadata: {
            traceId: context.traceId
        },
        data: {
            userId: context.userCredentials.id,
            reason: 'Incorrect password'
        }
    }
    const streamName = `authentication-${context.userCredentials.id}`
    return context.messageStore.write(streamName, event)
        .then(() => {
            throw new AuthenticationError();
        })
}