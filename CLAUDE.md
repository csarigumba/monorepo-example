# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
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

### Build Scripts
```bash
# Full build with tests and linting
./scripts/build.sh

# Local development with SAM
./scripts/local-dev.sh --mode api --port 3000
./scripts/local-dev.sh --mode invoke --service user-service
./scripts/local-dev.sh --mode build
```

### Service-Specific Commands
```bash
# Build specific service
cd services/user-service
pnpm build

# Run service tests
cd services/user-service
pnpm test

# Service uses esbuild for bundling JavaScript
# Output: dist/index.js (bundled for Lambda)
```

## Architecture Overview

### Monorepo Structure
- **services/**: Lambda function services (independently deployable)
- **packages/**: Shared internal packages (@company/logger, @company/types, etc.)
- **infra/**: Terraform infrastructure modules and environments
- **scripts/**: Build and deployment automation

### Key Technologies
- **Package Manager**: pnpm with workspaces
- **Build Tool**: esbuild for Lambda bundling
- **Runtime**: Node.js 18+
- **Language**: JavaScript (ES6+)
- **Infrastructure**: Terraform + AWS SAM (SAM for local dev, Terraform for deployment)
- **Database**: DynamoDB with single-table design patterns
- **Testing**: Jest

### Service Architecture Pattern
Each service follows this structure:
```
service/
├── src/
│   ├── index.js         # Lambda handler entry point
│   ├── handlers/        # Business logic handlers
│   ├── schemas/         # Input/output validation (Zod)
│   └── utils/           # Service-specific utilities
├── tests/               # Jest tests
├── template.yaml        # SAM template for local development
└── package.json         # Service dependencies
```

### Shared Package Dependencies
Services depend on shared packages in this hierarchy:
- Services → @company/utils, @company/types, @company/logger
- All packages use workspace references (`workspace:*`)
- Dependencies managed via pnpm catalog for version consistency

## Development Workflow

### Adding New Services
1. Create directory under `services/`
2. Copy structure from `user-service`
3. Update `package.json` with service-specific dependencies
4. Implement Lambda handler in `src/index.js`
5. Add Terraform configuration in `infra/environments/`

### Testing Strategy
- **Unit Tests**: Jest for individual functions
- **Integration Tests**: SAM local for API testing
- **Build includes**: Type checking, linting, and all tests

### Infrastructure
- **Terraform**: Infrastructure as Code in `infra/`
- **Environments**: dev/staging/production in separate directories
- **SAM**: Local development and testing only
- **Deployment**: Use `./scripts/deploy.sh` with environment flags

## Important Notes

### Build Requirements
- Always run `pnpm build` before deployment
- Services use esbuild with external AWS SDK
- Build process includes bundling, linting, and testing
- Clean previous builds with `pnpm clean`

### Dependencies
- Use `pnpm add <package>` for service-specific dependencies
- Use `pnpm add <package> -w` for workspace root dependencies
- Shared packages use `workspace:*` references
- AWS SDK is external (not bundled) for Lambda optimization

### Authentication & Security
- JWT-based authentication with middleware pattern
- IAM roles with least privilege access
- Environment variables via AWS Systems Manager Parameter Store
- Secrets via AWS Secrets Manager