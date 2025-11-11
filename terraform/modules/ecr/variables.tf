variable "repository_name" {
  description = "Name of the ECR repository"
  type        = string
}

variable "scan_on_push" {
  description = "Enable image scan on push"
  type        = bool
  default     = true
}

variable "image_tag_mutability" {
  description = "Image tag mutability policy (MUTABLE or IMMUTABLE)"
  type        = string
  default     = "IMMUTABLE"
}

variable "force_delete" {
  description = "Force delete repository and images on destroy"
  type        = bool
  default     = false
}

variable "lifecycle_keep_last" {
  description = "How many images to keep in lifecycle policy"
  type        = number
  default     = 20
}

