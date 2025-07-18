output "table_name" {
  description = "Name of the DynamoDB table"
  value       = module.dynamodb.table_name
}

output "table_arn" {
  description = "ARN of the DynamoDB table"
  value       = module.dynamodb.table_arn
}

output "table_id" {
  description = "ID of the DynamoDB table"
  value       = module.dynamodb.table_id
}