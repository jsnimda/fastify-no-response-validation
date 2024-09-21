import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.setSerializerCompiler(() => JSON.stringify);
};

const fastifyNoResponseValidation = fp(plugin, {
  fastify: '>=4',
  name: 'fastify-no-response-validation'
});

export default fastifyNoResponseValidation;