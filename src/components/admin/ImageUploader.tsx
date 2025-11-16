import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label = 'Изображение' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [showBase64, setShowBase64] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Выберите изображение');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Размер файла не должен превышать 5 МБ');
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64Data = dataUrl.split(',')[1];

      const response = await fetch('https://functions.poehali.dev/f26b6393-1447-4b1c-a653-339f6c61fd54', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: base64Data,
          filename: file.name,
          contentType: file.type
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка загрузки на сервер');
      }

      const result = await response.json();
      const imageUrl = result.url;

      onChange(imageUrl);
      toast.success('Изображение успешно загружено на CDN');
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      toast.error(error instanceof Error ? error.message : 'Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      <div className="space-y-2">
        {showBase64 ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="data:image/jpeg;base64,..."
            className="font-mono text-xs min-h-[100px]"
          />
        ) : (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg или выберите файл"
            className="flex-1"
          />
        )}
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={uploading}
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              className="w-full pointer-events-none"
            >
              {uploading ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={18} />
                  Загрузка...
                </>
              ) : (
                <>
                  <Icon name="Upload" className="mr-2" size={18} />
                  Выбрать файл (до 5 МБ)
                </>
              )}
            </Button>
          </div>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowBase64(!showBase64)}
          >
            <Icon name={showBase64 ? "Link" : "Code"} size={18} />
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