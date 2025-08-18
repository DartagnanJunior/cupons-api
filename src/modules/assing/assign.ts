import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../../database';

export async function assignRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    await knex.transaction(async (transaction) => {
      const randomUser = await transaction('users').orderByRaw('RANDOM()').first();
      if (!randomUser) {
        return reply.status(404).send({ error: 'No users found.' });
      }

      const randomCode = await transaction('codes')
        .whereNull('assigned_user_id')
        .andWhere('status', 'ACTIVE')
        .whereExists(function () {
          this.select('*')
            .from('coupon_books')
            .whereRaw('coupon_books.id = codes.coupon_book_id')
            .andWhere('coupon_books.status', 'ACTIVE');
        })
        .orderByRaw('RANDOM()')
        .first();
      if (!randomCode) {
        return reply.status(404).send({ error: 'No codes available for assignment.' });
      }

      await transaction('codes').update({ assigned_user_id: randomUser.id }).where({ id: randomCode.id });

      const assignedCode = await transaction('codes')
        .select('*')
        .where({ id: randomCode.id, assigned_user_id: randomUser.id })
        .orderBy('id', 'desc')
        .first();

      reply.status(201).send({
        ok: true,
        assigned_code: assignedCode ?? null,
      });
    });
  });

  app.post('/:code', async (request, reply) => {
    const assingCodeToUser = z.object({
      code: z.string(),
    });

    const { code } = assingCodeToUser.parse(request.params);

    await knex.transaction(async (transaction) => {
      const codeFiltred = await transaction('codes').whereNull('assigned_user_id').andWhere('status', 'ACTIVE').andWhere({ code }).first();
      if (!codeFiltred) {
        return reply.status(404).send({ error: 'The provided code is not valid or does not exist for assignment.' });
      }

      const randomUser = await transaction('users').orderByRaw('RANDOM()').first();
      if (!randomUser) {
        return reply.status(404).send({ error: 'No users found.' });
      }

      await transaction('codes').update({ assigned_user_id: randomUser.id }).where({ id: codeFiltred.id });

      const assignedCode = await transaction('codes')
        .select('*')
        .where({ id: codeFiltred.id, assigned_user_id: randomUser.id })
        .orderBy('id', 'desc')
        .first();

      reply.status(201).send({
        ok: true,
        assigned_code: assignedCode ?? null,
      });
    });
  });
}
