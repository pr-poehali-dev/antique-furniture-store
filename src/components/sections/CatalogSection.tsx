import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  return (
    <section id="catalog" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <div className="text-4xl mb-4">✨</div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Каталог антиквариата
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
                onClick={() => setSelectedCategory(category.id)}
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
                    ? 'bg-primary/80' 
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

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-muted-foreground">Загрузка товаров...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-muted-foreground">
              {products.length === 0 
                ? 'Товары не найдены. Добавьте товары через админ-панель.' 
                : 'Нет товаров в этой категории.'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
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

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all">
            Весь каталог
            <Icon name="Grid" className="ml-2" size={20} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CatalogSection;