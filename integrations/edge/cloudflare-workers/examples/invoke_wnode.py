import requests
res = requests.post("https://wnode.compute/api/pipeline/invoke", json={"proxy": "edge"})
print(res.json())