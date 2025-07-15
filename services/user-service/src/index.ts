import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';
import { logger } from '@company/logger';
import { UserService } from './handlers/user-handler';
import { createUserSchema, getUserSchema, updateUserSchema } from './schemas/user-schemas';

const userService = new UserService();

const baseHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
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

export const handler = middy(baseHandler)
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