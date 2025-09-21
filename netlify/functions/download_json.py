import json

def response_bytes(data: bytes, filename: str, mimetype: str):
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": mimetype,
            "Content-Disposition": f"attachment; filename={filename}"
        },
        "isBase64Encoded": True,
        "body": data.decode('latin1')
    }

def handler(event, context):
    try:
        data = json.loads(event.get('body') or '{}')
        payload = {
            'transcription': data.get('transcription',''),
            'metadata': {
                'title': data.get('title',''),
                'duration': data.get('duration',''),
                'uploader': data.get('uploader',''),
                'language': data.get('language',''),
                'caption_type': data.get('caption_type',''),
            }
        }
        content = json.dumps(payload, ensure_ascii=False, indent=2).encode('utf-8')
        title = (data.get('title') or 'youtube_captions').lower()
        safe = ''.join(c if c.isalnum() or c=='_' else '_' for c in title)
        return response_bytes(content, f"{safe}.json", "application/json")
    except Exception as e:
        return {"statusCode": 500, "headers": {"Content-Type":"application/json"}, "body": json.dumps({"error":"Failed to generate JSON"})}


