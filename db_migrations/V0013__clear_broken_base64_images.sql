-- Очистка битых base64 картинок из товаров
UPDATE t_p58302981_antique_furniture_st.products_new 
SET photo_url = '' 
WHERE photo_url LIKE 'data:image%';