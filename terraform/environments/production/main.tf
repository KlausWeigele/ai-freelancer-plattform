terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
  # Backend can be switched to S3 later; default is local state.
  # backend "s3" {
  #   bucket         = "freelancer-terraform-state"
  #   key            = "production/terraform.tfstate"
  #   region         = var.aws_region
  #   # dynamodb_table = "freelancer-terraform-lock" # optional
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region
}

module "ecr" {
  source          = "../../modules/ecr"
  repository_name = var.ecr_repository_name
}

output "ecr_repository_url" {
  description = "ECR repository URL (use in CI/CD)"
  value       = module.ecr.repository_url
}

