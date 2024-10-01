import { Knex, SchemaBuilder } from "knex";

exports.up = (knex: Knex): SchemaBuilder =>
    knex.schema.createTable('pages', table => {
        table.string('page_name').primary();
        table.jsonb('page_data').defaultTo({});
    })

exports.down = (knex: Knex) => knex.schema.dropTable('pages');