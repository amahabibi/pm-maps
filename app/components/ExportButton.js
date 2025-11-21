'use client';

import * as XLSX from 'xlsx';

export default function ExportButton({ data }) {
  const handleExport = () => {
    // 1. Przygotuj dane do eksportu (wybierz kolumny i polskie nagłówki)
    const exportData = data.map(item => ({
      "Klient": item.client || '',
      "Nazwa Punktu": item.shop_name || '',
      "Manager (PM)": item.pm_name || '',
      "Miasto": item.city || '',
      "Adres": item.address || '',
      "Telefon": item.phone || '',
      "Notatka": item.comment || ''
    }));

    // 2. Stwórz arkusz (Worksheet)
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // 3. Stwórz skoroszyt (Workbook)
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Klienci");

    // 4. Pobierz plik
    XLSX.writeFile(workbook, "Lista_Klientow_i_Punktow.xlsx");
  };

  return (
    <button 
      onClick={handleExport}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 font-medium transition"
    >
      📊 Eksportuj do Excela
    </button>
  );
}