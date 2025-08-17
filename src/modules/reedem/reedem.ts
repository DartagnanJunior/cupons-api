import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../../database';

export async function reedemRoutes(app: FastifyInstance) {
  app.post('/:code', async (request, reply) => {
    const redeemCode = z.object({
      code: z.string(),
    });

    const { code } = redeemCode.parse(request.params);

    await knex.transaction(async (transaction) => {
      const codeFiltred = await transaction('codes').where({ code }).first();
      if (!codeFiltred) throw new Error('The provided code is not valid or does not exist for redeeming.');

      if (codeFiltred.status === 'LOCKED') throw new Error('The provided code is locked and cannot be redeemed.');

      if (codeFiltred.assigned_user_id === null) throw new Error('The provided code is not assigned to any user.');

      const coupon_book = await transaction(`coupon_books`).where({ id: codeFiltred.coupon_book_id }).first();
      if (!coupon_book) throw new Error('The provided code does not belong to a valid coupon book.');

      if (coupon_book?.redeemed_codes_amount_per_user <= codeFiltred.redeemed_times)
        throw new Error('The provided code has already been redeemed the maximum number of times.');

      await transaction('codes')
        .where({ id: codeFiltred.id })
        .increment('redeemed_times', 1)
        .update({ status: 'REDEEMED', is_permanent: true, redeemed_at: knex.fn.now() });

      const redeemedCode = await transaction('codes').select('id', 'code').where({ id: codeFiltred.id }).orderBy('id', 'desc').first();

      reply.status(201).send({
        ok: true,
        redeemedCode,
      });
    });
  });
}
