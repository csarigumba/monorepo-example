# Backend Setup Guide

This guide explains how to set up the S3 backend for Terraform state management.

## Overview

Terraform uses remote state to store the state file in a shared location. This setup uses:
- **S3 buckets** for storing state files
- **DynamoDB tables** for state locking

## Prerequisites

- AWS CLI configured with appropriate permissions
- Terraform installed

## Setup Instructions

### 1. Create S3 Buckets

Create S3 buckets for each environment:

```bash
# Development environment
aws s3 mb s3://mg-dev-terraform-state --region us-east-1

# Staging environment
aws s3 mb s3://mg-stg-terraform-state --region us-east-1

# Production environment
aws s3 mb s3://mg-prd-terraform-state --region us-east-1
```

### 2. Enable S3 Bucket Versioning

```bash
# Development
aws s3api put-bucket-versioning \
    --bucket mg-dev-terraform-state \
    --versioning-configuration Status=Enabled

# Staging
aws s3api put-bucket-versioning \
    --bucket mg-stg-terraform-state \
    --versioning-configuration Status=Enabled

# Production
aws s3api put-bucket-versioning \
    --bucket mg-prd-terraform-state \
    --versioning-configuration Status=Enabled
```

### 3. Enable S3 Bucket Encryption

```bash
# Development
aws s3api put-bucket-encryption \
    --bucket mg-dev-terraform-state \
    --server-side-encryption-configuration '{
        "Rules": [
            {
                "ApplyServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                }
            }
        ]
    }'

# Staging
aws s3api put-bucket-encryption \
    --bucket mg-stg-terraform-state \
    --server-side-encryption-configuration '{
        "Rules": [
            {
                "ApplyServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                }
            }
        ]
    }'

# Production
aws s3api put-bucket-encryption \
    --bucket mg-prd-terraform-state \
    --server-side-encryption-configuration '{
        "Rules": [
            {
                "ApplyServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                }
            }
        ]
    }'
```

### 4. Create DynamoDB Tables for State Locking

```bash
# Development
aws dynamodb create-table \
    --table-name mg-dev-terraform-locks \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1

# Staging
aws dynamodb create-table \
    --table-name mg-stg-terraform-locks \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1

# Production
aws dynamodb create-table \
    --table-name mg-prd-terraform-locks \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

### 5. Block Public Access (Security Best Practice)

```bash
# Development
aws s3api put-public-access-block \
    --bucket mg-dev-terraform-state \
    --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# Staging
aws s3api put-public-access-block \
    --bucket mg-stg-terraform-state \
    --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# Production
aws s3api put-public-access-block \
    --bucket mg-prd-terraform-state \
    --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

## Verification

Verify the setup:

```bash
# Check S3 buckets
aws s3 ls | grep terraform-state

# Check DynamoDB tables
aws dynamodb list-tables | grep terraform-locks
```

## Cleanup (Optional)

To remove the backend infrastructure:

```bash
# Delete DynamoDB tables
aws dynamodb delete-table --table-name mg-dev-terraform-locks
aws dynamodb delete-table --table-name mg-stg-terraform-locks
aws dynamodb delete-table --table-name mg-prd-terraform-locks

# Delete S3 buckets (must be empty first)
aws s3 rb s3://mg-dev-terraform-state --force
aws s3 rb s3://mg-stg-terraform-state --force
aws s3 rb s3://mg-prd-terraform-state --force
```

## Notes

- S3 bucket names must be globally unique
- Adjust bucket names if conflicts occur
- Consider adding lifecycle policies for state file retention
- Use IAM policies to restrict access to state buckets
