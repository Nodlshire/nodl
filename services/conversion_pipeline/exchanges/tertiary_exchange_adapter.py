def get_quote(from_asset, to_asset, amount):
    # DORMANT MODE MOCK
    return {"quoted_amount": amount * 0.99, "fee": amount * 0.01}

def get_liquidity(asset):
    # DORMANT MODE MOCK
    return {"available": 1000000}

def execute_swap(quote_id):
    # DORMANT MODE MOCK
    return {"status": "mock_executed", "tx_hash": "0x0000000000000000000000000000000000000000"}

def check_status(tx_hash):
    # DORMANT MODE MOCK
    return {"status": "mock_confirmed"}

def fallback():
    # DORMANT MODE MOCK
    return {"status": "mock_fallback_engaged"}
