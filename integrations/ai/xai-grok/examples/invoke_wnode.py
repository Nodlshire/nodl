import requests
res = requests.post("https://wnode.compute/api/pipeline/invoke", json={"prompt": "hello"})
print(res.json())