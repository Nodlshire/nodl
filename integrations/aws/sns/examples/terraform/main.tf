resource "aws_sns_topic_subscription" "wnode_sub" {
  topic_arn = aws_sns_topic.wnode_topic.arn
  protocol  = "https"
  endpoint  = "https://wnode.example.com/api/pipeline/invoke"
}