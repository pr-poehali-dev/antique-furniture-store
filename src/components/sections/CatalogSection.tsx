import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  title?: string;
  price: number | string;
  image_url?: string;
  photo_url?: string;
  main_image?: string;
  period?: string;
  description?: string;
  article?: string;
  name?: string;
  created_at?: string;
  is_visible?: boolean;
  category?: string;
  sort_order?: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CatalogSectionProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  loading: boolean;
  filteredProducts: Product[];
  products: Product[];
  setSelectedProduct: (product: Product) => void;
  setIsDialogOpen: (value: boolean) => void;
}

const CatalogSection = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  loading, 
  filteredProducts, 
  products,
  setSelectedProduct,
  setIsDialogOpen
}: CatalogSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllProducts, setShowAllProducts] = useState(false);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowAllProducts(false);
    
    setTimeout(() => {
      const productsGrid = document.getElementById('products-grid');
      if (productsGrid) {
        productsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const searchFilteredProducts = filteredProducts.filter(product => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    const name = (product.name || product.title || '').toLowerCase();
    const article = (product.article || '').toLowerCase();
    
    return name.includes(query) || article.includes(query);
  });

  const displayProducts = (selectedCategory === 'all' && !showAllProducts && !searchQuery)
    ? searchFilteredProducts.slice(0, 12)
    : searchFilteredProducts;

  const hasMoreProducts = selectedCategory === 'all' && searchFilteredProducts.length > 12;

  return (
    <section id="catalog" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <div className="text-4xl mb-4">✨</div>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-primary/80 via-amber-300/70 to-primary/80 bg-clip-text text-transparent uppercase tracking-wider md:tracking-widest mb-4" style={{ fontFamily: 'Cardo, serif', textShadow: '0 0 15px rgba(217, 178, 95, 0.3), 0 0 30px rgba(217, 178, 95, 0.2)' }}>
            Каталог
          </h2>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            Каждый предмет в нашей коллекции — это уникальное произведение искусства
          </p>
        </div>

        <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-4 md:gap-6 mb-12 max-w-screen-lg mx-auto">
          {categories.map((category) => {
            const categoryProduct = category.id === 'all' 
              ? products[0]
              : products.find(p => p.category === category.id);
            const backgroundImage = categoryProduct?.main_image || categoryProduct?.photo_url;

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`relative overflow-hidden rounded-lg transition-all duration-300 h-32 md:w-48 group ${
                  selectedCategory === category.id 
                    ? 'ring-4 ring-primary scale-105' 
                    : 'hover:scale-105 hover:shadow-xl'
                }`}
              >
                {backgroundImage && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                  />
                )}
                <div className={`absolute inset-0 transition-all ${
                  selectedCategory === category.id 
                    ? 'bg-black/40' 
                    : 'bg-black/60 group-hover:bg-black/50'
                }`} />
                <div className="relative h-full flex flex-col items-center justify-center gap-2 px-4">
                  <Icon 
                    name={category.icon} 
                    size={28} 
                    className={`transition-colors ${
                      selectedCategory === category.id 
                        ? 'text-primary-foreground' 
                        : 'text-white'
                    }`}
                  />
                  <span className={`font-semibold text-center text-sm transition-colors ${
                    selectedCategory === category.id 
                      ? 'text-primary-foreground' 
                      : 'text-white'
                  }`}>
                    {category.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="text"
              placeholder="Поиск по названию или артикулу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-14 text-lg border-2 focus:border-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-muted-foreground">Загрузка товаров...</div>
          </div>
        ) : searchFilteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-muted-foreground">
              {searchQuery 
                ? 'По вашему запросу ничего не найдено. Попробуйте изменить поисковый запрос.'
                : products.length === 0 
                  ? 'Товары не найдены. Добавьте товары через админ-панель.' 
                  : 'Нет товаров в этой категории.'}
            </div>
          </div>
        ) : (
          <div id="products-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="group overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-2xl animate-scale-in cursor-pointer flex flex-col"
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => {
                  setSelectedProduct(product);
                  setIsDialogOpen(true);
                }}
              >
                <CardContent className="p-0 flex flex-col flex-1">
                  <div className="relative overflow-hidden bg-muted h-96 flex items-center justify-center">
                    {(product.main_image || product.photo_url) ? (
                      <img
                        src={product.main_image || product.photo_url}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="320"%3E%3Crect fill="%23f0f0f0" width="400" height="320"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EФото недоступно%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon name="ImageOff" size={64} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                      {product.article}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-2xl font-serif font-semibold text-foreground mb-3">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {typeof product.price === 'string' ? parseFloat(product.price).toLocaleString('ru-RU') : product.price.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all mt-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                        setIsDialogOpen(true);
                      }}
                    >
                      Подробнее
                      <Icon name="Eye" className="ml-2" size={18} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {hasMoreProducts && !showAllProducts && (
          <div className="text-center mt-12">
            <Button 
              onClick={() => setShowAllProducts(true)}
              variant="outline" 
              size="lg" 
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            >
              Весь каталог
              <Icon name="Grid" className="ml-2" size={20} />
            </Button>
          </div>
        )}

        {showAllProducts && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
            <Button
              onClick={() => setShowAllProducts(false)}
              variant="secondary"
              size="lg"
              className="bg-background/40 backdrop-blur-md border border-primary/30 hover:bg-background/60 shadow-lg text-foreground/70 hover:text-foreground"
            >
              <Icon name="ChevronUp" className="mr-2" size={20} />
              Свернуть каталог
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CatalogSection;