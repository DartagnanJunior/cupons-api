import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';

export async function cuponsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createCuponsBodySchema = z.object({
      name: z.string(),
      max_redemptions: z.number().default(1),
      max_codes_amount: z.number().optional(),
      generation_pattern: z.string().optional(),
      generation_total: z.number().optional(),
    });

    const { name, max_redemptions, max_codes_amount, generation_pattern, generation_total } = createCuponsBodySchema.parse(request.body);

    await knex('coupon_books').insert({
      name,
      max_redemptions,
      max_codes_amount,
      generation_pattern,
      generation_total,
    });

    reply.status(201).send();
  });
}
