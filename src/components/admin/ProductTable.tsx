import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  photo_url: string;
  article: string;
  name: string;
  price: string;
  created_at: string;
  is_visible?: boolean;
}

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onBulkDelete: (ids: number[]) => void;
  onToggleVisibility: (id: number, visible: boolean) => void;
}

const ProductTable = ({ products, onEdit, onDelete, onBulkDelete, onToggleVisibility }: ProductTableProps) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Удалить выбранные товары (${selectedIds.length} шт.)?`)) return;
    onBulkDelete(selectedIds);
    setSelectedIds([]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-serif">Список товаров</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedIds.length === products.length && products.length > 0 ? "default" : "outline"}
              size="sm"
              onClick={toggleSelectAll}
            >
              <Icon name="CheckSquare" size={16} className="mr-2" />
              {selectedIds.length === products.length && products.length > 0 ? "Снять выбор" : "Выбрать все"}
            </Button>
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Icon name="Trash2" size={16} className="mr-2" />
                Удалить выбранные ({selectedIds.length})
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 w-12">
                  <Checkbox
                    checked={selectedIds.length === products.length && products.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="text-left p-3">Фото</th>
                <th className="text-left p-3">Артикул</th>
                <th className="text-left p-3">Наименование</th>
                <th className="text-left p-3">Цена</th>
                <th className="text-left p-3 w-40">Отображать</th>
                <th className="text-left p-3">Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-muted/50">
                  <td className="p-3">
                    <Checkbox
                      checked={selectedIds.includes(product.id)}
                      onCheckedChange={() => toggleSelect(product.id)}
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(product)}
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(product.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
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