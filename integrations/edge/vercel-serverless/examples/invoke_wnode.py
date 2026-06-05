import requests
res = requests.post("https://wnode.compute/api/pipeline/invoke", json={"route": "/api/heavy"})
print(res.json())