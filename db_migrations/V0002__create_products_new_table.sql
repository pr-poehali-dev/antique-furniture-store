CREATE TABLE products_new (
    id SERIAL PRIMARY KEY,
    photo_url TEXT,
    article VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_new_article ON products_new(article);