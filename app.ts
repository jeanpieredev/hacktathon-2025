import fastify from 'fastify';

const app = fastify({ logger: true });

const schema = `
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: async () => 'Hello, Fastify with GraphQL!',
  },
};

app.register(import('mercurius'), {
  schema,
  resolvers,
  graphiql: true,
});

const start = async () => {
  try {
    const PORT = 3000;
    await app.listen({ port: PORT });
    console.log(`Server running at http://localhost:${PORT}/graphql`);
    console.log(`GraphiQL available at http://localhost:${PORT}/graphiql`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
