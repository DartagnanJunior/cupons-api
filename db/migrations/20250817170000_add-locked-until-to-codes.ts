import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('codes', (t) => {
    t.timestamp('locked_until').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('codes', (t) => {
    t.dropColumn('locked_until');
  });
}
