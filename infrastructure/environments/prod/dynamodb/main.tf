terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket         = "test-prod-terraform-state"
    key            = "dynamodb/terraform.tfstate"
    region         = "ap-northeast-1"
    dynamodb_table = "test-prod-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

data "terraform_remote_state" "iam" {
  backend = "s3"
  config = {
    bucket = "test-prod-terraform-state"
    key    = "iam/terraform.tfstate"
    region = var.aws_region
  }
}

module "dynamodb" {
  source = "../../../modules/dynamodb"
  
  project                       = var.project
  environment                   = var.environment
  owner                         = var.owner
  enable_point_in_time_recovery = var.enable_point_in_time_recovery
}