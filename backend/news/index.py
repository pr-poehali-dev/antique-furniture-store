import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление новостями (получение списка, создание, обновление, удаление)
    Args: event - dict с httpMethod, body, queryStringParameters, pathParams
          context - объект с атрибутами request_id, function_name
    Returns: HTTP ответ с данными новостей в JSON
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            news_id = params.get('id')
            
            if news_id:
                cursor.execute(
                    "SELECT id, title, description, image_url, content, created_at, updated_at, published FROM news WHERE id = %s",
                    (news_id,)
                )
                news_item = cursor.fetchone()
                result = dict(news_item) if news_item else None
            else:
                only_published = params.get('published', 'true') == 'true'
                if only_published:
                    cursor.execute(
                        "SELECT id, title, description, image_url, created_at, published FROM news WHERE published = true ORDER BY created_at DESC"
                    )
                else:
                    cursor.execute(
                        "SELECT id, title, description, image_url, created_at, published FROM news ORDER BY created_at DESC"
                    )
                news_list = cursor.fetchall()
                result = [dict(item) for item in news_list]
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(result, default=str)
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            title = body_data.get('title')
            description = body_data.get('description', '')
            image_url = body_data.get('image_url', '')
            content = body_data.get('content', '')
            published = body_data.get('published', True)
            
            cursor.execute(
                "INSERT INTO news (title, description, image_url, content, published) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (title, description, image_url, content, published)
            )
            new_news = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(dict(new_news), default=str)
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            news_id = body_data.get('id')
            
            update_fields = []
            update_values = []
            
            if 'title' in body_data:
                update_fields.append('title = %s')
                update_values.append(body_data['title'])
            if 'description' in body_data:
                update_fields.append('description = %s')
                update_values.append(body_data['description'])
            if 'image_url' in body_data:
                update_fields.append('image_url = %s')
                update_values.append(body_data['image_url'])
            if 'content' in body_data:
                update_fields.append('content = %s')
                update_values.append(body_data['content'])
            if 'published' in body_data:
                update_fields.append('published = %s')
                update_values.append(body_data['published'])
            
            update_fields.append('updated_at = CURRENT_TIMESTAMP')
            update_values.append(news_id)
            
            query = f"UPDATE news SET {', '.join(update_fields)} WHERE id = %s RETURNING id, title, updated_at"
            cursor.execute(query, update_values)
            updated_news = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(dict(updated_news) if updated_news else {}, default=str)
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            news_id = params.get('id')
            
            cursor.execute("DELETE FROM news WHERE id = %s", (news_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'id': news_id})
            }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cursor.close()
        conn.close()