import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface ContentSectionsProps {
  scrollToSection: (sectionId: string) => void;
}

const ContentSections = ({ scrollToSection }: ContentSectionsProps) => {
  return (
    <>
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
            <div className="space-y-6">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-primary/20">
                <img 
                  src="https://cdn.poehali.dev/files/478a911a-d0b3-4dde-ba70-1be8f4dd3d6b.jpg" 
                  alt="Интерьер салона Архив № 8" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden border-2 border-primary/20 h-[400px]">
                <iframe 
                  src="https://yandex.ru/map-widget/v1/?ll=37.640892%2C55.736893&z=17&l=map&pt=37.640892,55.736893,pm2rdm"
                  width="100%" 
                  height="100%" 
                  frameBorder="0"
                  allowFullScreen
                  style={{ position: 'relative' }}
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
    </>
  );
};

export default ContentSections;
