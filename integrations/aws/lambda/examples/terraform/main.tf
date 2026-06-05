resource "aws_lambda_function" "wnode_forwarder" {
  function_name = "wnode-forwarder"
  handler       = "index.handler"
  runtime       = "python3.9"
  role          = aws_iam_role.lambda_exec.arn
  # ...
}