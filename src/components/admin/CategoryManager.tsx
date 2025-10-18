import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface Category {
  id: string;
  name: string;
  icon: string;
  sort_order?: number;
}

interface CategoryManagerProps {
  categories: Category[];
  onRefresh: () => void;
  apiUrl: string;
}

const CategoryManager = ({ categories, onRefresh, apiUrl }: CategoryManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    icon: 'Circle'
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await fetch(apiUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, name: formData.name, icon: formData.icon })
        });
      } else {
        await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, sort_order: categories.length })
        });
      }

      setFormData({ id: '', name: '', icon: 'Circle' });
      setEditingId(null);
      setIsAdding(false);
      onRefresh();
    } catch (error) {
      console.error('Ошибка сохранения категории:', error);
      alert('Не удалось сохранить категорию');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      id: category.id,
      name: category.name,
      icon: category.icon
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (id === 'all') {
      alert('Нельзя удалить категорию "Все категории"');
      return;
    }

    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await fetch(`${apiUrl}?id=${categoryToDelete}`, { method: 'DELETE' });
      onRefresh();
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Не удалось удалить категорию');
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ id: '', name: '', icon: 'Circle' });
  };

  const iconOptions = ['Grid', 'Sofa', 'Box', 'Square', 'Table', 'Armchair', 'Lamp', 'Circle', 'Star', 'Heart'];

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-serif">Управление категориями</CardTitle>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} size="sm">
              <Icon name="Plus" className="mr-2" size={16} />
              Добавить категорию
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-muted/20">
            <div className="grid gap-4">
              {!editingId && (
                <div>
                  <Label htmlFor="cat-id">ID категории (латиница) *</Label>
                  <Input
                    id="cat-id"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                    placeholder="furniture_sets"
                    required
                    disabled={!!editingId}
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="cat-name">Название категории *</Label>
                <Input
                  id="cat-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Мебельные гарнитуры"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cat-icon">Иконка</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <Icon name={formData.icon} size={18} />
                        <span>{formData.icon}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(icon => (
                      <SelectItem key={icon} value={icon}>
                        <div className="flex items-center gap-2">
                          <Icon name={icon} size={18} />
                          <span>{icon}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Icon name="Save" className="mr-2" size={16} />
                  {editingId ? 'Сохранить' : 'Добавить'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Отмена
                </Button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <Icon name={category.icon} size={20} className="text-primary" />
                <div>
                  <div className="font-medium">{category.name}</div>
                  <div className="text-xs text-muted-foreground">ID: {category.id}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(category)}
                >
                  <Icon name="Edit" size={14} />
                </Button>
                {category.id !== 'all' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Вы действительно хотите удалить категорию?</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие нельзя будет отменить. Категория будет удалена безвозвратно.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Нет</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Да</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;