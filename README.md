<div align="center">

# fastify-no-response-validation

[![NPM version](https://img.shields.io/npm/v/fastify-no-response-validation.svg?style=flat)](https://www.npmjs.com/package/fastify-no-response-validation)
[![NPM downloads](https://img.shields.io/npm/dm/fastify-no-response-validation.svg?style=flat)](https://www.npmjs.com/package/fastify-no-response-validation)
[![CI](https://github.com/jsnimda/fastify-no-response-validation/workflows/CI/badge.svg)](https://github.com/jsnimda/fastify-no-response-validation/actions)

Disable response validation in Fastify.

</div>

## Why This Plugin?

By default, Fastify doesn't validate responses unless you're using the [`@fastify/response-validation`](https://github.com/fastify/fastify-response-validation) plugin, which only supports AJV (Fastify's default validator). However, when working with Zod schemas, especially through [`fastify-zod-openapi`](https://github.com/samchungy/fastify-zod-openapi) or [`fastify-type-provider-zod`](https://github.com/turkerdev/fastify-type-provider-zod), response validation is automatically enabled.

This plugin disables response validation in Fastify. After applying this plugin:

1. Responses that don't match the defined schema won't trigger a 500 error
2. API can send data that doesn't strictly conform to the response schema
3. Schema documentation is preserved for API documentation purposes

## Pro Tip

When using this plugin, you don't need to include `fastify.setSerializerCompiler(serializerCompiler)` in your setup. The plugin takes care of serialization internally.

## Install

```bash
npm install fastify-no-response-validation
```

## Usage

```typescript
import Fastify from 'fastify';
import { validatorCompiler, type FastifyZodOpenApiTypeProvider } from 'fastify-zod-openapi';
import fastifyNoResponseValidation from 'fastify-no-response-validation';
import { z } from 'zod';

const fastify = Fastify().withTypeProvider<FastifyZodOpenApiTypeProvider>();

// Set up Zod validation
fastify.setValidatorCompiler(validatorCompiler);

// Register the plugin to disable response validation
fastify.register(fastifyNoResponseValidation);

// Define a route with a schema
fastify.get('/user', {
  schema: {
    response: {
      200: z.object({
        id: z.number(),
        name: z.string(),
      }),
    },
  },
}, (request, reply) => {
  // This response doesn't match the schema, but it will still be sent
  return { name: 'John', age: 30 } as any;
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log('Server is running on http://localhost:3000');
});
```

## Compatibility

This plugin is compatible with Fastify v4.x and v5.x.

## Contributing

Contributions, issues, and feature requests are welcome!

## License

This project is licensed under the MIT License.
