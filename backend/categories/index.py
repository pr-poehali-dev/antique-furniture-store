'''
Business: API для управления категориями товаров
Args: event - dict с httpMethod, body, queryStringParameters
      context - object с атрибутами request_id, function_name
Returns: HTTP response dict с данными категорий
'''

import json
import os
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Создание подключения к БД"""
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # CORS preflight
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = None
    
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Получить все категории
        if method == 'GET':
            cur.execute("SELECT id, name, icon, sort_order FROM categories ORDER BY sort_order ASC")
            categories = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(c) for c in categories], default=str)
            }
        
        # Добавить новую категорию
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            category_id: str = body_data.get('id', '')
            name: str = body_data.get('name', '')
            icon: str = body_data.get('icon', 'Circle')
            sort_order: int = body_data.get('sort_order', 999)
            
            if not category_id or not name:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Требуется id и name'})
                }
            
            cur.execute(
                "INSERT INTO categories (id, name, icon, sort_order) VALUES (%s, %s, %s, %s) RETURNING id, name, icon, sort_order",
                (category_id, name, icon, sort_order)
            )
            
            new_category = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(new_category), default=str)
            }
        
        # Обновить категорию
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            category_id = body_data.get('id')
            
            if not category_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Требуется id категории'})
                }
            
            name = body_data.get('name')
            icon = body_data.get('icon')
            sort_order = body_data.get('sort_order')
            
            updates = []
            values = []
            
            if name:
                updates.append("name = %s")
                values.append(name)
            if icon:
                updates.append("icon = %s")
                values.append(icon)
            if sort_order is not None:
                updates.append("sort_order = %s")
                values.append(sort_order)
            
            if not updates:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Нет данных для обновления'})
                }
            
            values.append(category_id)
            query = f"UPDATE categories SET {', '.join(updates)} WHERE id = %s RETURNING id, name, icon, sort_order"
            
            cur.execute(query, values)
            updated_category = cur.fetchone()
            
            if not updated_category:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Категория не найдена'})
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(updated_category), default=str)
            }
        
        # Удалить категорию
        elif method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            category_id = params.get('id')
            
            if not category_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Требуется id категории'})
                }
            
            # Проверяем, что это не "all"
            if category_id == 'all':
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Нельзя удалить категорию "Все категории"'})
                }
            
            cur.execute("DELETE FROM categories WHERE id = %s RETURNING id", (category_id,))
            deleted = cur.fetchone()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Категория не найдена'})
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Категория удалена', 'id': deleted['id']})
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Метод не поддерживается'})
            }
    
    finally:
        if conn:
            conn.close()
