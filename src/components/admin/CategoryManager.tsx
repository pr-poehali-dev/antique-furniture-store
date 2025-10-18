import { useState, useEffect } from 'react';
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

const SortableCategory = ({ category, onEdit, onDelete }: { category: Category; onEdit: (cat: Category) => void; onDelete: (id: string) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 bg-background"
    >
      <div className="flex items-center gap-3 flex-1">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <Icon name="GripVertical" size={20} className="text-muted-foreground" />
        </div>
        <Icon name={category.icon} size={20} className="text-primary" />
        <div className="font-medium">{category.name}</div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(category)}
        >
          <Icon name="Edit" size={14} />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(category.id)}
        >
          <Icon name="Trash2" size={14} />
        </Button>
      </div>
    </div>
  );
};

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
  const [localCategories, setLocalCategories] = useState<Category[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response;
      if (editingId) {
        response = await fetch(apiUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, name: formData.name, icon: formData.icon })
        });
      } else {
        const generatedId = formData.name.toLowerCase().replace(/[^а-яa-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: generatedId, name: formData.name, icon: formData.icon, sort_order: categories.length })
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось сохранить категорию');
      }

      setFormData({ id: '', name: '', icon: 'Circle' });
      setEditingId(null);
      setIsAdding(false);
      onRefresh();
    } catch (error) {
      console.error('Ошибка сохранения категории:', error);
      alert(error instanceof Error ? error.message : 'Не удалось сохранить категорию');
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localCategories.findIndex((cat) => cat.id === active.id);
      const newIndex = localCategories.findIndex((cat) => cat.id === over.id);

      const newOrder = arrayMove(localCategories, oldIndex, newIndex);
      setLocalCategories(newOrder);

      try {
        await Promise.all(
          newOrder.map((cat, index) =>
            fetch(apiUrl, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: cat.id, name: cat.name, icon: cat.icon, sort_order: index }),
            })
          )
        );
      } catch (error) {
        console.error('Ошибка обновления порядка:', error);
        setLocalCategories(categories.filter(cat => cat.id !== 'all'));
      }
    }
  };

  const iconOptions = ['Grid', 'Sofa', 'Box', 'Square', 'Table', 'Armchair', 'Lamp', 'Circle', 'Star', 'Heart'];

  useEffect(() => {
    if (categories.length > 0) {
      setLocalCategories(categories.filter(cat => cat.id !== 'all'));
    }
  }, [categories]);

  const sortedCategories = localCategories;

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
                        <Icon name={icon} size={18} />
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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedCategories.map(cat => cat.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {sortedCategories.map((category) => (
                <SortableCategory
                  key={category.id}
                  category={category}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

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