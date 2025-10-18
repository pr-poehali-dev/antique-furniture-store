import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
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

interface Product {
  id: number;
  photo_url: string;
  article: string;
  name: string;
  price: string;
  created_at: string;
  is_visible?: boolean;
  category?: string;
  sort_order?: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onBulkDelete: (ids: number[]) => void;
  onToggleVisibility: (id: number, visible: boolean) => void;
  onBulkToggleVisibility: (ids: number[], visible: boolean) => void;
  onCategoryChange: (id: number, category: string) => void;
  onSortOrderChange: (products: Product[]) => void;
}

const SortableProductRow = ({ product, categories, selectedIds, onToggleSelect, onEdit, onDelete, onToggleVisibility, onCategoryChange }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-b hover:bg-muted/50 bg-background">
      <td className="p-3">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <Icon name="GripVertical" size={20} className="text-muted-foreground" />
        </div>
      </td>
      <td className="p-3">
        <Checkbox
          checked={selectedIds.includes(product.id)}
          onCheckedChange={() => onToggleSelect(product.id)}
        />
      </td>
      <td className="p-3">
        {product.photo_url ? (
          <img
            src={product.photo_url}
            alt={product.name}
            className="w-20 h-20 object-cover rounded border border-border"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                parent.innerHTML = '<div class="w-20 h-20 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">Нет фото</div>';
              }
            }}
          />
        ) : (
          <div className="w-20 h-20 bg-muted rounded flex items-center justify-center">
            <Icon name="ImageOff" size={24} className="text-muted-foreground" />
          </div>
        )}
      </td>
      <td className="p-3">{product.article}</td>
      <td className="p-3">{product.name}</td>
      <td className="p-3">
        <Select 
          value={product.category || 'all'} 
          onValueChange={(value) => onCategoryChange(product.id, value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat: Category) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="p-3">{parseFloat(product.price).toLocaleString('ru-RU')} ₽</td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={product.is_visible !== false}
            onCheckedChange={(checked) => onToggleVisibility(product.id, checked as boolean)}
          />
          <span className="text-sm text-muted-foreground">
            {product.is_visible !== false ? 'На сайте' : 'Скрыт'}
          </span>
        </div>
      </td>
      <td className="p-3">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
            <Icon name="Edit" size={14} />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(product.id)}>
            <Icon name="Trash2" size={14} />
          </Button>
        </div>
      </td>
    </tr>
  );
};

const ProductTable = ({ products, categories, onEdit, onDelete, onBulkDelete, onToggleVisibility, onBulkToggleVisibility, onCategoryChange, onSortOrderChange }: ProductTableProps) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [localProducts, setLocalProducts] = useState<Product[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredProducts = filterCategory === 'all' 
    ? (localProducts.length > 0 ? localProducts : products)
    : (localProducts.length > 0 ? localProducts : products).filter(p => p.category === filterCategory);

  if (localProducts.length === 0 && products.length > 0) {
    setLocalProducts(products);
  }

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Удалить выбранные товары (${selectedIds.length} шт.)?`)) return;
    onBulkDelete(selectedIds);
    setSelectedIds([]);
  };

  const handleBulkShow = () => {
    if (selectedIds.length === 0) return;
    onBulkToggleVisibility(selectedIds, true);
    setSelectedIds([]);
  };

  const handleBulkHide = () => {
    if (selectedIds.length === 0) return;
    onBulkToggleVisibility(selectedIds, false);
    setSelectedIds([]);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localProducts.findIndex((p) => p.id === active.id);
      const newIndex = localProducts.findIndex((p) => p.id === over.id);

      const newOrder = arrayMove(localProducts, oldIndex, newIndex);
      setLocalProducts(newOrder);
      onSortOrderChange(newOrder);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-serif">Список товаров</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedIds.length === filteredProducts.length && filteredProducts.length > 0 ? "default" : "outline"}
              size="sm"
              onClick={toggleSelectAll}
            >
              <Icon name="CheckSquare" size={16} className="mr-2" />
              {selectedIds.length === filteredProducts.length && filteredProducts.length > 0 ? "Снять выбор" : "Выбрать все"}
            </Button>
            {selectedIds.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkShow}
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <Icon name="Eye" size={16} className="mr-2" />
                  Показать ({selectedIds.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkHide}
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  <Icon name="EyeOff" size={16} className="mr-2" />
                  Скрыть ({selectedIds.length})
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Удалить ({selectedIds.length})
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 w-12"></th>
                <th className="text-left p-3 w-12"></th>
                <th className="text-left p-3">Фото</th>
                <th className="text-left p-3">Артикул</th>
                <th className="text-left p-3">Наименование</th>
                <th className="text-left p-3">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[180px] h-8">
                      <SelectValue placeholder="Категория" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </th>
                <th className="text-left p-3">Цена</th>
                <th className="text-left p-3 w-40">Отображать</th>
                <th className="text-left p-3">Действия</th>
              </tr>
            </thead>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredProducts.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <tbody>
                  {filteredProducts.map((product) => (
                    <SortableProductRow
                      key={product.id}
                      product={product}
                      categories={categories}
                      selectedIds={selectedIds}
                      onToggleSelect={toggleSelect}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleVisibility={onToggleVisibility}
                      onCategoryChange={onCategoryChange}
                    />
                  ))}
                </tbody>
              </SortableContext>
            </DndContext>
          </table>
          {products.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Товары не найдены. Добавьте первый товар.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductTable;