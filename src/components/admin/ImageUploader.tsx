import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const UPLOAD_URL = 'https://cdn.poehali.dev/upload';

export default function ImageUploader({ value, onChange, label = 'Изображение' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Выберите изображение');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Размер файла не должен превышать 10 МБ');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки файла');
      }

      const data = await response.json();
      onChange(data.url);
      toast.success('Изображение загружено');
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      toast.error('Ошибка загрузки изображения');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="flex-1"
        />
        
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="pointer-events-none"
          >
            {uploading ? (
              <>
                <Icon name="Loader2" className="mr-2 animate-spin" size={18} />
                Загрузка...
              </>
            ) : (
              <>
                <Icon name="Upload" className="mr-2" size={18} />
                Загрузить
              </>
            )}
          </Button>
        </div>
      </div>

      {value && (
        <div className="mt-2 border rounded-lg p-2 bg-muted/20">
          <img
            src={value}
            alt="Preview"
            className="max-h-40 mx-auto rounded object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}
