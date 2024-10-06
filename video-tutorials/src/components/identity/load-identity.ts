import {Message} from "../../types/event-types";
import {Identity, IdentityHandlerContext} from "./identity-types";
import {Projection} from "../../message-store/message-store-types";

const identityProjection: Projection<Identity> = {
    $init(): Identity {
        return {
            id: null,
            email: null,
            isRegistered: false,
            registrationEmailSent: false,
        } as Identity;
    },
    Registered (identity: Identity, registered: Message): Identity {
        identity.id = registered.data.userId;
        identity.email = registered.data.email;
        identity.isRegistered = true;
        return identity;
    },
    RegistrationEmailSent (identity: Identity, message: Message): Identity {
        identity.registrationEmailSent = true;
        return identity;
    }
}

export function loadIdentity(context: IdentityHandlerContext) {
    const {identityId, messageStore} = context;
    const identityStreamName = `identity-${identityId}`;
    return messageStore
        .fetch(identityStreamName, identityProjection)
        .then((identity: Identity) => {
            context.identity = identity;
            return context;
        });
}