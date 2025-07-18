# Terraform Infrastructure Deployment Guide

## Overview
This Terraform infrastructure creates IAM roles and DynamoDB tables for a serverless application across three environments: dev, staging, and prod.

## Prerequisites
- Terraform >= 1.0
- AWS CLI configured with appropriate credentials
- S3 buckets for Terraform state storage (see Backend Setup)
- DynamoDB tables for state locking (see Backend Setup)

## Backend Setup
Before deploying, create the required S3 buckets and DynamoDB tables for remote state:

```bash
# Create S3 buckets for each environment
aws s3api create-bucket --bucket test-dev-terraform-state --region ap-northeast-1 --create-bucket-configuration LocationConstraint=ap-northeast-1
aws s3api create-bucket --bucket test-staging-terraform-state --region ap-northeast-1 --create-bucket-configuration LocationConstraint=ap-northeast-1
aws s3api create-bucket --bucket test-prod-terraform-state --region ap-northeast-1 --create-bucket-configuration LocationConstraint=ap-northeast-1

# Enable versioning
aws s3api put-bucket-versioning --bucket test-dev-terraform-state --versioning-configuration Status=Enabled
aws s3api put-bucket-versioning --bucket test-staging-terraform-state --versioning-configuration Status=Enabled
aws s3api put-bucket-versioning --bucket test-prod-terraform-state --versioning-configuration Status=Enabled

# Create DynamoDB tables for state locking
aws dynamodb create-table --table-name test-dev-terraform-locks --attribute-definitions AttributeName=LockID,AttributeType=S --key-schema AttributeName=LockID,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region ap-northeast-1
aws dynamodb create-table --table-name test-staging-terraform-locks --attribute-definitions AttributeName=LockID,AttributeType=S --key-schema AttributeName=LockID,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region ap-northeast-1
aws dynamodb create-table --table-name test-prod-terraform-locks --attribute-definitions AttributeName=LockID,AttributeType=S --key-schema AttributeName=LockID,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region ap-northeast-1
```

## Global Configuration
Update the AWS Account ID in `global/terraform.tfvars`:

```hcl
# global/terraform.tfvars
project        = "test"
owner          = "ced"
aws_region     = "ap-northeast-1"
aws_account_id = "YOUR_AWS_ACCOUNT_ID"  # Replace with your actual AWS account ID
```

## Deployment Steps

### 1. Deploy IAM Layer (Layer 1)
Deploy IAM roles for each environment:

```bash
# Dev environment
cd environments/dev/iam
terraform init
terraform plan -var-file=../../../global/terraform.tfvars -var="environment=dev"
terraform apply -var-file=../../../global/terraform.tfvars -var="environment=dev"

# Staging environment
cd ../../staging/iam
terraform init
terraform plan -var-file=../../../global/terraform.tfvars -var="environment=staging"
terraform apply -var-file=../../../global/terraform.tfvars -var="environment=staging"

# Production environment
cd ../../prod/iam
terraform init
terraform plan -var-file=../../../global/terraform.tfvars -var="environment=prod"
terraform apply -var-file=../../../global/terraform.tfvars -var="environment=prod"
```

### 2. Deploy DynamoDB Layer (Layer 2)
Deploy DynamoDB tables for each environment:

```bash
# Dev environment
cd ../../dev/dynamodb
terraform init
terraform plan -var-file=../../../global/terraform.tfvars -var="environment=dev"
terraform apply -var-file=../../../global/terraform.tfvars -var="environment=dev"

# Staging environment
cd ../../staging/dynamodb
terraform init
terraform plan -var-file=../../../global/terraform.tfvars -var="environment=staging"
terraform apply -var-file=../../../global/terraform.tfvars -var="environment=staging"

# Production environment
cd ../../prod/dynamodb
terraform init
terraform plan -var-file=../../../global/terraform.tfvars -var="environment=prod"
terraform apply -var-file=../../../global/terraform.tfvars -var="environment=prod"
```

## Resources Created

### IAM Roles
- **Dev**: `test-dev-ced-lambda-role`
- **Staging**: `test-staging-ced-lambda-role`
- **Production**: `test-prod-ced-lambda-role`

Each role includes:
- Trust policy for Lambda service
- AWSLambdaBasicExecutionRole managed policy
- AmazonDynamoDBFullAccess managed policy
- CloudWatchLogsFullAccess managed policy

### DynamoDB Tables
- **Dev**: `test-dev-ced-ddb`
- **Staging**: `test-staging-ced-ddb`
- **Production**: `test-prod-ced-ddb`

Each table includes:
- Partition key: `uid` (String)
- Sort key: `survey_id` (String)
- Billing mode: On-demand
- Point-in-time recovery: Disabled (dev/staging), Enabled (prod)

## Testing
After deployment, verify the resources were created:

```bash
# Check IAM roles
aws iam get-role --role-name test-dev-ced-lambda-role
aws iam get-role --role-name test-staging-ced-lambda-role
aws iam get-role --role-name test-prod-ced-lambda-role

# Check DynamoDB tables
aws dynamodb describe-table --table-name test-dev-ced-ddb
aws dynamodb describe-table --table-name test-staging-ced-ddb
aws dynamodb describe-table --table-name test-prod-ced-ddb
```

## Cleanup
To destroy the infrastructure:

```bash
# Destroy in reverse order (DynamoDB first, then IAM)
cd environments/dev/dynamodb
terraform destroy -var-file=../../../global/terraform.tfvars -var="environment=dev"

cd ../iam
terraform destroy -var-file=../../../global/terraform.tfvars -var="environment=dev"

# Repeat for staging and prod environments
```

## Architecture
```
├── Layer 1 (IAM)
│   ├── Lambda execution roles
│   └── Managed policy attachments
└── Layer 2 (DynamoDB)
    ├── Survey data tables
    └── Remote state dependency on IAM layer
```

## Notes
- All resources are tagged with Project, Environment, Owner, and ManagedBy
- Remote state is stored in S3 with DynamoDB locking
- Cross-layer dependencies use remote state data sources
- Production environment has point-in-time recovery enabled for DynamoDB