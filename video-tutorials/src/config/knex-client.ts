import Bluebird, {Promise} from "bluebird";
import knex, {Knex} from "knex";

export function createKnexClient({connectionString, migrationsTableName}: {connectionString: string, migrationsTableName?: string}): Bluebird<Knex> {
    const client = knex(connectionString);
    const migrationOptions = {
        tableName: migrationsTableName ?? 'knex_migrations',
    }

    return Promise.resolve(client.migrate.latest(migrationOptions)).then(() => client);
}