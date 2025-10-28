import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

const NEWS_API_URL = 'https://functions.poehali.dev/05ddf1e7-d042-40bb-9dd1-7d5c49603cbf';

export default function NewsCarousel() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

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

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  if (news.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Новости</h2>
          <Link to="/news">
            <Button variant="outline">Все новости</Button>
          </Link>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0"
                >
                  <Link to={`/news/${item.id}`}>
                    <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                      {item.image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-foreground line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {item.description}
                        </p>
                        <time className="text-sm text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString('ru-RU')}
                        </time>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {news.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-background/80 backdrop-blur-sm"
                onClick={scrollPrev}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background/80 backdrop-blur-sm"
                onClick={scrollNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
