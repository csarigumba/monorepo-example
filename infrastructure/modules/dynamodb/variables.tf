variable "project" {
  description = "Project identifier"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "owner" {
  description = "Owner identifier"
  type        = string
}

variable "enable_point_in_time_recovery" {
  description = "Enable point in time recovery"
  type        = bool
  default     = false
}