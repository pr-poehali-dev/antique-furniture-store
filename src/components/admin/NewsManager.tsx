import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  content: string;
  created_at: string;
  published: boolean;
}

const NEWS_API_URL = 'https://functions.poehali.dev/05ddf1e7-d042-40bb-9dd1-7d5c49603cbf';

export default function NewsManager() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    content: '',
    published: true
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${NEWS_API_URL}?published=false`);
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
      toast.error('Ошибка загрузки новостей');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId 
        ? { ...formData, id: editingId }
        : formData;

      const response = await fetch(NEWS_API_URL, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Ошибка сохранения');

      toast.success(editingId ? 'Новость обновлена' : 'Новость создана');
      resetForm();
      loadNews();
    } catch (error) {
      console.error('Ошибка:', error);
      toast.error('Ошибка сохранения новости');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      content: item.content,
      published: item.published
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    setNewsToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!newsToDelete) return;
    
    try {
      const response = await fetch(`${NEWS_API_URL}?id=${newsToDelete}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Ошибка удаления');

      toast.success('Новость удалена');
      loadNews();
    } catch (error) {
      console.error('Ошибка:', error);
      toast.error('Ошибка удаления новости');
    } finally {
      setDeleteDialogOpen(false);
      setNewsToDelete(null);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      content: '',
      published: true
    });
  };

  const togglePublished = async (id: number, currentState: boolean) => {
    try {
      const response = await fetch(NEWS_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, published: !currentState })
      });

      if (!response.ok) throw new Error('Ошибка обновления');

      toast.success(currentState ? 'Новость скрыта' : 'Новость опубликована');
      loadNews();
    } catch (error) {
      console.error('Ошибка:', error);
      toast.error('Ошибка обновления статуса');
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Newspaper" size={24} />
            {editingId ? 'Редактировать новость' : 'Создать новость'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Заголовок *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Введите заголовок новости"
              />
            </div>

            <div>
              <Label htmlFor="description">Краткое описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Краткое описание для карточки новости"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="image_url">URL изображения</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="content">Полный текст новости *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                placeholder="Введите полный текст новости"
                rows={8}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published">Опубликовать</Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                <Icon name="Save" className="mr-2" size={18} />
                {editingId ? 'Сохранить' : 'Создать'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Отмена
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Все новости</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && news.length === 0 ? (
            <div className="text-center py-8">Загрузка...</div>
          ) : news.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Новостей пока нет
            </div>
          ) : (
            <div className="space-y-4">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${item.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {item.published ? 'Опубликовано' : 'Черновик'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePublished(item.id, item.published)}
                      >
                        <Icon name={item.published ? 'EyeOff' : 'Eye'} size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Icon name="Trash" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить новость?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Новость будет удалена безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
