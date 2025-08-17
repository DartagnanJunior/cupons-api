import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../../database';

export async function lockRoutes(app: FastifyInstance) {
  app.post('/:code', async (request, reply) => {
    const lockCode = z.object({
      code: z.string(),
    });

    const { code } = lockCode.parse(request.params);

    await knex.transaction(async (transaction) => {
      const codeFiltred = await transaction('codes').where({ code }).first();
      if (!codeFiltred) throw new Error('The provided code is not valid or does not exist for locking.');
      
      if (codeFiltred.assigned_user_id === null) throw new Error('The provided code is not assigned to any user.');

      if (codeFiltred.status === 'LOCKED') throw new Error('The provided code is alredy locked.');

      if (codeFiltred.is_permanent) throw new Error('The provided code is permanently locked and its status cannot be changed.');

      await transaction('codes').update({ status: 'LOCKED' }).where({ id: codeFiltred.id });

      const lockedCode = await transaction('codes').select('id', 'code').where({ id: codeFiltred.id }).orderBy('id', 'desc').first();

      reply.status(201).send({
        ok: true,
        lockedCode,
      });
    });
  });
}
