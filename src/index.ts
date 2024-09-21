import fp from 'fastify-plugin';
import stringify from 'safe-stable-stringify';

const fastifyNoResponseValidation = fp(async (fastify, opts) => {
  fastify.setSerializerCompiler(() => stringify);
});

export default fastifyNoResponseValidation;