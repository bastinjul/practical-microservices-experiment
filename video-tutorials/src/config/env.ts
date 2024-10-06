import dotenv from "dotenv";
import colors from "colors";

const envResult = dotenv.config();
if(envResult.error) {
    console.error(`${colors.red('[ERROR] env failed to load')} ${envResult.error}`);
    process.exit(1);
}

function requireFromEnv (key: string): string {
    if(!process.env[key]) {
        console.error(`${colors.red('[APP ERROR] Missing env variable:')} ${key}`);
        return process.exit(1);
    }
    return process.env[key];
}

export interface AppEnv {
    appName: string;
    env: string;
    port: number;
    version: string;
    databaseUrl: string;
    messageStoreUrl: string;
    cookieSecret: string;
    systemSenderEmailAddress: string;
    emailDirectory: string;
}

export const appEnv: AppEnv = {
    appName: requireFromEnv('APP_NAME'),
    env: requireFromEnv('NODE_ENV'),
    port: parseInt(requireFromEnv('PORT'), 10),
    version: requireFromEnv('VERSION'),
    databaseUrl: requireFromEnv('DATABASE_URL'),
    messageStoreUrl: requireFromEnv('MESSAGE_STORE_URL'),
    cookieSecret: requireFromEnv('COOKIE_SECRET'),
    emailDirectory: requireFromEnv('EMAIL_DIRECTORY'),
    systemSenderEmailAddress: requireFromEnv('SYSTEM_SENDER_EMAIL_ADDRESS')
}