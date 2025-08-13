import { knex as setupKnex, Knex } from 'knex';
import { env } from './env';

export const dbConfig: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
  pool: {
    afterCreate: (conn: any, done: any) => {
      conn.run('PRAGMA journal_mode = WAL', (err: any) => {
        if (err) return done(err);
        conn.run('PRAGMA busy_timeout = 5000', (err: any) => {
          if (err) return done(err);
          conn.run('PRAGMA foreign_keys = ON', done);
        });
      });
    },
  },
};

export const knex = setupKnex(dbConfig);
