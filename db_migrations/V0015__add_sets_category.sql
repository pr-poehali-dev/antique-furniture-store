-- Добавляем категорию "Комплекты и гарнитуры"
INSERT INTO categories (id, name, icon, sort_order) 
VALUES ('sets', 'Комплекты и гарнитуры', 'Package', 4)
ON CONFLICT (id) DO NOTHING;