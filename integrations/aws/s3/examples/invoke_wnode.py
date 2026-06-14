import requests
import boto3
import os

def s3_handler(event, context):
    print("S3 Event received")
