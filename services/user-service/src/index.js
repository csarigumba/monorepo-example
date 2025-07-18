import { logger } from '@company/logger';
import { generateId, getCurrentTimestamp } from '@company/utils';

export const handler = async (event, context) => {
  logger.info('User Service Lambda invoked', {
    requestId: context.awsRequestId,
    event: event,
  });

  try {
    const id = generateId();
    const timestamp = getCurrentTimestamp();

    const response = {
      message: 'User service is working!',
      id: id,
      timestamp: timestamp,
      requestId: context.awsRequestId,
    };

    logger.info('Response generated successfully', {
      id,
      timestamp,
      requestId: context.awsRequestId,
    });

    return response;
  } catch (error) {
    logger.error('Error processing request', {
      error: error.message,
      requestId: context.awsRequestId,
    });

    throw error;
  }
};
