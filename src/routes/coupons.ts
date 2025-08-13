import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';

export async function couponsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const coupons = await knex('coupon_books').select();
    return { coupons };
  });

  app.post('/', async (request, reply) => {
    const createCouponsBodySchema = z.object({
      name: z.string(),
      max_redemptions: z.number().default(1),
      max_codes_amount: z.number().nullable().default(null),
      generation_pattern: z.string().nullable().default(null),
      generation_amount: z.number().nullable().default(null),
    });

    const { name, max_redemptions, max_codes_amount, generation_pattern, generation_amount } = createCouponsBodySchema.parse(request.body);

    await knex('coupon_books').insert({
      name,
      max_redemptions,
      max_codes_amount: max_codes_amount,
      generation_pattern: generation_pattern,
      generation_amount: generation_amount,
    });

    reply.status(201).send();
  });
}
