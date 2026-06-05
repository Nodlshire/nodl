import boto3
def poll_sqs(queue_url):
    sqs = boto3.client('sqs')
    res = sqs.receive_message(QueueUrl=queue_url)
    print(res)
