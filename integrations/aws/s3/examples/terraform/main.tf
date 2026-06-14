resource "aws_s3_bucket_notification" "wnode_notify" {
  bucket = aws_s3_bucket.bucket.id
  topic {
    topic_arn     = aws_sns_topic.wnode_topic.arn
    events        = ["s3:ObjectCreated:*"]
  }
}