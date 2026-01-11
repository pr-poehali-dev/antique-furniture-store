import { useState, useEffect } from 'react';
import HeaderNewsCarousel from '@/components/HeaderNewsCarousel';
import ProductModal from '@/components/ProductModal';
import Header from '@/components/sections/Header';
import HeroSection from '@/components/sections/HeroSection';
import CatalogSection from '@/components/sections/CatalogSection';
import ContentSections from '@/components/sections/ContentSections';

interface Product {
  id: number;
  title?: string;
  price: number | string;
  image_url?: string;
  period?: string;
  description?: string;
  photo_url?: string;
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

const API_URL = 'https://functions.poehali.dev/60f2060b-ddaf-4a36-adc7-ab19b94dcbf2';
const CATEGORIES_API_URL = 'https://functions.poehali.dev/19719648-b1bf-45a7-9488-4c9fe354fbb0';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(data.filter((p: Product) => p.is_visible !== false));
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(CATEGORIES_API_URL);
      if (!response.ok) {
        throw new Error('Ошибка загрузки категорий');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
      setCategories([
        { id: 'all', name: 'Все категории', icon: 'Armchair' },
        { id: 'mirrors', name: 'Зеркала, ширмы', icon: 'Square' },
        { id: 'tables', name: 'Столы, консоли', icon: 'Table' },
        { id: 'storage', name: 'Комоды, сундуки', icon: 'Box' },
        { id: '7', name: 'Дорогое', icon: 'Circle' }
      ]);
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Header 
        activeSection={activeSection}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        scrollToSection={scrollToSection}
      />

      <main className="pt-[100px] md:pt-[180px]">
        <HeaderNewsCarousel />

        <CatalogSection 
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          loading={loading}
          filteredProducts={filteredProducts}
          products={products}
          setSelectedProduct={setSelectedProduct}
          setIsDialogOpen={setIsDialogOpen}
        />

        <ContentSections scrollToSection={scrollToSection} />
      </main>

      <ProductModal
        product={selectedProduct ? {
          id: selectedProduct.id,
          title: selectedProduct.name || selectedProduct.title || '',
          price: typeof selectedProduct.price === 'string' ? parseFloat(selectedProduct.price) : selectedProduct.price,
          image_url: selectedProduct.photo_url || selectedProduct.image_url || '',
          main_image: selectedProduct.main_image,
          period: selectedProduct.article,
          description: selectedProduct.description
        } : null}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default Index;