import Fastify from 'fastify';
import mercurius from 'mercurius';
import { schema, resolvers, Context } from './models';

const app = Fastify();

// Register Mercurius
app.register(mercurius, {
  schema,
  resolvers,
  graphiql: true, // habilita playground
  path: '/graphql',
  ide: true,
  context: (request, reply): Context => ({ request, reply }),
});

// Start
const start = async () => {
  try {
    await app.listen({ port: 4000 });
    console.log('🚀 Server ready at http://localhost:4000/graphiql');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
