import fastify from 'fastify';
import { env } from './env';
import { cuponsRoutes } from './routes/cupons';
import { usersRoutes } from './routes/users';

const app = fastify();

app.register(usersRoutes, { prefix: 'users' });
app.register(cuponsRoutes, { prefix: 'cupons' });

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP Server running!');
});
