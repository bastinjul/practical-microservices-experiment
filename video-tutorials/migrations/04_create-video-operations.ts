import { Knex, SchemaBuilder } from "knex";

exports.up = (knex: Knex): SchemaBuilder =>
    knex.schema.createTable('video_operations', table => {
        table.string('trace_id').primary();
        table.string('video_id').notNullable();
        table.boolean('succeeded').notNullable();
        table.string('failure_reason');
    })

exports.down = (knex: Knex) => knex.schema.dropTable('video_operations');