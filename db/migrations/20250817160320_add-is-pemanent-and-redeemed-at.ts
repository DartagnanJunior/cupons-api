import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('codes', (t) => {
    t.boolean('is_permanent').defaultTo(false).notNullable();
    t.timestamp('redeemed_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('codes', (t) => {
    t.dropColumn('redeemed_at');
    t.dropColumn('is_permanent');
  });
}
