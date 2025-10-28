import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import NewsModal from '@/components/NewsModal';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

const NEWS_API_URL = 'https://functions.poehali.dev/05ddf1e7-d042-40bb-9dd1-7d5c49603cbf';

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openNewsId, setOpenNewsId] = useState<number | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(NEWS_API_URL);
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Ошибка загрузки новостей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-b border-primary/30">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                Новости
              </h1>
              <p className="text-lg text-muted-foreground">
                Все события и обновления
              </p>
            </div>
            <Link to="/">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Icon name="Home" className="mr-2" size={18} />
                На главную
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-xl text-muted-foreground">Загрузка новостей...</div>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📰</div>
            <div className="text-xl text-muted-foreground mb-4">
              Пока нет новостей
            </div>
            <p className="text-muted-foreground">
              Здесь будут появляться все обновления и события
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <Card 
                key={item.id}
                className="group overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-2xl animate-scale-in cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setOpenNewsId(item.id)}
              >
                <CardContent className="p-0">
                  {item.image_url && (
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="text-sm text-primary font-medium mb-2">
                      {new Date(item.created_at).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <h3 className="text-2xl font-serif font-semibold text-foreground mb-3 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {item.description}
                    </p>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenNewsId(item.id);
                      }}
                    >
                      Читать полностью
                      <Icon name="ArrowRight" className="ml-2" size={18} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>

    <NewsModal newsId={openNewsId} onClose={() => setOpenNewsId(null)} />
    </>
  );
}