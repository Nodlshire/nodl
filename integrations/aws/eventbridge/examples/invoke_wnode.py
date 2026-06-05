import requests
res = requests.post("https://wnode.compute/api/pipeline/invoke", json={"detail": {}})
print(res.json())