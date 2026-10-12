import Fastify from 'fastify';
import cors from '@fastify/cors';
import sessionRoutes from './routes/sessions';

const fastify = Fastify({
  logger: true
});

fastify.register(cors, {
  origin: 'http://localhost:5173'
});

fastify.register(sessionRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server is running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
