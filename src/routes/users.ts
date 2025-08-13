import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      email: z.email(),
      name: z.string(),
    });

    const { email, name } = createUserBodySchema.parse(request.body);

    await knex('users').insert({
      email,
      name,
    });

    reply.status(201).send();
  });

  app.get('/', async () => {
    const users = await knex('users').select();

    return { users };
  });

  app.get('/:id', async (request) => {
    const getUserParamSchema = z.object({
      id: z.coerce.number().int().positive(),
    });

    const { id } = getUserParamSchema.parse(request.params);

    const user = await knex('users').select().where({ id }).first();

    return user;
  });
}
