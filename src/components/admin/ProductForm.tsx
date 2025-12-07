import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface ProductFormData {
  photo_url: string;
  main_image?: string;
  article: string;
  name: string;
  price: string;
  category: string;
  description?: string;
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
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingMain, setIsDraggingMain] = useState(false);

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const maxSize = 1920;
        
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Ошибка сжатия изображения'));
              return;
            }
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          },
          'image/jpeg',
          0.85
        );
      };
      
      img.onerror = () => reject(new Error('Ошибка загрузки изображения'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (file: File, isMain = false) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, загрузите изображение');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Размер файла не должен превышать 10 МБ');
      return;
    }

    if (isMain) {
      setUploadingMainImage(true);
    } else {
      setUploadingImage(true);
    }

    try {
      const dataUrl = await compressImage(file);
      const base64Data = dataUrl.split(',')[1];

      const requestBody = {
        file: base64Data,
        filename: file.name,
        contentType: 'image/jpeg'
      };
      
      const response = await fetch('https://functions.poehali.dev/f26b6393-1447-4b1c-a653-339f6c61fd54', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMsg = 'Ошибка загрузки на сервер';
        try {
          const errorData = JSON.parse(responseText);
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          errorMsg = responseText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const data = JSON.parse(responseText);
      
      if (data.url) {
        if (isMain) {
          onFormDataChange({ ...formData, main_image: data.url });
        } else {
          // Разделитель для base64: используем ||| вместо запятой
          const currentUrls = formData.photo_url ? formData.photo_url.split('|||').map(u => u.trim()).filter(u => u) : [];
          const newUrls = [...currentUrls, data.url];
          onFormDataChange({ ...formData, photo_url: newUrls.join('|||') });
        }
      } else {
        throw new Error('URL не получен от сервера');
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert(error instanceof Error ? error.message : 'Не удалось загрузить изображение');
    } finally {
      if (isMain) {
        setUploadingMainImage(false);
      } else {
        setUploadingImage(false);
      }
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
            <Label htmlFor="main_image">Главное фото</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('main-file-upload')?.click()}
                  disabled={uploadingMainImage}
                  className="flex-1"
                >
                  <Icon name="Upload" className="mr-2" size={18} />
                  {uploadingMainImage ? 'Загрузка...' : 'Загрузить главное фото'}
                </Button>
              </div>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDraggingMain ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingMain(true);
                }}
                onDragLeave={() => setIsDraggingMain(false)}
                onDrop={async (e) => {
                  e.preventDefault();
                  setIsDraggingMain(false);
                  
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith('image/')) {
                    await handleImageUpload(file, true);
                  } else {
                    alert('Пожалуйста, загрузите изображение');
                  }
                }}
              >
                <Icon name="Image" className="mx-auto mb-2" size={40} />
                <p className="text-muted-foreground">
                  {uploadingMainImage ? 'Загрузка...' : 'Перетащите главное фото сюда'}
                </p>
              </div>

              <input
                id="main-file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handleImageUpload(file, true);
                  }
                  e.target.value = '';
                }}
              />
              
              {formData.main_image && (
                <div className="relative inline-block group">
                  <img
                    src={formData.main_image}
                    alt="Главное фото"
                    className="w-32 h-32 object-cover rounded border-2 border-primary"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onFormDataChange({ ...formData, main_image: '' })}
                  >
                    <Icon name="X" size={16} />
                  </Button>
                  <div className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-xs py-1 text-center">
                    Главное
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="photo_url">Дополнительные фото</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={uploadingImage}
                  className="flex-1"
                >
                  <Icon name="Upload" className="mr-2" size={18} />
                  {uploadingImage ? 'Загрузка...' : 'Загрузить изображения'}
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
                  
                  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                  if (files.length === 0) {
                    alert('Пожалуйста, загрузите изображения');
                    return;
                  }
                  for (const file of files) {
                    await handleImageUpload(file);
                  }
                }}
              >
                <Icon name="ImagePlus" className="mx-auto mb-2" size={40} />
                <p className="text-muted-foreground">
                  {uploadingImage ? 'Загрузка...' : 'Перетащите изображения сюда или выберите несколько файлов'}
                </p>
              </div>

              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  for (const file of files) {
                    await handleImageUpload(file);
                  }
                  e.target.value = '';
                }}
              />
              
              {formData.photo_url && (
                <div className="flex flex-wrap gap-2">
                  {formData.photo_url.split('|||').filter(u => u.trim()).map((url, index) => (
                    <div 
                      key={index} 
                      className="relative inline-block cursor-move group"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/plain', index.toString());
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                        const toIndex = index;
                        
                        if (fromIndex !== toIndex) {
                          const urls = formData.photo_url.split('|||').map(u => u.trim()).filter(u => u);
                          const [movedUrl] = urls.splice(fromIndex, 1);
                          urls.splice(toIndex, 0, movedUrl);
                          onFormDataChange({ ...formData, photo_url: urls.join('|||') });
                        }
                      }}
                    >
                      <img
                        src={url.trim()}
                        alt={`Фото ${index + 1}`}
                        className="w-32 h-32 object-cover rounded border group-hover:opacity-75 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <Icon name="GripVertical" size={24} className="text-white drop-shadow-lg" />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                        onClick={() => {
                          const urls = formData.photo_url.split('|||').map(u => u.trim()).filter(u => u);
                          urls.splice(index, 1);
                          onFormDataChange({ ...formData, photo_url: urls.join('|||') });
                        }}
                      >
                        <Icon name="X" size={14} />
                      </Button>
                    </div>
                  ))}
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

          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
              placeholder="Подробное описание товара..."
              rows={5}
              className="resize-none"
            />
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