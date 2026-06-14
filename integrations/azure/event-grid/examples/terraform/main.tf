resource "azurerm_eventgrid_event_subscription" "wnode_sub" {
  name  = "wnode-handler"
  scope = azurerm_eventgrid_topic.wnode_topic.id
  webhook_endpoint {
    url = "https://wnode.example.com/api/pipeline/invoke"
  }
}