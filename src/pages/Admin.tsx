import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  photo_url: string;
  article: string;
  name: string;
  price: string;
  created_at: string;
}

const API_URL = 'https://functions.poehali.dev/60f2060b-ddaf-4a36-adc7-ab19b94dcbf2';

const Admin = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    photo_url: '',
    article: '',
    name: '',
    price: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: parseFloat(formData.price)
    };

    try {
      if (editingId) {
        await fetch(API_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingId })
        });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      setFormData({ photo_url: '', article: '', name: '', price: '' });
      setEditingId(null);
      loadProducts();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      photo_url: product.photo_url,
      article: product.article,
      name: product.name,
      price: product.price
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить товар?')) return;

    try {
      await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      loadProducts();
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ photo_url: '', article: '', name: '', price: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary">Админ-панель</h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            <Icon name="Home" className="mr-2" size={18} />
            На главную
          </Button>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-serif">
              {editingId ? 'Редактировать товар' : 'Добавить товар'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="photo_url">Фото (URL)</Label>
                <Input
                  id="photo_url"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div>
                <Label htmlFor="article">Артикул *</Label>
                <Input
                  id="article"
                  value={formData.article}
                  onChange={(e) => setFormData({ ...formData, article: e.target.value })}
                  placeholder="ART-001"
                  required
                />
              </div>

              <div>
                <Label htmlFor="name">Наименование *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Название товара"
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Цена *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="5000"
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  <Icon name={editingId ? "Save" : "Plus"} className="mr-2" size={18} />
                  {editingId ? 'Сохранить' : 'Добавить'}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Отмена
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
            Все товары ({products.length})
          </h2>

          {products.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Товары не найдены. Добавьте первый товар!
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4 items-start">
                      {product.photo_url && (
                        <img
                          src={product.photo_url}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded border"
                        />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              Артикул: {product.article}
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                              {product.name}
                            </h3>
                            <div className="text-2xl font-bold text-primary">
                              {parseFloat(product.price).toLocaleString('ru-RU')} ₽
                            </div>
                          </div>

                          <div className="flex gap-2 shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(product)}
                            >
                              <Icon name="Edit" size={16} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
