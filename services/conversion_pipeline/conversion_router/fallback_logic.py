def handle_failure(exchange, amount):
    # DORMANT MODE MOCK
    return {"status": "mock_fallback_triggered", "next_exchange": "secondary"}
