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

    let codes: string[];
    try {
      codes = generateCodes({
        amount,
        pattern,
      });
    } catch (err: any) {
      return reply.status(400).send({ error: err?.message || 'Failed to generate codes' });
    }

    const rows: { coupon_book_id: number; code: string }[] = codes.map((code) => ({
      coupon_book_id,
      code,
    }));

    try {
      await knex('codes').insert(rows);
    } catch (err: any) {
      return reply.status(500).send({ error: 'Failed to register database' });
    }

    reply.status(201).send({
      ok: true,
      inserted: rows.length,
      codes,
    });
  });
}
