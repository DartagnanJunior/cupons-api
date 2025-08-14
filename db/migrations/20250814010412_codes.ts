import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('codes', (t) => {
    t.increments('id').primary();
    t.integer('coupon_book_id').notNullable().references('id').inTable('coupon_books').onDelete('CASCADE').index();
    t.text('code').notNullable();
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.integer('redeemed_times').notNullable().defaultTo(0);
    t.unique(['coupon_book_id', 'code']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('codes');
}
