import requests
import json
import os

def handler(event, context):
    endpoint = os.environ.get("WNODE_ENDPOINT")
    api_key = os.environ.get("WNODE_API_KEY")
    res = requests.post(endpoint, json=event, headers={"Authorization": f"Bearer {api_key}"})
    return res.json()
