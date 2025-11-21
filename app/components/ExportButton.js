'use client';

import * as XLSX from 'xlsx';

export default function ExportButton({ data }) {
  const handleExport = () => {
    const exportData = data.map(item => ({
      "Data Dodania": item.created_at ? new Date(item.created_at).toLocaleDateString('pl-PL') : '', // 👈 NEW
      "Klient": item.client || '',
      "Nazwa Punktu": item.shop_name || '',
      "Manager (PM)": item.pm_name || '',
      "Miasto": item.city || '',
      "Adres": item.address || '',
      "Telefon": item.phone || '',
      "Notatka": item.comment || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Klienci");
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