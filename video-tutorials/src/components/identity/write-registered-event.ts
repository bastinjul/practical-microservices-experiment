import {IdentityCommandHandlerContext} from "./identity-types";
import {AlreadyRegisteredError} from "../../app/errors/AlreadyRegisteredError";
import {v4 as uuid} from "uuid";
import {UserIdEventMetadata, VideoTutorialEvent} from "../../types/event-types";

export function writeRegisteredEvent(context: IdentityCommandHandlerContext, err?: AlreadyRegisteredError): Promise<IdentityCommandHandlerContext> {
    const command = context.command;
    const commandMetadata = command.metadata as UserIdEventMetadata;
    const registeredEvent: VideoTutorialEvent<UserIdEventMetadata> = {
        id: uuid(),
        type: "Registered",
        metadata: {
            traceId: commandMetadata.traceId,
            userId: commandMetadata.userId
        },
        data: {
            userId: command.data.userId,
            email: command.data.email,
            passwordHash: command.data.passwordHash
        }
    }
    const identityStreamName = `identity-${command.data.userId}`;
    return context.messageStore
        .write(identityStreamName, registeredEvent)
        .then(() => context);
}