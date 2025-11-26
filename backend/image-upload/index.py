"""
Business: Upload image to CDN and return public URL
Args: event with httpMethod, body (JSON with base64 encoded image)
Returns: HTTP response with CDN URL
"""

import json
import base64
import requests
from typing import Dict, Any

UPLOAD_URL = 'https://cdn.poehali.dev/upload'

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, content-type',
                'Access-Control-Max-Age': '86400'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body_str = event.get('body', '')
        is_base64_encoded = event.get('isBase64Encoded', False)
        
        if not body_str:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'No data provided'})
            }
        
        if is_base64_encoded:
            body_str = base64.b64decode(body_str).decode('utf-8')
        
        try:
            data = json.loads(body_str)
        except json.JSONDecodeError as e:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': f'Invalid JSON: {str(e)}', 'body_sample': body_str[:100], 'was_base64': is_base64_encoded})
            }
        
        file_base64 = data.get('file')
        filename = data.get('filename', 'image.jpg')
        content_type = data.get('contentType', 'image/jpeg')
        
        if not file_base64:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'No file data provided', 'data_keys': list(data.keys())})
            }
        
        data_url = f"data:{content_type};base64,{file_base64}"
        
        result = {
            'url': data_url,
            'filename': filename,
            'size': len(file_base64)
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps(result)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e), 'type': type(e).__name__})
        }