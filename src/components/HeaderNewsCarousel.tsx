import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  if (news.length === 0) return null;

  return (
    <div className="w-full bg-gradient-to-r from-primary/5 via-background to-primary/5 border-y border-primary/20">
      <div className="container mx-auto px-4 py-2">
        <div className="relative mx-auto" style={{ width: '70%' }}>
          <div className="overflow-hidden rounded-lg" ref={emblaRef}>
            <div className="flex">
              {news.map((item) => (
                <div key={item.id} className="flex-[0_0_100%] min-w-0">
                  <Link to={`/news/${item.id}`}>
                    <div className="flex items-center gap-4 p-3 hover:bg-primary/5 transition-colors rounded-lg">
                      {item.image_url && (
                        <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {news.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 p-1 rounded-full bg-background/80 backdrop-blur-sm border border-primary/30 hover:bg-primary/10 transition-colors"
                aria-label="Предыдущая новость"
              >
                <ChevronLeft className="h-5 w-5 text-primary" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 p-1 rounded-full bg-background/80 backdrop-blur-sm border border-primary/30 hover:bg-primary/10 transition-colors"
                aria-label="Следующая новость"
              >
                <ChevronRight className="h-5 w-5 text-primary" />
              </button>
            </>
          )}

          {news.length > 1 && (
            <div className="flex justify-center gap-2 mt-3">
              {news.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === selectedIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-primary/30 hover:bg-primary/50'
                  }`}
                  aria-label={`Перейти к новости ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}