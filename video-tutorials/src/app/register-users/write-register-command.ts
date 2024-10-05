import {UserRegistrationChainContext} from "./index";
import {v4 as uuid} from "uuid";
import {UserIdEventMetadata, VideoTutorialEvent} from "../../types/event-types";

export function writeRegisterCommand(context: UserRegistrationChainContext): Promise<any> {
    const userId = context.attributes.id;
    const stream = `identity:command-${userId}`;
    const command: VideoTutorialEvent<UserIdEventMetadata> = {
        id: uuid(),
        type: 'Register',
        metadata: {
            traceId: context.traceId,
            userId
        },
        data: {
            userId,
            email: context.attributes.email,
            passwordHash: context.passwordHash
        }
    }

    return context.messageStore.write(stream, command);
}