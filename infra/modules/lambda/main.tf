variable "function_name" {
  description = "Name of the Lambda function"
  type        = string
}

variable "runtime" {
  description = "Runtime for the Lambda function"
  type        = string
  default     = "nodejs18.x"
}

variable "handler" {
  description = "Handler for the Lambda function"
  type        = string
  default     = "index.handler"
}

variable "source_code_hash" {
  description = "Hash of the source code"
  type        = string
}

variable "filename" {
  description = "Path to the deployment package"
  type        = string
}

variable "environment_variables" {
  description = "Environment variables for the Lambda function"
  type        = map(string)
  default     = {}
}

variable "timeout" {
  description = "Timeout for the Lambda function"
  type        = number
  default     = 30
}

variable "memory_size" {
  description = "Memory size for the Lambda function"
  type        = number
  default     = 256
}

variable "role_arn" {
  description = "IAM role ARN for the Lambda function"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

resource "aws_lambda_function" "this" {
  function_name    = var.function_name
  role            = var.role_arn
  handler         = var.handler
  source_code_hash = var.source_code_hash
  filename        = var.filename
  runtime         = var.runtime
  timeout         = var.timeout
  memory_size     = var.memory_size

  environment {
    variables = var.environment_variables
  }

  tags = var.tags
}

resource "aws_cloudwatch_log_group" "this" {
  name              = "/aws/lambda/${var.function_name}"
  retention_in_days = 14
  tags              = var.tags
}