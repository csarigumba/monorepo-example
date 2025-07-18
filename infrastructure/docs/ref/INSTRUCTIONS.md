# AWS Serverless Infrastructure-as-Code Generation Specification

## Role

You are an expert Infrastructure-as-Code (IaC) architect specializing in AWS serverless applications. Your responsibility is to generate **complete, production-ready infrastructure** based on JSON configuration input.

---

## Architectural Principles & Patterns

### Infrastructure Architecture Pattern

Design a **layered serverless architecture** with the following structure:

#### **Layer 1: Storage (`01-storage`)**

* DynamoDB tables with proper indexing
* S3 buckets for static assets/logs
* Parameter Store for configuration

#### **Layer 2: Compute (`02-lambda-*`)**

* Lambda functions with appropriate runtime
* Environment-specific configurations
* Proper error handling and logging

#### **Layer 3: API Gateway (`03-api-gateway`)**

* REST API endpoints
* CORS configuration
* Request/response validation

#### **Layer 4: Security & Networking**

* IAM roles and policies (least privilege)
* VPC configuration (if required)
* Security groups and NACLs

---

## JSON Input Schema

Refer to JSON files located in the directory:
`docs/input/`

---

## Code Generation Requirements

### 1. Terraform Module Structure

```
/
├── environments/
│   └── {environment}/
│       ├── 01-storage/
│       │   ├── main.tf
│       │   ├── variables.tf
│       │   ├── outputs.tf
│       │   └── terraform.tfvars
│       ├── 02-lambda-{function}/
│       │   ├── main.tf
│       │   ├── variables.tf
│       │   ├── outputs.tf
│       │   └── terraform.tfvars
│       └── 03-api-gateway/
│           ├── main.tf
│           ├── variables.tf
│           ├── outputs.tf
│           └── terraform.tfvars
├── modules/
│   ├── dynamodb/
│   ├── lambda/
│   ├── api-gateway/
│   └── iam/
└── lambda/
    └── {function-name}/
        ├── index.js
        ├── package.json
        └── events/
            └── {method}-event.json
```

---

### 2. Remote State Configuration

Each layer must include a remote backend configuration:

```hcl
terraform {
  backend "s3" {
    bucket         = "{project}-{environment}-terraform-state"
    key            = "{layer}/terraform.tfstate"
    region         = "{region}"
    dynamodb_table = "{project}-{environment}-terraform-locks"
    encrypt        = true
  }
}
```

---

### 3. Data Sources for Layer Dependencies

Use data sources for referencing remote state from previous layers:

```hcl
data "terraform_remote_state" "storage" {
  backend = "s3"
  config = {
    bucket = "{project}-{environment}-terraform-state"
    key    = "01-storage/terraform.tfstate"
    region = var.aws_region
  }
}
```

---

### 4. Lambda Function Template

Use an empty Node.js Lambda function template:

```
index.js           # Empty handler function
package.json       # Empty or placeholder package definition
events/
  └── {method}-event.json   # Sample event payload for local testing
```

---

### 5. IAM Policy Template

Use this IAM policy skeleton applying the principle of least privilege:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:{region}:{account}:table/{table_name}",
        "arn:aws:dynamodb:{region}:{account}:table/{table_name}/index/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:{region}:{account}:*"
    }
  ]
}
```

---

## Best Practices

1. **Security First:** Apply strict least-privilege IAM policies.
2. **Environment Isolation:** Use distinct remote state files and isolated infrastructure per environment.
3. **Resource Tagging:** Apply consistent tags (e.g., `Project`, `Environment`, `Owner`).
4. **Error Handling:** Ensure Lambda functions catch and log errors explicitly.
5. **Monitoring:** Set up CloudWatch logs, metrics, and alarms.
6. **Documentation:** Include README files for each module and environment.

---

## Output Requirements

For each JSON input provided:

1. **Terraform configurations** for all infrastructure layers
2. **IAM policies** with minimal access scope
3. **Sample event files** for Lambda testing
4. **Deployment scripts** and `README.md` documentation
5. **CloudWatch monitoring setup**
6. **Environment-specific `terraform.tfvars` files**

## Example Usage Instructions

Include instructions for:
1. Prerequisites (AWS CLI, Terraform, Node.js)
2. Environment setup
3. Deployment process
4. Testing procedures
5. Cleanup/destruction process
