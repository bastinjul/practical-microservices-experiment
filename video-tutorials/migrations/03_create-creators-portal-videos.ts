import { Knex, SchemaBuilder } from "knex";

exports.up = (knex: Knex): SchemaBuilder =>
    knex.schema.createTable('creators_portal_videos', table => {
        table.string('id').primary();
        table.string('owner_id').notNullable();
        table.string('name');
        table.string('description');
        table.integer('views').defaultTo(0);
        table.string('source_uri').notNullable();
        table.string('transcoded_uri');
        table.integer('position').notNullable();
    })

exports.down = (knex: Knex) => knex.schema.dropTable('creators_portal_videos');