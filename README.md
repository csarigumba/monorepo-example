# Lambda Monorepo

A scalable monorepo structure for managing multiple Node.js applications deployed to AWS Lambda functions.

## 🏗️ Architecture Overview

This monorepo is designed with the following principles:

- **Modular Design**: Shared packages and independent services
- **Local Development**: AWS SAM for local testing and development
- **Simple Structure**: Minimal configuration for easy understanding
- **JavaScript**: ES6+ modules throughout the codebase
- **Best Practices**: ESLint, Prettier, and comprehensive testing

## 📁 Project Structure

```
/
├── services/              # Lambda function services
│   └── user-service/      # Example user management service
├── packages/              # Shared internal packages
│   ├── logger/           # Structured logging utility
│   └── utils/            # Common utility functions
├── template.yaml         # SAM template for deployment
├── CLAUDE.md            # AI assistant instructions
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and pnpm
- AWS CLI configured
- AWS SAM CLI
- Docker (for local development)

### Installation

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Build the project**:

   ```bash
   pnpm build
   ```

3. **Run tests**:
   ```bash
   pnpm test
   ```

### Local Development

1. **Build SAM application**:

   ```bash
   pnpm sam:build
   ```

2. **Start local API Gateway**:

   ```bash
   pnpm sam:local
   ```

3. **Invoke a specific function**:

   ```bash
   pnpm sam:invoke
   ```

## 📦 Package Management

This monorepo uses **pnpm** with workspaces for efficient dependency management:

- Shared dependencies are defined in the root `package.json`
- Package-specific dependencies are in each service/package
- Use `pnpm add <package>` to add dependencies
- Use `pnpm add <package> -w` to add to workspace root

## 🏗️ Building Services

Each service is built using **esbuild** for fast, optimized Lambda bundles:

```bash
# Build specific service
cd services/user-service
pnpm build

# Build all services
pnpm build
```

## 🚀 Deployment

### SAM Deployment

1. **Build the application**:

   ```bash
   pnpm sam:build
   ```

2. **Deploy to AWS**:

   ```bash
   sam deploy --guided
   ```

3. **Deploy with existing configuration**:
   ```bash
   sam deploy
   ```

## 📊 Monitoring & Logging

- **CloudWatch**: Automatic log aggregation for all Lambda functions
- **Structured Logging**: Using Winston with environment-based formatting

## 🔧 Development Commands

```bash
# Install dependencies
pnpm install

# Build all packages and services
pnpm build

# Run all tests
pnpm test

# Run linting
pnpm lint

# Clean build artifacts
pnpm clean
```

## 📚 Adding New Services

1. Create a new directory under `services/`
2. Copy the structure from `user-service`
3. Update `package.json` and implement your Lambda handler
4. Add the service to the root `template.yaml`
5. Update shared package dependencies as needed

## 🧪 Testing Strategy

- **Unit Tests**: Jest for individual function testing
- **Integration Tests**: SAM local for API testing

## 🔐 Security Best Practices

- IAM roles with least privilege access
- Input validation and sanitization
- Structured logging without sensitive data
- Environment-based configuration

## 📖 Additional Resources

- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [pnpm Workspaces](https://pnpm.io/workspaces)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

