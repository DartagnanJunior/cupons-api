import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      email: z.email(),
      external_ref: z.string().min(3).max(100),
    });

    const { email, external_ref } = createUserBodySchema.parse(request.body);

    await knex('users').insert({
      email,
      external_ref,
    });

    reply.status(201).send();
  });
}
