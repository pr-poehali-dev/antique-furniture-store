import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  activeSection: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
  scrollToSection: (sectionId: string) => void;
}

const Header = ({ activeSection, isMobileMenuOpen, setIsMobileMenuOpen, scrollToSection }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300" style={{ backgroundImage: 'url(https://cdn.poehali.dev/projects/56ebf005-4988-4a0c-b185-3a027ae2f02a/files/d1331506-d80a-410c-bef0-f2011b114ab6.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className={`backdrop-blur-sm transition-colors duration-300 ${isScrolled ? 'bg-background/95' : 'bg-background/85'}`}>
        <nav className="container mx-auto px-4 md:px-6 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <img src="https://cdn.poehali.dev/files/abd9cfe2-f31a-443d-bc01-bea3c9be053a.png" alt="Архив № 8" className="h-20 w-20 md:h-40 md:w-40 object-contain" />
              <h1 className="text-2xl md:text-5xl font-bold bg-gradient-to-br from-primary/80 via-amber-300/70 to-primary/80 bg-clip-text text-transparent animate-shimmer uppercase tracking-wider md:tracking-widest" style={{ fontFamily: 'Cardo, serif', textShadow: '0 0 15px rgba(217, 178, 95, 0.3), 0 0 30px rgba(217, 178, 95, 0.2)' }}>
                Архив №8
              </h1>
            </div>

            <button
              className="md:hidden text-primary p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={32} />
            </button>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scrollToSection('home')}
                className={`text-[22px] px-5 py-2 rounded transition-all duration-300 hover:scale-110 border border-transparent hover:border-primary ${activeSection === 'home' ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
              >
                Главная
              </button>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-primary to-transparent"></div>
              <button
                onClick={() => scrollToSection('catalog')}
                className={`text-[22px] px-5 py-2 rounded transition-all duration-300 hover:scale-110 border border-transparent hover:border-primary ${activeSection === 'catalog' ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
              >
                Каталог
              </button>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-primary to-transparent"></div>
              <button
                onClick={() => scrollToSection('about')}
                className={`text-[22px] px-5 py-2 rounded transition-all duration-300 hover:scale-110 border border-transparent hover:border-primary ${activeSection === 'about' ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
              >
                О нас
              </button>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-primary to-transparent"></div>
              <button
                onClick={() => scrollToSection('contacts')}
                className={`text-[22px] px-5 py-2 rounded transition-all duration-300 hover:scale-110 border border-transparent hover:border-primary ${activeSection === 'contacts' ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
              >
                Контакты
              </button>
            </div>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-sm border-t border-primary/30 animate-slide-down">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <button
                onClick={() => scrollToSection('home')}
                className={`text-lg px-4 py-3 rounded text-left transition-all duration-300 hover:bg-primary/10 ${activeSection === 'home' ? 'text-primary font-semibold border border-primary' : 'text-foreground'}`}
              >
                Главная
              </button>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
              <button
                onClick={() => scrollToSection('catalog')}
                className={`text-lg px-4 py-3 rounded text-left transition-all duration-300 hover:bg-primary/10 ${activeSection === 'catalog' ? 'text-primary font-semibold border border-primary' : 'text-foreground'}`}
              >
                Каталог
              </button>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
              <button
                onClick={() => scrollToSection('about')}
                className={`text-lg px-4 py-3 rounded text-left transition-all duration-300 hover:bg-primary/10 ${activeSection === 'about' ? 'text-primary font-semibold border border-primary' : 'text-foreground'}`}
              >
                О нас
              </button>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
              <button
                onClick={() => scrollToSection('contacts')}
                className={`text-lg px-4 py-3 rounded text-left transition-all duration-300 hover:bg-primary/10 ${activeSection === 'contacts' ? 'text-primary font-semibold border border-primary' : 'text-foreground'}`}
              >
                Контакты
              </button>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
              <a
                href="/news"
                className="text-lg px-4 py-3 rounded text-left transition-all duration-300 hover:bg-primary/10 text-foreground flex items-center gap-2"
              >
                <Icon name="Newspaper" size={20} />
                Все новости
              </a>
            </div>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-2 md:h-4 bg-gradient-to-r from-primary/60 via-primary to-primary/60" style={{ 
        backgroundImage: 'url(https://cdn.poehali.dev/projects/56ebf005-4988-4a0c-b185-3a027ae2f02a/files/d3f84441-5f28-4e05-952c-9f9451305ca4.jpg)', 
        backgroundSize: 'auto 100%',
        backgroundRepeat: 'repeat-x',
        backgroundPosition: 'center',
        boxShadow: '0 2px 15px rgba(217, 178, 95, 0.6), 0 0 30px rgba(217, 178, 95, 0.4)'
      }}></div>
    </header>
  );
};

export default Header;