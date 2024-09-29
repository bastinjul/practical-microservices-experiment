import { Knex, SchemaBuilder } from "knex";

exports.up = (knex: Knex): SchemaBuilder =>
    knex.schema.createTable('videos', table => {
        table.increments()
        table.string('owner_id')
        table.string('name')
        table.string('description')
        table.string('transcoding_status')
        table.integer('view_count').defaultTo(0)
    })

exports.down = (knex: Knex) => knex.schema.dropTable('videos');