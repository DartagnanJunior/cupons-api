import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.text('name').notNullable();
    t.text('email').notNullable().unique();
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('coupon_books', (t) => {
    t.increments('id').primary();
    t.text('name').notNullable();
    t.integer('max_redemptions').notNullable().defaultTo(1);
    t.integer('max_codes_amount');
    t.text('generation_pattern');
    t.integer('generation_amount');
    t.text('status').notNullable().defaultTo('ACTIVE');
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('coupon_books');
  await knex.schema.dropTableIfExists('users');
}
