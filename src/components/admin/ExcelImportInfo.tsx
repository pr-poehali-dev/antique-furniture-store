import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const ExcelImportInfo = () => {
  return (
    <Card className="mb-6 bg-primary/5 border-primary/20">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Icon name="Info" className="text-primary mt-1" size={24} />
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Формат Excel-файла для импорта:</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Создайте таблицу Excel со следующими столбцами (в любом порядке):
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li><strong>Артикул</strong> (обязательно) - артикул товара (текст или число)</li>
              <li><strong>Наименование</strong> (обязательно) - название товара</li>
              <li><strong>Цена</strong> (обязательно) - цена (можно с пробелами и запятыми, например: 142 000,0)</li>
              <li><strong>Фото (URL)</strong> или <strong>Фото</strong> (опционально) - ссылка на изображение</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              💡 Цены автоматически очищаются от пробелов, запятые заменяются на точки
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExcelImportInfo;