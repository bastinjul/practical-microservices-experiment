import {IdentityHandlerContext} from "./identity-types";
import Email from "email-templates";
import {join} from "path";

const templateRoot = join(__dirname, 'templates')

export function renderRegistrationEmail(context: IdentityHandlerContext): Promise<IdentityHandlerContext> {
    const email = new Email({views: {root: templateRoot}});
    return email.renderAll('registration-email', {})
        .then(rendered => {
            context.email = rendered;
            return context;
        })
}