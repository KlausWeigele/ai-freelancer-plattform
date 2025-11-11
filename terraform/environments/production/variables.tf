variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

variable "ecr_repository_name" {
  description = "ECR repository name for the app"
  type        = string
  default     = "freelancer-app"
}

