terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  environment = "dev"
  project     = "lambda-monorepo"
  
  common_tags = {
    Environment = local.environment
    Project     = local.project
    ManagedBy   = "terraform"
  }
}

# IAM Role for Lambda functions
resource "aws_iam_role" "lambda_role" {
  name = "${local.project}-${local.environment}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_dynamodb_policy" {
  name = "${local.project}-${local.environment}-lambda-dynamodb-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          module.users_table.table_arn,
          "${module.users_table.table_arn}/*"
        ]
      }
    ]
  })
}

# DynamoDB Tables
module "users_table" {
  source = "../../modules/dynamodb"

  table_name = "${local.environment}-users"
  hash_key   = "id"
  
  attributes = [
    {
      name = "id"
      type = "S"
    },
    {
      name = "email"
      type = "S"
    }
  ]

  global_secondary_indexes = [
    {
      name            = "email-index"
      hash_key        = "email"
      range_key       = ""
      projection_type = "ALL"
      read_capacity   = 5
      write_capacity  = 5
    }
  ]

  stream_enabled = true
  tags          = local.common_tags
}

# Lambda Functions
module "user_service" {
  source = "../../modules/lambda"

  function_name    = "${local.project}-${local.environment}-user-service"
  filename         = "${path.module}/../../../services/user-service/dist/user-service.zip"
  source_code_hash = filebase64sha256("${path.module}/../../../services/user-service/dist/user-service.zip")
  role_arn        = aws_iam_role.lambda_role.arn
  
  environment_variables = {
    NODE_ENV    = local.environment
    USERS_TABLE = module.users_table.table_name
    LOG_LEVEL   = "info"
  }

  tags = local.common_tags
}

# API Gateway
module "api_gateway" {
  source = "../../modules/api-gateway"

  api_name             = "${local.project}-${local.environment}-api"
  api_description      = "API Gateway for ${local.project} ${local.environment}"
  stage_name           = local.environment
  lambda_function_arn  = module.user_service.function_invoke_arn
  lambda_function_name = module.user_service.function_name

  tags = local.common_tags
}