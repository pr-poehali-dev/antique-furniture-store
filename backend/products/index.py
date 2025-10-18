'''
Business: API для управления товарами антикварного магазина
Args: event - dict с httpMethod, body, queryStringParameters
      context - object с атрибутами request_id, function_name
Returns: HTTP response dict с данными товаров
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
        
        # Получить все товары
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            product_id = params.get('id')
            
            if product_id:
                cur.execute(
                    "SELECT id, photo_url, article, name, price, created_at FROM products_new WHERE id = %s",
                    (product_id,)
                )
                product = cur.fetchone()
                
                if not product:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Товар не найден'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(product), default=str)
                }
            else:
                cur.execute("SELECT id, photo_url, article, name, price, created_at FROM products_new ORDER BY created_at DESC")
                products = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(p) for p in products], default=str)
                }
        
        # Добавить новый товар
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            photo_url: Optional[str] = body_data.get('photo_url')
            article: str = body_data.get('article', '')
            name: str = body_data.get('name', '')
            price: float = body_data.get('price', 0)
            
            if not article or not name or price <= 0:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Все поля обязательны: article, name, price > 0'})
                }
            
            cur.execute(
                "INSERT INTO products_new (photo_url, article, name, price) VALUES (%s, %s, %s, %s) RETURNING id, photo_url, article, name, price, created_at",
                (photo_url, article, name, price)
            )
            
            new_product = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(new_product), default=str)
            }
        
        # Обновить товар
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            product_id = body_data.get('id')
            
            if not product_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Требуется id товара'})
                }
            
            photo_url = body_data.get('photo_url')
            article = body_data.get('article')
            name = body_data.get('name')
            price = body_data.get('price')
            
            updates = []
            values = []
            
            if photo_url is not None:
                updates.append("photo_url = %s")
                values.append(photo_url)
            if article:
                updates.append("article = %s")
                values.append(article)
            if name:
                updates.append("name = %s")
                values.append(name)
            if price is not None and price > 0:
                updates.append("price = %s")
                values.append(price)
            
            if not updates:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Нет данных для обновления'})
                }
            
            values.append(product_id)
            query = f"UPDATE products_new SET {', '.join(updates)} WHERE id = %s RETURNING id, photo_url, article, name, price, created_at"
            
            cur.execute(query, values)
            updated_product = cur.fetchone()
            
            if not updated_product:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Товар не найден'})
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(updated_product), default=str)
            }
        
        # Удалить товар
        elif method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            product_id = params.get('id')
            
            if not product_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Требуется id товара'})
                }
            
            cur.execute("DELETE FROM products_new WHERE id = %s RETURNING id", (product_id,))
            deleted = cur.fetchone()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Товар не найден'})
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Товар удалён', 'id': deleted['id']})
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
