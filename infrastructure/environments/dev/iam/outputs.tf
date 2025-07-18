output "lambda_role_arn" {
  description = "ARN of the Lambda execution role"
  value       = module.iam.lambda_role_arn
}

output "lambda_role_name" {
  description = "Name of the Lambda execution role"
  value       = module.iam.lambda_role_name
}