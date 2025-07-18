const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const httpEventNormalizer = require('@middy/http-event-normalizer');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const validator = require('@middy/validator');
const { transpileSchema } = require('@middy/validator/transpile');
const { logger } = require('@company/logger');
const { UserService } = require('./handlers/user-handler');

const userService = new UserService();

const baseHandler = async (event, context) => {
  const { httpMethod, pathParameters, body } = event;
  const userId = pathParameters?.userId;

  logger.info('Processing request', {
    method: httpMethod,
    path: event.path,
    userId,
    requestId: context.awsRequestId,
  });

  try {
    switch (httpMethod) {
      case 'GET':
        if (userId) {
          const user = await userService.getUser(userId);
          return {
            statusCode: 200,
            body: JSON.stringify(user),
          };
        }
        const users = await userService.getAllUsers();
        return {
          statusCode: 200,
          body: JSON.stringify(users),
        };

      case 'POST':
        const newUser = await userService.createUser(body);
        return {
          statusCode: 201,
          body: JSON.stringify(newUser),
        };

      case 'PUT':
        if (!userId) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'User ID is required' }),
          };
        }
        const updatedUser = await userService.updateUser(userId, body);
        return {
          statusCode: 200,
          body: JSON.stringify(updatedUser),
        };

      case 'DELETE':
        if (!userId) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'User ID is required' }),
          };
        }
        await userService.deleteUser(userId);
        return {
          statusCode: 204,
          body: '',
        };

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    logger.error('Error processing request', {
      error: error instanceof Error ? error.message : 'Unknown error',
      requestId: context.awsRequestId,
    });
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

module.exports.handler = middy(baseHandler)
  .use(httpEventNormalizer())
  .use(httpJsonBodyParser())
  .use(httpErrorHandler())
  .use(
    validator({
      eventSchema: transpileSchema({
        type: 'object',
        properties: {
          httpMethod: { type: 'string' },
          pathParameters: {
            type: 'object',
            properties: {
              userId: { type: 'string' },
            },
          },
        },
        required: ['httpMethod'],
      }),
    })
  );
