import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface ProductFormData {
  photo_url: string;
  article: string;
  name: string;
  price: string;
  category: string;
}

interface ProductFormProps {
  formData: ProductFormData;
  editingId: number | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onFormDataChange: (data: ProductFormData) => void;
}

const ProductForm = ({ formData, editingId, onSubmit, onCancel, onFormDataChange }: ProductFormProps) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = async (file: File) => {
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
        onFormDataChange({ ...formData, photo_url: data.url });
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Не удалось загрузить изображение');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Card className="mb-12">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">
          {editingId ? 'Редактировать товар' : 'Добавить товар'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="photo_url">Фото</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  id="photo_url"
                  value={formData.photo_url}
                  onChange={(e) => onFormDataChange({ ...formData, photo_url: e.target.value })}
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
                  await handleImageUpload(file);
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
                  if (file) {
                    await handleImageUpload(file);
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
                    onClick={() => onFormDataChange({ ...formData, photo_url: '' })}
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
              onChange={(e) => onFormDataChange({ ...formData, article: e.target.value })}
              placeholder="ART-001"
              required
            />
          </div>

          <div>
            <Label htmlFor="name">Наименование *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              placeholder="Название товара"
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Цена *</Label>
            <Input
              id="price"
              type="text"
              value={formData.price}
              onChange={(e) => onFormDataChange({ ...formData, price: e.target.value })}
              placeholder="5000"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Категория *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => onFormDataChange({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="sets">Гарнитуры и комплекты</SelectItem>
                <SelectItem value="storage">Комоды, сундуки, тумбы</SelectItem>
                <SelectItem value="mirrors">Зеркала, ширмы</SelectItem>
                <SelectItem value="tables">Столы, консоли</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              <Icon name="Save" className="mr-2" size={18} />
              {editingId ? 'Сохранить изменения' : 'Добавить товар'}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={onCancel}>
                <Icon name="X" className="mr-2" size={18} />
                Отмена
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;