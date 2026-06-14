resource "azurerm_eventgrid_system_topic" "wnode_topic" {
  name                = "wnode-blob-topic"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  source_arm_resource_id = azurerm_storage_account.sa.id
  topic_type          = "Microsoft.Storage.StorageAccounts"
}