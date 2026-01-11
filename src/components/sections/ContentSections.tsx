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
          <div className="grid md:grid-cols-2 gap-12 items-center animate-fade-in mb-16">
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
            <div className="aspect-square rounded-lg overflow-hidden border-2 border-primary/20">
              <img 
                src="https://cdn.poehali.dev/files/478a911a-d0b3-4dde-ba70-1be8f4dd3d6b.jpg" 
                alt="Интерьер салона Архив № 8" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center animate-fade-in">
            <div className="rounded-lg overflow-hidden border-2 border-primary/20 h-[400px]">
              <iframe 
                src="https://yandex.ru/map-widget/v1/?ll=37.636340%2C55.734770&z=17&l=map&pt=37.636340,55.734770,pm2rdm"
                width="100%" 
                height="100%" 
                frameBorder="0"
                allowFullScreen
                style={{ position: 'relative' }}
              />
            </div>
            <div>
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-3xl font-serif font-bold text-primary mb-6">Посетите нас</h3>
              <p className="text-lg text-muted-foreground font-body leading-relaxed">
                Мы всегда рады вас встретить в нашем салоне по указанному адресу, где вы сможете увидеть и почувствовать наши предметы. (Визит по согласованию)
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-24 bg-background">
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
                <span className="text-lg">Москва, ул. Садовническая, д. 61с1</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  <Icon name="Phone" className="text-primary" size={24} />
                  <span className="text-lg">Катерина: +7 (926) 372-81-66</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Phone" className="text-primary" size={24} />
                  <span className="text-lg">Ольга: +7 (950) 627-47-79</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Icon name="Clock" className="text-primary" size={24} />
                <span className="text-lg">По согласованию и предварительной договоренности</span>
              </div>
            </div>

            <a href="https://t.me/olga6274779" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Связаться с нами
                <Icon name="MessageCircle" className="ml-2" size={20} />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-8">
            <div className="text-center">
              <h4 className="font-serif font-semibold mb-4 text-xl">Следите за нами</h4>
              <div className="flex gap-6 justify-center">
                <a href="https://t.me/olga6274779" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:scale-110 transition-transform">
                  <Icon name="Send" size={32} />
                </a>
                <a href="https://pin.it/59ES10Xqo" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
            <Separator className="bg-primary-foreground/20 w-full" />
            <div className="text-center text-primary-foreground font-body text-lg">
              © 2025 Архив № 8. Все права защищены.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ContentSections;