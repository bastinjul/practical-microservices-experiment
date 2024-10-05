import { Knex, SchemaBuilder } from "knex";

exports.up = (knex: Knex): SchemaBuilder =>
    knex.schema.createTable('user_credentials', table => {
        table.string('id').primary();
        table.string('email').notNullable();
        table.string('password_hash').notNullable();
        table.index('email');
    })

exports.down = (knex: Knex) => knex.schema.dropTable('user_credentials');