import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ExcelImportProps {
  importingExcel: boolean;
  onImportStart: () => void;
  onImportEnd: () => void;
  onImportSuccess: () => void;
  apiUrl: string;
}

const ExcelImport = ({ importingExcel, onImportStart, onImportEnd, onImportSuccess, apiUrl }: ExcelImportProps) => {
  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onImportStart();
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      console.log('Всего строк в Excel:', jsonData.length);
      console.log('Первая строка данных:', jsonData[0]);

      for (const row of jsonData) {
        try {
          const rowData: any = row;
          
          // Очистка цены от пробелов и замена запятой на точку
          const priceValue = String(rowData['Цена'] || rowData['price'] || '0')
            .replace(/\s/g, '')
            .replace(',', '.');
          
          const payload = {
            photo_url: rowData['Фото (URL)'] || rowData['photo_url'] || rowData['Фото'] || '',
            article: String(rowData['Артикул'] || rowData['article'] || '').trim(),
            name: String(rowData['Наименование'] || rowData['name'] || '').trim(),
            price: parseFloat(priceValue) || 0
          };

          console.log('Обработка строки:', payload);

          if (!payload.article || !payload.name || payload.price === 0) {
            errorCount++;
            errors.push(`Строка пропущена: артикул="${payload.article}", название="${payload.name}", цена=${payload.price}`);
            console.warn('Пропущена строка:', payload);
            continue;
          }

          await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          successCount++;
        } catch (error) {
          errorCount++;
          console.error('Ошибка импорта строки:', error);
        }
      }

      console.log('Все ошибки:', errors);
      
      let message = `Импорт завершен!\nУспешно: ${successCount}\nОшибок: ${errorCount}`;
      if (errors.length > 0 && errors.length <= 5) {
        message += '\n\nПервые ошибки:\n' + errors.slice(0, 5).join('\n');
      }
      
      alert(message);
      onImportSuccess();
    } catch (error) {
      console.error('Ошибка чтения Excel:', error);
      alert('Не удалось прочитать файл Excel. Проверьте формат файла.');
    } finally {
      onImportEnd();
      e.target.value = '';
    }
  };

  return (
    <>
      <Button 
        variant="default"
        onClick={() => document.getElementById('excel-upload')?.click()}
        disabled={importingExcel}
      >
        <Icon name="FileSpreadsheet" className="mr-2" size={18} />
        {importingExcel ? 'Импорт...' : 'Импорт из Excel'}
      </Button>
      <input
        id="excel-upload"
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleExcelImport}
      />
    </>
  );
};

export default ExcelImport;