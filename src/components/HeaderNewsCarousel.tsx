import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewsModal from '@/components/NewsModal';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
}

const NEWS_API_URL = 'https://functions.poehali.dev/05ddf1e7-d042-40bb-9dd1-7d5c49603cbf';

export default function HeaderNewsCarousel() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openNewsId, setOpenNewsId] = useState<number | null>(null);
  const autoplay = Autoplay({ delay: 7000, stopOnInteraction: false, stopOnMouseEnter: true });
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 20 },
    [autoplay]
  );

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(NEWS_API_URL);
        const data = await response.json();
        setNews(data.slice(0, 5));
      } catch (error) {
        console.error('Ошибка загрузки новостей:', error);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  const handleNewsClick = (newsId: number) => {
    setOpenNewsId(newsId);
  };

  const handleCloseModal = () => {
    setOpenNewsId(null);
  };

  if (news.length === 0) return null;

  return (
    <>
    <div className="w-full bg-gradient-to-br from-primary/10 via-background to-primary/5 border-b border-primary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="relative mx-auto" style={{ width: '70%' }}>
          <div className="overflow-hidden rounded-xl shadow-2xl" ref={emblaRef}>
            <div className="flex">
              {news.map((item, index) => (
                <div key={item.id} className="flex-[0_0_100%] min-w-0">
                  <div 
                    className={`relative bg-card hover:shadow-3xl transition-all duration-500 cursor-pointer ${
                      index === selectedIndex 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-95'
                    }`}
                    style={{
                      transition: 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out'
                    }}
                    onClick={() => handleNewsClick(item.id)}
                  >
                    {item.image_url && (
                      <div className="w-full aspect-[21/9] overflow-hidden">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className={`w-full h-full object-cover transition-all duration-700 ${
                            index === selectedIndex ? 'scale-100' : 'scale-110'
                          }`}
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                      <div className="p-8 w-full">
                        <h3 className={`text-3xl md:text-4xl font-bold text-white mb-3 transition-all duration-500 ${
                          index === selectedIndex ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        }`}>
                          {item.title}
                        </h3>
                        <p className={`text-lg text-white/90 line-clamp-2 mb-4 transition-all duration-700 delay-100 ${
                          index === selectedIndex ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        }`}>
                          {item.description}
                        </p>
                        <Button
                          variant="default"
                          className={`transition-all duration-700 delay-200 ${
                            index === selectedIndex ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNewsClick(item.id);
                          }}
                        >
                          Читать полностью
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {news.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 md:-translate-x-16 p-3 rounded-full bg-background/90 backdrop-blur-sm border-2 border-primary/40 hover:bg-primary/20 hover:border-primary transition-all shadow-lg"
                aria-label="Предыдущая новость"
              >
                <ChevronLeft className="h-6 w-6 text-primary" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 md:translate-x-16 p-3 rounded-full bg-background/90 backdrop-blur-sm border-2 border-primary/40 hover:bg-primary/20 hover:border-primary transition-all shadow-lg"
                aria-label="Следующая новость"
              >
                <ChevronRight className="h-6 w-6 text-primary" />
              </button>
            </>
          )}

          {news.length > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <div className="flex gap-3">
                {news.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      index === selectedIndex
                        ? 'w-12 bg-primary shadow-lg shadow-primary/50'
                        : 'w-3 bg-primary/30 hover:bg-primary/60'
                    }`}
                    aria-label={`Перейти к новости ${index + 1}`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => window.location.href = '/news'}
              >
                Все новости
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>

    <NewsModal newsId={openNewsId} onClose={handleCloseModal} />
    </>
  );
}