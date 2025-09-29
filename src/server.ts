import Fastify from 'fastify';
import mercurius from 'mercurius';
import { schema } from './graphql/schema';
import { createContext } from './context';
import { createAuthContext } from './auth/middleware';

const app = Fastify();

// Register Mercurius con Pothos schema
app.register(mercurius, {
  schema,
  graphiql: true, // habilita playground
  path: '/graphql',
  ide: true,
  context: async (request, reply) => {
    const authContext = await createAuthContext(request, reply);
    const baseContext = createContext();
    return {
      ...baseContext,
      ...authContext,
      request,
      reply,
    };
  },
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
