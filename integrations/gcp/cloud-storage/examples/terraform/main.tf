resource "google_eventarc_trigger" "wnode_trigger" {
  name = "gcs-wnode-trigger"
  location = "us-central1"
  destination {
    cloud_run_service {
      service = "wnode-receiver"
      region  = "us-central1"
    }
  }
  matching_criteria {
    attribute = "type"
    value     = "google.cloud.storage.object.v1.finalized"
  }
}