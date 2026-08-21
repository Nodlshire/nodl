import json

with open("state/engine.json", "r") as f:
    data = json.load(f)

if "pendingCommissions" not in data:
    data["pendingCommissions"] = {}
if data["pendingCommissions"] is None:
    data["pendingCommissions"] = {}

data["pendingCommissions"]["100003-0426-03-AA"] = [
    {
        "id": "comm_123",
        "transactionId": "tx_456",
        "recipientId": "100003-0426-03-AA",
        "role": "level1",
        "amountCents": 50000,
        "status": "pending",
        "createdAt": "2026-05-30T12:00:00Z"
    }
]

with open("state/engine.json", "w") as f:
    json.dump(data, f, indent=2)
