-- Создание таблицы категорий для гибкого управления
CREATE TABLE t_p58302981_antique_furniture_st.categories (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(100) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Вставляем стандартные категории
INSERT INTO t_p58302981_antique_furniture_st.categories (id, name, icon, sort_order) VALUES
('all', 'Все категории', 'Grid', 0),
('sets', 'Гарнитуры и комплекты', 'Sofa', 1),
('storage', 'Комоды, сундуки, тумбы', 'Box', 2),
('mirrors', 'Зеркала, ширмы', 'Square', 3),
('tables', 'Столы, консоли', 'Table', 4);