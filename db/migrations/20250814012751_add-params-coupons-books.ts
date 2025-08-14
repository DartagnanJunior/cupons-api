import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('coupon_books', (t) => {
    t.integer('redeemed_codes_amount_per_user').notNullable().defaultTo(1);
    t.integer('assign_codes_amount_per_user').notNullable().defaultTo(1);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('coupon_books', (t) => {
    t.dropColumn('redeemed_codes_amount_per_user');
    t.dropColumn('assign_codes_amount_per_user');
  });
}
