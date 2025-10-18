-- Добавление колонки is_visible для управления видимостью товаров на сайте в таблицу products_new
ALTER TABLE t_p58302981_antique_furniture_st.products_new 
ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT true;

-- Устанавливаем все существующие товары как видимые
UPDATE t_p58302981_antique_furniture_st.products_new 
SET is_visible = true;