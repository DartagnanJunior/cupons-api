import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('coupon_books', (t) => {
    t.boolean('is_locked').defaultTo(false).notNullable();
    
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('coupon_books', (t) => {
    t.dropColumn('is_locked');
  })
}

