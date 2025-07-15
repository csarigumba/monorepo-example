# Deployment Guide

This guide covers deployment strategies and best practices for the Lambda monorepo.

## 🏗️ Infrastructure Overview

The infrastructure is managed using Terraform with the following components:

- **Lambda Functions**: Individual services deployed as Lambda functions
- **API Gateway**: REST API for HTTP endpoints
- **DynamoDB**: NoSQL database for data storage
- **CloudWatch**: Logging and monitoring
- **IAM Roles**: Least privilege access control

## 🚀 Deployment Environments

### Development (`dev`)
- **Purpose**: Development and testing
- **Auto-deployment**: On push to `main` branch
- **Resources**: Minimal, cost-optimized
- **Monitoring**: Basic CloudWatch logs

### Staging (`staging`)
- **Purpose**: Pre-production testing
- **Deployment**: Manual trigger or release branches
- **Resources**: Production-like configuration
- **Monitoring**: Enhanced logging and metrics

### Production (`production`)
- **Purpose**: Live production environment
- **Deployment**: Manual approval required
- **Resources**: Optimized for performance and reliability
- **Monitoring**: Full observability stack

## 📦 Build Process

### 1. Package Building
```bash
# Build shared packages first
cd packages && pnpm build

# Build services
cd services && pnpm build
```

### 2. Lambda Packaging
Each service is packaged using esbuild:
- **Bundle**: Single file output
- **Minification**: Optimized for Lambda cold starts
- **Tree-shaking**: Remove unused code
- **External dependencies**: AWS SDK excluded

### 3. Deployment Artifacts
- **ZIP files**: Created for each Lambda function
- **Terraform plans**: Infrastructure changes
- **CloudFormation templates**: For SAM deployment

## 🔧 Deployment Scripts

### Manual Deployment
```bash
# Deploy to development
./scripts/deploy.sh --environment dev

# Deploy to staging with plan review
./scripts/deploy.sh --environment staging --plan-only
./scripts/deploy.sh --environment staging

# Deploy to production with auto-approval
./scripts/deploy.sh --environment production --auto-approve
```

### CI/CD Deployment
GitHub Actions automatically:
1. Run tests and linting
2. Build packages and services
3. Deploy to target environment
4. Run post-deployment tests
5. Send notifications

## 📊 Monitoring & Rollback

### Health Checks
- **API Gateway**: Built-in health monitoring
- **Lambda Functions**: CloudWatch metrics
- **DynamoDB**: Performance insights

### Rollback Strategy
```bash
# Rollback using Terraform
cd infra/environments/production
terraform plan -destroy
terraform apply

# Rollback specific service
terraform destroy -target=module.user_service
```

## 🔐 Security Considerations

### IAM Policies
- **Least Privilege**: Minimal required permissions
- **Resource-specific**: Scoped to specific resources
- **Environment-isolated**: No cross-environment access

### Secrets Management
- **AWS Secrets Manager**: For sensitive data
- **Parameter Store**: For configuration
- **Environment Variables**: For non-sensitive config

### Network Security
- **VPC**: Optional for enhanced security
- **Security Groups**: Restrict network access
- **WAF**: Web Application Firewall for APIs

## 🧪 Testing in Production

### Blue-Green Deployment
```bash
# Deploy to staging slot
terraform apply -var="slot=staging"

# Switch traffic after validation
terraform apply -var="slot=production"
```

### Canary Deployment
- **API Gateway**: Weighted routing
- **Lambda Aliases**: Version-based routing
- **CloudWatch Alarms**: Automatic rollback

## 📈 Performance Optimization

### Lambda Optimization
- **Memory sizing**: Based on CPU requirements
- **Timeout configuration**: Service-specific
- **Concurrency limits**: Prevent resource exhaustion

### DynamoDB Optimization
- **Read/Write capacity**: Auto-scaling enabled
- **Global Secondary Indexes**: Query optimization
- **Streams**: Event-driven processing

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf node_modules .pnpm-store
   pnpm install
   pnpm build
   ```

2. **Deployment Failures**
   ```bash
   # Check Terraform state
   terraform plan
   terraform refresh
   ```

3. **Runtime Errors**
   ```bash
   # Check CloudWatch logs
   aws logs tail /aws/lambda/function-name --follow
   ```

### Debugging Tools
- **AWS X-Ray**: Distributed tracing
- **CloudWatch Insights**: Log analysis
- **SAM Local**: Local debugging

## 📚 Best Practices

### Code Organization
- **Single responsibility**: One function per service
- **Shared packages**: Common utilities
- **Type safety**: TypeScript throughout

### Infrastructure
- **Immutable deployments**: No in-place updates
- **Version control**: All infrastructure as code
- **Environment parity**: Consistent across environments

### Operations
- **Automated testing**: Pre-deployment validation
- **Health monitoring**: Proactive alerting
- **Documentation**: Keep deployment docs updated