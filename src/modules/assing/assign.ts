import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../../database';

export async function assignRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    await knex.transaction(async (transaction) => {
      const users = await transaction('users').select('*');
      if (users.length === 0) throw new Error('No users found.');

      const codes = await transaction('codes').whereNull('assigned_user_id').andWhere('status', 'ACTIVE').select('*');
      if (codes.length === 0) throw new Error('No codes available for assignment.');

      const randomUser = users[Math.floor(Math.random() * users.length)];

      let randomCode = null;
      let attempts = 0;
      const maxAttempts = 10;
      while (!randomCode && attempts < maxAttempts) {
        const code = codes[Math.floor(Math.random() * codes.length)];
        if (!code) {
          attempts++;
          continue;
        }
        const couponBook = await transaction('coupon_books').where({ id: code.coupon_book_id, status: 'ACTIVE' }).first();
        if (couponBook) {
          randomCode = code;
        }
        attempts++;
      }

      if (!randomUser || !randomCode) throw new Error('No valid user or code found for assignment.');

      await transaction('codes').update({ assigned_user_id: randomUser.id }).where({ id: randomCode.id });

      const assignedCode = await transaction('codes')
        .select('id', 'code')
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
      if (!codeFiltred) throw new Error('The provided code is not valid or does not exist for assignment.');

      const users = await transaction('users').select('*');

      const randomUser = users[Math.floor(Math.random() * users.length)];
      if (!randomUser) throw new Error('No valid user found for assignment.');

      await transaction('codes').update({ assigned_user_id: randomUser.id }).where({ id: codeFiltred.id });

      const assignedCode = await transaction('codes')
        .select('id', 'code')
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
