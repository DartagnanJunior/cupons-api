import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../../database';
import { generateCodes } from './codeGenerator';

export async function codesRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const codes = await knex('codes').select();
    return { codes };
  });

  app.post('/', async (request, reply) => {
    const createCodesBodySchema = z.object({
      coupon_book_id: z.coerce.number().int().positive(),
      pattern: z.string().nullable().default(null),
      amount: z.coerce.number().int().positive(),
    });

    const { coupon_book_id, pattern, amount } = createCodesBodySchema.parse(request.body);

    const codes = generateCodes({
      amount,
      pattern,
    });

    const rows: { coupon_book_id: number; code: string }[] = codes.map((code) => ({
      coupon_book_id,
      code,
    }));

    await knex('codes').insert(rows);

    reply.status(201).send({
      ok: true,
      inserted: rows.length,
      codes,
    });
  });
}
