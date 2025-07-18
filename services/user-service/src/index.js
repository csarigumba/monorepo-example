import { logger } from '@company/logger';
import { 
  generateId, 
  createSuccessResponse, 
  createErrorResponse, 
  validateEmail, 
  getCurrentTimestamp,
  sanitizeInput 
} from '@company/utils';

export const handler = async (event, context) => {
  logger.info('User Service Lambda invoked', {
    requestId: context.awsRequestId,
    event: event
  });

  try {
    const { httpMethod, path, body } = event;
    
    // Example: Handle different HTTP methods
    switch (httpMethod) {
      case 'POST':
        return await handleCreateUser(body, context);
      case 'GET':
        return await handleGetUser(event.pathParameters, context);
      default:
        logger.warn('Unsupported HTTP method', { method: httpMethod });
        return {
          statusCode: 405,
          body: JSON.stringify(createErrorResponse('Method not allowed'))
        };
    }
  } catch (error) {
    logger.error('Error processing request', { 
      error: error.message, 
      requestId: context.awsRequestId 
    });
    
    return {
      statusCode: 500,
      body: JSON.stringify(createErrorResponse('Internal server error'))
    };
  }
};

const handleCreateUser = async (body, context) => {
  try {
    const userData = JSON.parse(body || '{}');
    const { email, name } = userData;
    
    // Validate input using utils
    if (!email || !validateEmail(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify(createErrorResponse('Invalid email address'))
      };
    }
    
    if (!name || name.trim().length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify(createErrorResponse('Name is required'))
      };
    }
    
    // Create user with generated ID and sanitized input
    const userId = generateId();
    const sanitizedName = sanitizeInput(name);
    
    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      name: sanitizedName,
      createdAt: getCurrentTimestamp(),
      status: 'active'
    };
    
    logger.info('User created successfully', { 
      userId, 
      email: newUser.email,
      requestId: context.awsRequestId 
    });
    
    return {
      statusCode: 201,
      body: JSON.stringify(createSuccessResponse(newUser, 'User created successfully'))
    };
    
  } catch (error) {
    logger.error('Error creating user', { error: error.message });
    return {
      statusCode: 400,
      body: JSON.stringify(createErrorResponse('Invalid request body'))
    };
  }
};

const handleGetUser = async (pathParameters, context) => {
  const userId = pathParameters?.id;
  
  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify(createErrorResponse('User ID is required'))
    };
  }
  
  // Mock user data for demonstration
  const mockUser = {
    id: userId,
    email: 'user@example.com',
    name: 'John Doe',
    createdAt: getCurrentTimestamp(),
    status: 'active'
  };
  
  logger.info('User retrieved successfully', { 
    userId, 
    requestId: context.awsRequestId 
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify(createSuccessResponse(mockUser, 'User retrieved successfully'))
  };
};