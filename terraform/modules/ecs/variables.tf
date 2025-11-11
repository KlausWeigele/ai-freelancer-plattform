variable "cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
  default     = "freelancer-prod"
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

