import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  content: string;
  created_at: string;
}

interface NewsModalProps {
  newsId: number | null;
  onClose: () => void;
}

const NEWS_API_URL = 'https://functions.poehali.dev/05ddf1e7-d042-40bb-9dd1-7d5c49603cbf';

export default function NewsModal({ newsId, onClose }: NewsModalProps) {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!newsId) {
      setNews(null);
      return;
    }

    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${NEWS_API_URL}?id=${newsId}`);
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Ошибка загрузки новости:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [newsId]);

  useEffect(() => {
    if (newsId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [newsId]);

  if (!newsId) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background rounded-full"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : news ? (
          <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
            {news.image_url && (
              <div className="w-full aspect-video overflow-hidden">
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
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Новость не найдена</p>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary) / 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }
      `}</style>
    </div>
  );
}
