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
const ADMIN_PASSWORD = 'Aonddick1';

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    photo_url: '',
    article: '',
    name: '',
    price: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('adminAuth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      loadProducts();
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setPasswordError('');
      loadProducts();
    } else {
      setPasswordError('Неверный пароль');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    setPassword('');
  };

  const loadProducts = async () => {
    setLoading(true);
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl font-serif text-center">
              <Icon name="Lock" className="inline-block mb-2" size={40} />
              <div>Вход в админ-панель</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                  }}
                  placeholder="Введите пароль"
                  required
                  autoFocus
                />
                {passwordError && (
                  <p className="text-sm text-destructive mt-2">{passwordError}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                <Icon name="LogIn" className="mr-2" size={18} />
                Войти
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate('/')}
              >
                <Icon name="Home" className="mr-2" size={18} />
                На главную
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" className="mr-2" size={18} />
              Выйти
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              <Icon name="Home" className="mr-2" size={18} />
              На главную
            </Button>
          </div>
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
                <Label htmlFor="photo_url">Фото</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="photo_url"
                      value={formData.photo_url}
                      onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                      placeholder="https://example.com/photo.jpg или перетащите файл"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={uploadingImage}
                    >
                      <Icon name="Upload" className="mr-2" size={18} />
                      {uploadingImage ? 'Загрузка...' : 'Загрузить'}
                    </Button>
                  </div>
                  
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50'
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      
                      const file = e.dataTransfer.files?.[0];
                      if (!file || !file.type.startsWith('image/')) {
                        alert('Пожалуйста, загрузите изображение');
                        return;
                      }

                      setUploadingImage(true);
                      try {
                        const uploadFormData = new FormData();
                        uploadFormData.append('file', file);

                        const response = await fetch('https://functions.poehali.dev/61f83b29-0bba-4f1d-a1fb-7a8d08e5ca77', {
                          method: 'POST',
                          body: uploadFormData
                        });

                        const data = await response.json();
                        if (data.url) {
                          setFormData(prev => ({ ...prev, photo_url: data.url }));
                        }
                      } catch (error) {
                        console.error('Ошибка загрузки:', error);
                        alert('Не удалось загрузить изображение');
                      } finally {
                        setUploadingImage(false);
                      }
                    }}
                  >
                    <Icon name="ImagePlus" className="mx-auto mb-2" size={40} />
                    <p className="text-muted-foreground">
                      {uploadingImage ? 'Загрузка...' : 'Перетащите изображение сюда'}
                    </p>
                  </div>

                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setUploadingImage(true);
                      try {
                        const uploadFormData = new FormData();
                        uploadFormData.append('file', file);

                        const response = await fetch('https://functions.poehali.dev/61f83b29-0bba-4f1d-a1fb-7a8d08e5ca77', {
                          method: 'POST',
                          body: uploadFormData
                        });

                        const data = await response.json();
                        if (data.url) {
                          setFormData(prev => ({ ...prev, photo_url: data.url }));
                        }
                      } catch (error) {
                        console.error('Ошибка загрузки:', error);
                        alert('Не удалось загрузить изображение');
                      } finally {
                        setUploadingImage(false);
                        e.target.value = '';
                      }
                    }}
                  />
                  
                  {formData.photo_url && (
                    <div className="relative inline-block">
                      <img
                        src={formData.photo_url}
                        alt="Предпросмотр"
                        className="w-32 h-32 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                        onClick={() => setFormData(prev => ({ ...prev, photo_url: '' }))}
                      >
                        <Icon name="X" size={14} />
                      </Button>
                    </div>
                  )}
                </div>
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