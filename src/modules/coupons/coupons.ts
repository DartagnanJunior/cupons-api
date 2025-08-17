import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../../database';
import { decisionCodeGeneration, generateCodes } from '../codes/codeGenerator';
import { codesRoutes } from '../codes/codes';
import { assignRoutes } from '../assing/assign';
import { lockRoutes } from '../lock/lock';
import { reedemRoutes } from '../reedem/reedem';

export async function couponsRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const coupons = await knex('coupon_books').select();
    return reply.status(200).send({ coupons });
  });

  app.post('/', async (request, reply) => {
    const createCouponsBodySchema = z.object({
      name: z.string(),
      max_redemptions: z.coerce.number().int().positive().default(1),
      max_codes_amount: z.number().int().positive().nullable().default(null),
      generation_pattern: z.string().nullable().default(null),
      generation_amount: z.coerce.number().int().positive().nullable().default(null),
      redeemed_codes_amount_per_user: z.number().int().positive().default(1),
      assign_codes_amount_per_user: z.number().int().positive().default(1),
    });

    const {
      name,
      max_redemptions,
      max_codes_amount,
      generation_pattern,
      generation_amount,
      redeemed_codes_amount_per_user,
      assign_codes_amount_per_user,
    } = createCouponsBodySchema.parse(request.body);

    await knex.transaction(async (transaction) => {
      const ids = await transaction('coupon_books').insert({
        name,
        max_redemptions,
        max_codes_amount,
        generation_pattern,
        generation_amount,
        redeemed_codes_amount_per_user,
        assign_codes_amount_per_user,
      });

      if (!ids?.length || ids[0] == null) {
        throw new Error('Failed to create coupon book');
      }

      const couponBookId = Number(ids[0]);

      const { amountToGenerate, patternToUse } = decisionCodeGeneration({
        generation_amount: generation_amount,
        generation_pattern: generation_pattern,
        max_codes_amount: max_codes_amount,
      });

      if (amountToGenerate > 0) {
        const codes = generateCodes({ amount: amountToGenerate, pattern: patternToUse });

        const rows: { coupon_book_id: number; code: string }[] = codes.map((code) => ({
          coupon_book_id: couponBookId,
          code,
        }));

        await transaction('codes').insert(rows);
      }
    });

    reply.status(201).send({ ok: true });
  });

  app.register(codesRoutes, { prefix: 'codes' });
  app.register(assignRoutes, { prefix: 'assign' });
  app.register(lockRoutes, { prefix: 'lock' });
  app.register(reedemRoutes, { prefix: 'redeem' });
}
