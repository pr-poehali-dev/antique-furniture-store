import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="bg-card/80 backdrop-blur-sm border-b border-primary/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <Icon name="ArrowLeft" size={20} />
                На главную
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-primary font-serif">Новости</h1>
            <div className="w-28"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Загрузка новостей...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <Icon name="Newspaper" size={64} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Новостей пока нет</h2>
            <p className="text-muted-foreground">Скоро здесь появятся интересные материалы</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <Link
                key={item.id}
                to={`/news/${item.id}`}
                className="group"
              >
                <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                  {item.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <time className="text-sm text-muted-foreground mb-3">
                      {new Date(item.created_at).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    <h2 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="text-muted-foreground line-clamp-4 flex-1">
                      {item.description}
                    </p>
                    <div className="mt-4 flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                      Читать далее
                      <Icon name="ArrowRight" size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
