import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../../database';

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

  app.get('/', async (request, reply) => {
    const users = await knex('users').select();

    return reply.status(200).send({ users });
  });

  app.get('/:id', async (request, reply) => {
    const getUserParamSchema = z.object({
      id: z.coerce.number().int().positive(),
    });

    const { id } = getUserParamSchema.parse(request.params);

    const user = await knex('users').select().where({ id }).first();

    return reply.status(200).send({ user });
  });
}
