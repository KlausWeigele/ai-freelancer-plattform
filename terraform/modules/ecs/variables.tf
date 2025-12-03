variable "cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
  default     = "freelancer-prod"
}

variable "container_insights" {
  description = "Enable Container Insights (costs ~$0.01/task/hour for metrics)"
  type        = bool
  default     = false
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

