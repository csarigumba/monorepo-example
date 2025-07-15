output "api_gateway_url" {
  description = "API Gateway URL"
  value       = module.api_gateway.invoke_url
}

output "user_service_function_name" {
  description = "User service Lambda function name"
  value       = module.user_service.function_name
}

output "users_table_name" {
  description = "Users DynamoDB table name"
  value       = module.users_table.table_name
}