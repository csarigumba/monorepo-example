output "api_id" {
  description = "ID of the API Gateway"
  value       = aws_api_gateway_rest_api.this.id
}

output "api_arn" {
  description = "ARN of the API Gateway"
  value       = aws_api_gateway_rest_api.this.arn
}

output "api_execution_arn" {
  description = "Execution ARN of the API Gateway"
  value       = aws_api_gateway_rest_api.this.execution_arn
}

output "invoke_url" {
  description = "URL to invoke the API Gateway"
  value       = aws_api_gateway_deployment.this.invoke_url
}

output "stage_name" {
  description = "Name of the deployment stage"
  value       = aws_api_gateway_deployment.this.stage_name
}