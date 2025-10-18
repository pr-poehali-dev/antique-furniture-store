-- Добавление колонки category для категоризации товаров
ALTER TABLE t_p58302981_antique_furniture_st.products_new 
ADD COLUMN category VARCHAR(100) NULL;

-- Устанавливаем категорию по умолчанию для существующих товаров
UPDATE t_p58302981_antique_furniture_st.products_new 
SET category = 'all' WHERE category IS NULL;