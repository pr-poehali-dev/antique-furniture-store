import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/admin/LoginForm';
import ProductForm from '@/components/admin/ProductForm';
import ProductTable from '@/components/admin/ProductTable';
import ExcelImport from '@/components/admin/ExcelImport';
import ExcelImportInfo from '@/components/admin/ExcelImportInfo';
import CategoryManager from '@/components/admin/CategoryManager';
import NewsManager from '@/components/admin/NewsManager';
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

interface Product {
  id: number;
  photo_url: string;
  main_image?: string;
  article: string;
  name: string;
  price: string;
  created_at: string;
  is_visible?: boolean;
  category?: string;
  sort_order?: number;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  sort_order?: number;
}

const API_URL = 'https://functions.poehali.dev/60f2060b-ddaf-4a36-adc7-ab19b94dcbf2';
const CATEGORIES_API_URL = 'https://functions.poehali.dev/19719648-b1bf-45a7-9488-4c9fe354fbb0';

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    photo_url: '',
    main_image: '',
    article: '',
    name: '',
    price: '',
    category: 'all',
    description: ''
  });
  const [importingExcel, setImportingExcel] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'news'>('products');

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('adminAuth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      loadProducts();
      loadCategories();
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('adminAuth', 'true');
    loadProducts();
    loadCategories();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
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

  const loadCategories = async () => {
    try {
      const response = await fetch(CATEGORIES_API_URL);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
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

      setFormData({ photo_url: '', main_image: '', article: '', name: '', price: '', category: 'all', description: '' });
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
      main_image: product.main_image || '',
      article: product.article,
      name: product.name,
      price: product.price,
      category: product.category || 'all',
      description: product.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await fetch(`${API_URL}?id=${productToDelete}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== productToDelete));
    } catch (error) {
      console.error('Ошибка удаления:', error);
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleBulkDelete = async (ids: number[]) => {
    try {
      await Promise.all(
        ids.map(id => fetch(`${API_URL}?id=${id}`, { method: 'DELETE' }))
      );
      setProducts(prev => prev.filter(p => !ids.includes(p.id)));
    } catch (error) {
      console.error('Ошибка массового удаления:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ photo_url: '', main_image: '', article: '', name: '', price: '', category: 'all', description: '' });
  };

  const handleToggleVisibility = async (id: number, visible: boolean) => {
    try {
      await fetch(API_URL, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_visible: visible })
      });
      setProducts(prev => prev.map(p => 
        p.id === id ? { ...p, is_visible: visible } : p
      ));
    } catch (error) {
      console.error('Ошибка обновления видимости:', error);
    }
  };

  const handleBulkToggleVisibility = async (ids: number[], visible: boolean) => {
    try {
      await Promise.all(
        ids.map(id => fetch(API_URL, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, is_visible: visible })
        }))
      );
      setProducts(prev => prev.map(p => 
        ids.includes(p.id) ? { ...p, is_visible: visible } : p
      ));
    } catch (error) {
      console.error('Ошибка массового обновления видимости:', error);
    }
  };

  const handleCategoryChange = async (id: number, category: string) => {
    try {
      await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, category })
      });
      setProducts(prev => prev.map(p => 
        p.id === id ? { ...p, category } : p
      ));
    } catch (error) {
      console.error('Ошибка обновления категории:', error);
    }
  };

  const handleSortOrderChange = async (updatedProducts: Product[]) => {
    try {
      await Promise.all(
        updatedProducts.map((product, index) =>
          fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: product.id, sort_order: index })
          })
        )
      );
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Ошибка обновления порядка:', error);
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
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
            <ExcelImport
              importingExcel={importingExcel}
              onImportStart={() => setImportingExcel(true)}
              onImportEnd={() => setImportingExcel(false)}
              onImportSuccess={loadProducts}
              apiUrl={API_URL}
            />
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

        <div className="bg-card rounded-lg p-2 mb-8 flex gap-2">
          <Button
            variant={activeTab === 'products' ? 'default' : 'outline'}
            onClick={() => setActiveTab('products')}
            className="flex-1"
          >
            <Icon name="Package" className="mr-2" size={18} />
            Товары
          </Button>
          <Button
            variant={activeTab === 'news' ? 'default' : 'outline'}
            onClick={() => setActiveTab('news')}
            className="flex-1"
          >
            <Icon name="Newspaper" className="mr-2" size={18} />
            Новости
          </Button>
        </div>

        {activeTab === 'products' ? (
          <>
            <ExcelImportInfo />

            <CategoryManager
              categories={categories}
              onRefresh={loadCategories}
              apiUrl={CATEGORIES_API_URL}
            />

            <ProductForm
              formData={formData}
              editingId={editingId}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              onFormDataChange={setFormData}
            />

            <ProductTable
              products={products}
              categories={categories}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onBulkDelete={handleBulkDelete}
              onToggleVisibility={handleToggleVisibility}
              onBulkToggleVisibility={handleBulkToggleVisibility}
              onCategoryChange={handleCategoryChange}
              onSortOrderChange={handleSortOrderChange}
            />
          </>
        ) : (
          <NewsManager />
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Вы действительно хотите удалить товар?</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие нельзя будет отменить. Товар будет удален безвозвратно.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Нет</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Да</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Admin;