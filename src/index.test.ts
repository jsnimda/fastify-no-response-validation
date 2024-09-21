import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler, type FastifyZodOpenApiTypeProvider } from 'fastify-zod-openapi';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { z } from 'zod';
import fastifyNoResponseValidation from './index.js';

const getFastify = () => Fastify().withTypeProvider<FastifyZodOpenApiTypeProvider>();

describe('fastify-no-response-validation', () => {
  let fastify: ReturnType<typeof getFastify>;

  beforeEach(async () => {
    fastify = getFastify();
    fastify.setValidatorCompiler(validatorCompiler);
    fastify.setSerializerCompiler(serializerCompiler);
  });

  afterEach(async () => {
    await fastify.close();
  });

  const schema = {
    response: {
      200: z.object({
        id: z.number(),
        name: z.string(),
      }),
    },
  };

  it('should validate response when plugin is not registered', async () => {
    fastify.get('/test', { schema }, () => {
      return { name: 'John', age: 30 } as any;
    });

    const response = await fastify.inject({
      method: 'GET',
      url: '/test',
    });

    expect(response.statusCode).toBe(500);
  });

  it('should bypass response validation when plugin is registered', async () => {
    await fastify.register(fastifyNoResponseValidation);

    fastify.get('/test', { schema }, () => {
      return { name: 'John', age: 30 } as any;
    });

    const response = await fastify.inject({
      method: 'GET',
      url: '/test',
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ name: 'John', age: 30 });
  });

  it('should still validate request after plugin is registered', async () => {
    await fastify.register(fastifyNoResponseValidation);

    const requestSchema = {
      body: z.object({
        id: z.number(),
      }),
    };

    fastify.post('/test', { schema: requestSchema }, (request) => {
      return request.body;
    });

    const response = await fastify.inject({
      method: 'POST',
      url: '/test',
      payload: { id: 'not a number' },
    });

    expect(response.statusCode).toBe(400);
  });

  it('should preserve property order in serialized output', async () => {
    await fastify.register(fastifyNoResponseValidation);

    fastify.get('/order', () => ({ c: 3, a: 1, b: 2 }));

    const response = await fastify.inject({
      method: 'GET',
      url: '/order',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe('{"c":3,"a":1,"b":2}');
  });

  it('should handle circular references by returning a 500 error', async () => {
    await fastify.register(fastifyNoResponseValidation);

    const circular: any = { a: 1 };
    circular.self = circular;

    fastify.get('/circular', () => circular);

    const response = await fastify.inject({
      method: 'GET',
      url: '/circular',
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toContain('Converting circular structure to JSON');
  });
});