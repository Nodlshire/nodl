resource "google_pubsub_subscription" "wnode_sub" {
  name  = "wnode-push-sub"
  topic = google_pubsub_topic.wnode_topic.name
  push_config {
    push_endpoint = "https://wnode.example.com/api/pipeline/invoke"
  }
}