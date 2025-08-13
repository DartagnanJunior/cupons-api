import fastify from 'fastify';
import { env } from './env';
import { couponsRoutes } from './routes/coupons';
import { usersRoutes } from './routes/users';

const app = fastify();

app.register(usersRoutes, { prefix: 'users' });
app.register(couponsRoutes, { prefix: 'coupons' });

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP Server running!');
});
