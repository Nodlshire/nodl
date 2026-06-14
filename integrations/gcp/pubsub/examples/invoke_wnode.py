def handle_pubsub(event, context):
    import base64
    print(base64.b64decode(event['data']).decode('utf-8'))
