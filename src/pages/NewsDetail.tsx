import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const NEWS_API_URL = 'https://functions.poehali.dev/05ddf1e7-d042-40bb-9dd1-7d5c49603cbf';

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${NEWS_API_URL}?id=${id}`);
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Ошибка загрузки новости:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <Icon name="AlertCircle" size={64} className="mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-semibold mb-4">Новость не найдена</h1>
          <Link to="/news">
            <Button>Вернуться к новостям</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="bg-card/80 backdrop-blur-sm border-b border-primary/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <Link to="/news">
            <Button variant="ghost" className="gap-2">
              <Icon name="ArrowLeft" size={20} />
              К списку новостей
            </Button>
          </Link>
        </div>
      </header>

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-card rounded-lg shadow-xl overflow-hidden">
          {news.image_url && (
            <div className="aspect-video overflow-hidden">
              <img
                src={news.image_url}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            <time className="text-sm text-muted-foreground">
              {new Date(news.created_at).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6 font-serif">
              {news.title}
            </h1>

            {news.description && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {news.description}
              </p>
            )}

            <div className="prose prose-lg max-w-none">
              <div
                className="text-foreground leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            </div>

            {news.updated_at && news.updated_at !== news.created_at && (
              <p className="text-sm text-muted-foreground mt-8 pt-8 border-t border-border">
                Обновлено:{' '}
                {new Date(news.updated_at).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/news">
            <Button variant="outline" size="lg">
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Вернуться к новостям
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}
