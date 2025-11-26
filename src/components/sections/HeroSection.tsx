import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
}

const HeroSection = ({ scrollToSection }: HeroSectionProps) => {
  return (
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
  );
};

export default HeroSection;
