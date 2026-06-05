import requests
res = requests.post("https://wnode.compute/api/pipeline/invoke", json={"job": "heavy"})
print(res.json())