import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  period: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories: Category[] = [
    { id: 'all', name: 'Все категории', icon: 'Grid' },
    { id: 'sets', name: 'Гарнитуры и комплекты', icon: 'Sofa' },
    { id: 'storage', name: 'Комоды, сундуки, тумбы', icon: 'Box' },
    { id: 'mirrors', name: 'Зеркала, ширмы', icon: 'Square' },
    { id: 'tables', name: 'Столы, консоли', icon: 'Table' }
  ];

  const products: Product[] = [
    {
      id: 1,
      title: 'Кресло с резьбой',
      price: '450 000 ₽',
      image: 'https://cdn.poehali.dev/projects/56ebf005-4988-4a0c-b185-3a027ae2f02a/files/d2ab9fac-4c8d-4066-9e93-e0784f60e7b4.jpg',
      period: 'XVIII век'
    },
    {
      id: 2,
      title: 'Китайский шкаф',
      price: '890 000 ₽',
      image: 'https://cdn.poehali.dev/projects/56ebf005-4988-4a0c-b185-3a027ae2f02a/files/95fab0c8-7cb7-400a-85ac-8158462dccb3.jpg',
      period: 'XIX век'
    },
    {
      id: 3,
      title: 'Кушетка с орнаментом',
      price: '1 250 000 ₽',
      image: 'https://cdn.poehali.dev/projects/56ebf005-4988-4a0c-b185-3a027ae2f02a/files/e3ef6b3a-83d9-44f4-b4b6-2e77e9344879.jpg',
      period: 'XVIII век'
    }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 w-full z-50 border-b border-primary/30" style={{ backgroundImage: 'url(https://cdn.poehali.dev/projects/56ebf005-4988-4a0c-b185-3a027ae2f02a/files/d1331506-d80a-410c-bef0-f2011b114ab6.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="bg-background/85 backdrop-blur-sm">
          <nav className="container mx-auto px-6 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src="https://cdn.poehali.dev/files/abd9cfe2-f31a-443d-bc01-bea3c9be053a.png" alt="Архив № 8" className="h-40 w-40 object-contain" />
                <h1 className="text-3xl font-bold bg-gradient-to-br from-primary via-amber-400 to-primary bg-clip-text text-transparent animate-shimmer" style={{ fontFamily: 'Cardo, serif' }}>
                  Архив №8
                </h1>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => scrollToSection('home')}
                  className={`text-[22px] px-5 py-2 rounded transition-all duration-300 hover:scale-110 hover:border hover:border-primary ${activeSection === 'home' ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
                >
                  Главная
                </button>
                <div className="h-8 w-px bg-gradient-to-b from-transparent via-primary to-transparent"></div>
                <button
                  onClick={() => scrollToSection('catalog')}
                  className={`text-[22px] px-5 py-2 rounded transition-all duration-300 hover:scale-110 hover:border hover:border-primary ${activeSection === 'catalog' ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
                >
                  Каталог
                </button>
                <div className="h-8 w-px bg-gradient-to-b from-transparent via-primary to-transparent"></div>
                <button
                  onClick={() => scrollToSection('about')}
                  className={`text-[22px] px-5 py-2 rounded transition-all duration-300 hover:scale-110 hover:border hover:border-primary ${activeSection === 'about' ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
                >
                  О нас
                </button>
                <div className="h-8 w-px bg-gradient-to-b from-transparent via-primary to-transparent"></div>
                <button
                  onClick={() => scrollToSection('services')}
                  className={`text-[22px] px-5 py-2 rounded transition-all duration-300 hover:scale-110 hover:border hover:border-primary ${activeSection === 'services' ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
                >
                  Услуги
                </button>
                <div className="h-8 w-px bg-gradient-to-b from-transparent via-primary to-transparent"></div>
                <button
                  onClick={() => scrollToSection('contacts')}
                  className={`text-[22px] px-5 py-2 rounded transition-all duration-300 hover:scale-110 hover:border hover:border-primary ${activeSection === 'contacts' ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
                >
                  Контакты
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="pt-20">
        <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
          
          <div className="container mx-auto px-6 text-center relative z-10 animate-fade-in">
            <img src="https://cdn.poehali.dev/files/abd9cfe2-f31a-443d-bc01-bea3c9be053a.png" alt="Архив № 8" className="h-64 w-64 mx-auto mb-8 object-contain" />
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto font-body">
              Вещи с историей
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 transition-transform hover:scale-105"
              onClick={() => scrollToSection('catalog')}
            >
              Смотреть каталог
              <Icon name="ArrowRight" className="ml-2" size={20} />
            </Button>
          </div>
        </section>

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

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className="transition-all"
                >
                  <Icon name={category.icon} className="mr-2" size={18} />
                  {category.name}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="group overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-2xl animate-scale-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                        {product.period}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-serif font-semibold text-foreground mb-3">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-primary">{product.price}</span>
                      </div>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all">
                        Подробнее
                        <Icon name="Eye" className="ml-2" size={18} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                Весь каталог
                <Icon name="Grid" className="ml-2" size={20} />
              </Button>
            </div>
          </div>
        </section>

        <section id="about" className="py-24 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center animate-fade-in">
              <div>
                <div className="text-4xl mb-4">🎭</div>
                <h2 className="text-4xl font-serif font-bold text-primary mb-6">О нас</h2>
                <p className="text-lg text-muted-foreground mb-6 font-body leading-relaxed">
                  Мы специализируемся на подборе и продаже уникальной антикварной мебели в стиле шинуазри. 
                  Наша коллекция включает редкие предметы XVIII-XIX веков из лучших европейских и азиатских мастерских.
                </p>
                <p className="text-lg text-muted-foreground mb-6 font-body leading-relaxed">
                  Каждый предмет проходит тщательную экспертизу и при необходимости профессиональную реставрацию, 
                  сохраняющую его историческую ценность и аутентичность.
                </p>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">25+</div>
                    <div className="text-sm text-muted-foreground">лет опыта</div>
                  </div>
                  <Separator orientation="vertical" className="h-16" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">500+</div>
                    <div className="text-sm text-muted-foreground">предметов</div>
                  </div>
                  <Separator orientation="vertical" className="h-16" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">100%</div>
                    <div className="text-sm text-muted-foreground">подлинность</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-primary/20">
                  <img 
                    src="https://cdn.poehali.dev/files/478a911a-d0b3-4dde-ba70-1be8f4dd3d6b.jpg" 
                    alt="Интерьер салона Архив № 8" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 animate-fade-in">
              <div className="text-4xl mb-4">🚚</div>
              <h2 className="text-4xl font-serif font-bold text-primary mb-4">Доставка и оплата</h2>
              <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
                Удобные условия покупки и доставки антикварной мебели
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 border-border hover:border-primary transition-all hover:shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4">🛒</div>
                  <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">Оформление</h3>
                  <p className="text-muted-foreground font-body">
                    Простое оформление заказа онлайн или в нашем салоне
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border hover:border-primary transition-all hover:shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4">💳</div>
                  <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">Оплата</h3>
                  <p className="text-muted-foreground font-body">
                    Наличный и безналичный расчет, оплата картой
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border hover:border-primary transition-all hover:shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4">🚛</div>
                  <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">Доставка</h3>
                  <p className="text-muted-foreground font-body">
                    Бережная доставка по Москве и России
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="contacts" className="py-24 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center animate-fade-in">
              <div className="text-4xl mb-4">📞</div>
              <h2 className="text-4xl font-serif font-bold text-primary mb-6">Контакты</h2>
              <p className="text-lg text-muted-foreground mb-8 font-body">
                Посетите наш салон или свяжитесь с нами для оформления заказа
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-center justify-center gap-3">
                  <Icon name="MapPin" className="text-primary" size={24} />
                  <span className="text-lg">Москва, ул. Арбат, д. 15</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Icon name="Phone" className="text-primary" size={24} />
                  <span className="text-lg">+7 (495) 123-45-67</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Icon name="Mail" className="text-primary" size={24} />
                  <span className="text-lg">info@chinoiserie.ru</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Icon name="Clock" className="text-primary" size={24} />
                  <span className="text-lg">Пн-Сб: 10:00 - 20:00, Вс: 11:00 - 18:00</span>
                </div>
              </div>

              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Связаться с нами
                <Icon name="MessageCircle" className="ml-2" size={20} />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="https://cdn.poehali.dev/files/abd9cfe2-f31a-443d-bc01-bea3c9be053a.png" alt="Архив № 8" className="h-12 w-12 object-contain" />
              </div>
              <p className="text-primary-foreground/80 font-body">
                Вещи с историей
              </p>
            </div>
            <div>
              <h4 className="font-serif font-semibold mb-4">Навигация</h4>
              <div className="space-y-2 text-primary-foreground/80">
                <div className="cursor-pointer hover:text-primary-foreground transition-colors" onClick={() => scrollToSection('catalog')}>Каталог</div>
                <div className="cursor-pointer hover:text-primary-foreground transition-colors" onClick={() => scrollToSection('about')}>О нас</div>
                <div className="cursor-pointer hover:text-primary-foreground transition-colors" onClick={() => scrollToSection('services')}>Услуги</div>
              </div>
            </div>
            <div>
              <h4 className="font-serif font-semibold mb-4">Следите за нами</h4>
              <div className="flex gap-4">
                <div className="cursor-pointer hover:scale-110 transition-transform">
                  <Icon name="Instagram" size={24} />
                </div>
                <div className="cursor-pointer hover:scale-110 transition-transform">
                  <Icon name="Facebook" size={24} />
                </div>
                <div className="cursor-pointer hover:scale-110 transition-transform">
                  <Icon name="Send" size={24} />
                </div>
              </div>
            </div>
          </div>
          <Separator className="bg-primary-foreground/20 mb-8" />
          <div className="text-center text-primary-foreground/60 font-body">
            © 2025 Архив № 8. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;