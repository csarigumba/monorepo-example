variable "project" {
  description = "Project identifier"
  type        = string
}

variable "owner" {
  description = "Owner identifier"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "aws_account_id" {
  description = "AWS account ID"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}