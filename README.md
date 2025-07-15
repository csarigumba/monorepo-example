# Lambda Monorepo

A scalable monorepo structure for managing multiple Node.js applications deployed to AWS Lambda functions.

## 🏗️ Architecture Overview

This monorepo is designed with the following principles:

- **Modular Design**: Shared packages and independent services
- **Infrastructure as Code**: Terraform for AWS resource management
- **Local Development**: AWS SAM for local testing and development
- **CI/CD Ready**: GitHub Actions for automated testing and deployment
- **Type Safety**: TypeScript throughout the codebase
- **Best Practices**: ESLint, Prettier, and comprehensive testing

## 📁 Project Structure

```
/
├── services/              # Lambda function services
│   └── user-service/      # Example user management service
├── packages/              # Shared internal packages
│   ├── logger/           # Structured logging utility
│   ├── types/            # Shared TypeScript types
│   ├── utils/            # Common utility functions
│   ├── database/         # Database connection utilities
│   └── auth/             # Authentication utilities
├── infra/                # Terraform infrastructure
│   ├── modules/          # Reusable Terraform modules
│   └── environments/     # Environment-specific configurations
├── scripts/              # Build and deployment scripts
├── .github/              # CI/CD workflows
├── docs/                 # Documentation
└── config/               # Shared configurations
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- AWS CLI configured
- Terraform 1.6+
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

1. **Start local API Gateway**:
   ```bash
   ./scripts/local-dev.sh --mode api --port 3000
   ```

2. **Invoke a specific function**:
   ```bash
   ./scripts/local-dev.sh --mode invoke --service user-service
   ```

3. **Build SAM application**:
   ```bash
   ./scripts/local-dev.sh --mode build
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

### Manual Deployment

1. **Deploy to development**:
   ```bash
   ./scripts/deploy.sh --environment dev
   ```

2. **Deploy to staging**:
   ```bash
   ./scripts/deploy.sh --environment staging
   ```

3. **Deploy to production**:
   ```bash
   ./scripts/deploy.sh --environment production --auto-approve
   ```

### CI/CD Deployment

Deployments are automated via GitHub Actions:

- **Pull Requests**: Run tests and linting
- **Push to main**: Deploy to development environment
- **Manual trigger**: Deploy to any environment

## 📊 Monitoring & Logging

- **CloudWatch**: Automatic log aggregation for all Lambda functions
- **X-Ray**: Distributed tracing (can be enabled per function)
- **Structured Logging**: Using Winston with JSON formatting in production

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

# Run type checking
pnpm typecheck

# Clean build artifacts
pnpm clean
```

## 📚 Adding New Services

1. Create a new directory under `services/`
2. Copy the structure from `user-service`
3. Update `package.json` and implement your Lambda handler
4. Add Terraform configuration in `infra/environments/`
5. Update CI/CD workflows if needed

## 🧪 Testing Strategy

- **Unit Tests**: Jest for individual function testing
- **Integration Tests**: SAM local for API testing
- **E2E Tests**: Post-deployment validation

## 🔐 Security Best Practices

- IAM roles with least privilege access
- Secrets managed via AWS Secrets Manager
- Environment variables via AWS Systems Manager Parameter Store
- Security scanning with Snyk in CI/CD

## 📖 Additional Resources

- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.