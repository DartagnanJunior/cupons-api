import fastify from 'fastify';
import { env } from './env';
import { couponsRoutes } from './modules/coupons/coupons';
import { usersRoutes } from './modules/users/users';

import cron from 'node-cron';
import { unlockExpiredCodes } from './modules/lock/lock';

const app = fastify();

app.register(usersRoutes, { prefix: 'users' });
app.register(couponsRoutes, { prefix: 'coupons' });

cron.schedule('*/10 * * * *', async () => {
  try {
    await unlockExpiredCodes();
  } catch (err) {
    console.error('Erro ao desbloquear códigos expirados:', err);
  }
});

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP Server running!');
});
