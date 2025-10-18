-- Добавление колонки is_visible для управления видимостью товаров на сайте
ALTER TABLE t_p58302981_antique_furniture_st.products 
ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT true;

-- Устанавливаем все существующие товары как видимые
UPDATE t_p58302981_antique_furniture_st.products 
SET is_visible = true;