terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket         = "test-staging-terraform-state"
    key            = "iam/terraform.tfstate"
    region         = "ap-northeast-1"
    dynamodb_table = "test-staging-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

module "iam" {
  source = "../../../modules/iam"
  
  project     = var.project
  environment = var.environment
  owner       = var.owner
}