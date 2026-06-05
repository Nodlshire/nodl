# Terraform configuration for Vision API not typically required beyond enabling the service.
resource "google_project_service" "vision" {
  service = "vision.googleapis.com"
}