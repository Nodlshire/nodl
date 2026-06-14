import requests
res = requests.post("https://wnode.compute/api/pipeline/invoke", json={"trigger": "timer"})
print(res.json())