resource "aws_dynamodb_table" "table" {
  name           = "${var.project}-${var.environment}-${var.owner}-ddb"
  billing_mode   = "ON_DEMAND"
  hash_key       = "uid"
  range_key      = "survey_id"

  attribute {
    name = "uid"
    type = "S"
  }

  attribute {
    name = "survey_id"
    type = "S"
  }

  point_in_time_recovery {
    enabled = var.enable_point_in_time_recovery
  }

  tags = {
    Project     = var.project
    Environment = var.environment
    Owner       = var.owner
    ManagedBy   = "Terraform"
  }
}