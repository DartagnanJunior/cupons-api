import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../../database';

export async function unlockExpiredCodes() {
  const now = knex.fn.now();
  const updated = await knex('codes')
    .where('status', 'LOCKED')
    .andWhere('locked_until', '<', now)
    .update({ status: 'ACTIVE', locked_until: null });
  if (updated > 0) {
    console.log(`${updated} code(s) unlocked automatically.`);
  }
}

export async function lockRoutes(app: FastifyInstance) {
  app.post('/:code', async (request, reply) => {
    const lockCode = z.object({
      code: z.string(),
    });

    const { code } = lockCode.parse(request.params);

    await knex.transaction(async (transaction) => {
      const codeFiltred = await transaction('codes').where({ code }).first();
      if (!codeFiltred) {
        return reply.status(404).send({ error: 'The provided code is not valid or does not exist for locking.' });
      }

      if (codeFiltred.assigned_user_id === null) {
        return reply.status(400).send({ error: 'The provided code is not assigned to any user.' });
      }

      if (codeFiltred.status === 'LOCKED') {
        return reply.status(409).send({ error: 'The provided code is already locked.' });
      }

      if (codeFiltred.is_permanent) {
        return reply.status(403).send({ error: 'The provided code is permanently locked and its status cannot be changed.' });
      }

      await transaction('codes')
        .update({
          status: 'LOCKED',
          locked_until: transaction.raw("DATETIME('now', '+30 minutes')"),
        })
        .where({ id: codeFiltred.id });

      const lockedCode = await transaction('codes').select('*').where({ id: codeFiltred.id }).orderBy('id', 'desc').first();

      reply.status(201).send({
        ok: true,
        lockedCode,
      });
    });
  });
}
