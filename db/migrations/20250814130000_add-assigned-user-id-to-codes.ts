import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('codes', (t) => {
    t.integer('assigned_user_id').nullable().references('id').inTable('users').onDelete('SET NULL').index();
    t.string('status').defaultTo('ACTIVE').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('codes', (t) => {
    t.dropColumn('status');
    t.dropColumn('assigned_user_id');
  });
}
