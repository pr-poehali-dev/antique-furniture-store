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

      for (const row of jsonData) {
        try {
          const rowData: any = row;
          const payload = {
            photo_url: rowData['Фото (URL)'] || rowData['photo_url'] || '',
            article: rowData['Артикул'] || rowData['article'] || '',
            name: rowData['Наименование'] || rowData['name'] || '',
            price: parseFloat(rowData['Цена'] || rowData['price'] || '0')
          };

          if (!payload.article || !payload.name) {
            errorCount++;
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

      alert(`Импорт завершен!\nУспешно: ${successCount}\nОшибок: ${errorCount}`);
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
