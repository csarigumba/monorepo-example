# User Service

A serverless Lambda function for user management operations, built with AWS SAM and Node.js.

## Overview

The User Service provides REST API endpoints for managing users with full CRUD operations. It uses AWS Lambda for compute, API Gateway for HTTP routing, and DynamoDB for data storage.

## Features

- **Create User**: POST endpoint to create new users with validation
- **Get User**: GET endpoint to retrieve user by ID
- **User Validation**: Email validation and input sanitization
- **Structured Logging**: Comprehensive logging using @company/logger
- **Error Handling**: Consistent error responses and proper HTTP status codes
- **Local Development**: SAM Local support for offline development

## API Endpoints

### Create User
- **Method**: POST
- **Path**: `/users`
- **Body**: 
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```
- **Response**: 201 Created with user object

### Get User
- **Method**: GET
- **Path**: `/users/{userId}`
- **Response**: 200 OK with user object

### Additional Endpoints (Template Configured)
- **GET** `/users` - List users
- **PUT** `/users/{userId}` - Update user
- **DELETE** `/users/{userId}` - Delete user

## Architecture

### Dependencies
- **@company/logger**: Structured logging utility
- **@company/utils**: Common utility functions (ID generation, validation, response formatting)
- **AWS Lambda**: Serverless compute
- **AWS API Gateway**: HTTP API routing
- **AWS DynamoDB**: NoSQL database storage

### Data Structure
```javascript
{
  id: "generated-uuid",
  email: "user@example.com",
  name: "John Doe",
  createdAt: "2024-01-01T00:00:00Z",
  status: "active"
}
```

## Development

### Prerequisites
- Node.js 22+
- pnpm
- AWS SAM CLI

### Local Development Commands

```bash
# Install dependencies
pnpm install

# Build the service
pnpm build

# Run tests
pnpm test

# Build SAM template
pnpm sam:build

# Start local API Gateway
pnpm sam:local

# Test create user locally
pnpm sam:invoke

# Test get user locally
pnpm sam:invoke:get

# Full development workflow
pnpm dev
```

### Testing Locally

1. **Start local API Gateway**:
   ```bash
   pnpm sam:local
   ```

2. **Test with curl**:
   ```bash
   # Create user
   curl -X POST http://localhost:3000/users \
     -H "Content-Type: application/json" \
     -d '{"name": "John Doe", "email": "john@example.com"}'
   
   # Get user
   curl http://localhost:3000/users/123
   ```

3. **Test with SAM invoke**:
   ```bash
   # Create user
   pnpm sam:invoke
   
   # Get user
   pnpm sam:invoke:get
   ```

## Configuration

### Environment Variables
- `NODE_ENV`: Environment (dev/staging/production)
- `USERS_TABLE`: DynamoDB table name
- `AWS_NODEJS_CONNECTION_REUSE_ENABLED`: Connection optimization

### SAM Template
The `template.yaml` defines:
- Lambda function configuration
- API Gateway routes
- DynamoDB table with Pay-Per-Request billing
- IAM permissions for DynamoDB access

## Project Structure

```
user-service/
├── src/
│   └── index.js          # Lambda handler and business logic
├── devfiles/
│   ├── event.json        # Sample POST event for testing
│   └── get-event.json    # Sample GET event for testing
├── dist/                 # Built output (esbuild)
├── template.yaml         # SAM template for infrastructure
├── jest.config.js        # Jest testing configuration
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## Build Process

The service uses esbuild for fast bundling:
- **Input**: `src/index.js`
- **Output**: `dist/index.js`
- **Target**: Node.js 22
- **External**: AWS SDK (provided by Lambda runtime)

## Error Handling

The service implements comprehensive error handling:
- **Validation Errors**: 400 Bad Request for invalid input
- **Not Found**: 404 for missing resources
- **Method Not Allowed**: 405 for unsupported HTTP methods
- **Internal Errors**: 500 for unexpected errors
- **Structured Logging**: All errors logged with request context

## Testing

- **Jest Configuration**: Configured for Node.js environment
- **Module Mapping**: Resolves @company/* packages to workspace sources
- **Test Files**: Supports `*.test.js` and `*.spec.js` patterns
- **Coverage**: Configured for source code coverage reporting

## Deployment

```bash
# Build for deployment
pnpm build

# Deploy with SAM
sam deploy --guided
```

## Future Enhancements

- Add remaining CRUD operations (GET /users, PUT, DELETE)
- Implement database persistence (currently uses mock data)
- Add input validation schemas
- Implement user authentication
- Add integration tests
- Add API documentation (OpenAPI/Swagger)