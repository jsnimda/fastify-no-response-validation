import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const fastifyNoResponseValidation: FastifyPluginAsync = async (fastify) => {
  fastify.setSerializerCompiler(() => JSON.stringify);
};

export default fp(fastifyNoResponseValidation, {
  fastify: '>=4',
  name: 'fastify-no-response-validation'
});