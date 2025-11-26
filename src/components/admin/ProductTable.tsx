import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  description?: string;
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

const SortableProductRow = ({ product, categories, selectedIds, onToggleSelect, onEdit, onDelete, onToggleVisibility, onCategoryChange, visibleColumns }: any) => {
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
    <tr ref={setNodeRef} style={style} className="border-b hover:bg-muted/50 bg-background h-16">
      <td className="p-2">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <Icon name="GripVertical" size={16} className="text-muted-foreground" />
        </div>
      </td>
      <td className="p-2">
        <Checkbox
          checked={selectedIds.includes(product.id)}
          onCheckedChange={() => onToggleSelect(product.id)}
        />
      </td>
      {visibleColumns.photo && (
        <td className="p-2">
          {product.photo_url ? (
            <img
              src={product.photo_url}
              alt={product.name}
              className="w-12 h-12 object-cover rounded border border-border"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">Нет фото</div>';
                }
              }}
            />
          ) : (
            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
              <Icon name="ImageOff" size={16} className="text-muted-foreground" />
            </div>
          )}
        </td>
      )}
      {visibleColumns.article && <td className="p-2 text-sm">{product.article}</td>}
      {visibleColumns.name && <td className="p-2 text-sm max-w-[150px] truncate" title={product.name}>{product.name}</td>}
      {visibleColumns.category && (
        <td className="p-2">
          <Select 
            value={product.category || 'all'} 
            onValueChange={(value) => onCategoryChange(product.id, value)}
          >
            <SelectTrigger className="w-[140px] h-8 text-xs">
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
      )}
      {visibleColumns.price && <td className="p-2 text-sm whitespace-nowrap">{parseFloat(product.price).toLocaleString('ru-RU')} ₽</td>}
      {visibleColumns.description && (
        <td className="p-2 max-w-[120px]">
          <div className="text-xs text-muted-foreground truncate" title={product.description || ''}>
            {product.description || '—'}
          </div>
        </td>
      )}
      {visibleColumns.visibility && (
        <td className="p-2">
          <div className="flex items-center gap-1">
            <Checkbox
              checked={product.is_visible !== false}
              onCheckedChange={(checked) => onToggleVisibility(product.id, checked as boolean)}
            />
            <span className="text-xs text-muted-foreground">
              {product.is_visible !== false ? 'На сайте' : 'Скрыт'}
            </span>
          </div>
        </td>
      )}
      <td className="p-2">
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => onEdit(product)}>
            <Icon name="Edit" size={12} />
          </Button>
          <Button variant="destructive" size="sm" className="h-7 w-7 p-0" onClick={() => onDelete(product.id)}>
            <Icon name="Trash2" size={12} />
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
  const [visibleColumns, setVisibleColumns] = useState({
    photo: true,
    article: true,
    name: true,
    category: true,
    price: true,
    description: true,
    visibility: true
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (products.length > 0) {
      setLocalProducts(products);
    }
  }, [products]);

  const filteredProducts = filterCategory === 'all' 
    ? localProducts
    : localProducts.filter(p => p.category === filterCategory);

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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Icon name="Settings2" size={16} className="mr-2" />
                  Колонки
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Видимые колонки</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={visibleColumns.photo}
                        onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, photo: checked as boolean }))}
                      />
                      <span className="text-sm">Фото</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={visibleColumns.article}
                        onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, article: checked as boolean }))}
                      />
                      <span className="text-sm">Артикул</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={visibleColumns.name}
                        onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, name: checked as boolean }))}
                      />
                      <span className="text-sm">Название</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={visibleColumns.category}
                        onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, category: checked as boolean }))}
                      />
                      <span className="text-sm">Категория</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={visibleColumns.price}
                        onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, price: checked as boolean }))}
                      />
                      <span className="text-sm">Цена</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={visibleColumns.description}
                        onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, description: checked as boolean }))}
                      />
                      <span className="text-sm">Описание</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={visibleColumns.visibility}
                        onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, visibility: checked as boolean }))}
                      />
                      <span className="text-sm">Видимость</span>
                    </label>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
        <div className="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto">
          <table className="w-full table-fixed">
            <thead className="sticky top-0 bg-background z-10">
              <tr className="border-b">
                <th className="text-left p-2 w-8"></th>
                <th className="text-left p-2 w-8"></th>
                {visibleColumns.photo && <th className="text-left p-2 w-16">Фото</th>}
                {visibleColumns.article && <th className="text-left p-2 w-24">Артикул</th>}
                {visibleColumns.name && <th className="text-left p-2 w-36">Наименование</th>}
                {visibleColumns.category && (
                  <th className="text-left p-2 w-40">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-[140px] h-7 text-xs">
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
                )}
                {visibleColumns.price && <th className="text-left p-2 w-28">Цена</th>}
                {visibleColumns.description && <th className="text-left p-2 w-32">Описание</th>}
                {visibleColumns.visibility && <th className="text-left p-2 w-28">Отображать</th>}
                <th className="text-left p-2 w-20">Действия</th>
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
                      visibleColumns={visibleColumns}
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