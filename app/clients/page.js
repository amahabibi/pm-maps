import Link from 'next/link';
import { getAllLocations } from '../actions';
import ExportButton from '../components/ExportButton';
import { Metadata } from 'next';

export const metadata = {
  title: 'Klienci',
};

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const locations = await getAllLocations();

  // Sort by Client Name
  locations.sort((a, b) => (a.client || '').localeCompare(b.client || ''));

  // 👇 Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <main className="p-4 max-w-7xl mx-auto bg-white text-black dark:bg-zinc-900 dark:text-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Lista Klientów i Punktów</h1>
        
        <div className="flex flex-wrap items-center gap-4">
          <ExportButton data={locations} />

          <Link href="/" className="text-blue-600 hover:underline">
            ← Wróć do Mapy
          </Link>
          <Link href="/manage" className="bg-gray-100 dark:bg-zinc-700 px-3 py-2 rounded text-blue-600 hover:underline">
            Zarządzaj (Edycja) →
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-left border-collapse bg-white dark:bg-zinc-800">
          <thead className="bg-gray-100 dark:bg-zinc-700 uppercase text-xs font-semibold text-gray-700 dark:text-gray-200">
            <tr>
              <th className="p-4 border-b dark:border-zinc-600">Data dodania</th>
              <th className="p-4 border-b dark:border-zinc-600">Klient</th>
              <th className="p-4 border-b dark:border-zinc-600">Nazwa Punktu</th>
              <th className="p-4 border-b dark:border-zinc-600">Email</th>
              <th className="p-4 border-b dark:border-zinc-600">Manager</th>
              <th className="p-4 border-b dark:border-zinc-600">Miasto</th>
              <th className="p-4 border-b dark:border-zinc-600">Adres</th>
              <th className="p-4 border-b dark:border-zinc-600">Telefon</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {locations.length > 0 ? (
              locations.map((loc) => (
                <tr 
                  key={loc.id} 
                  className="border-b dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
                >
                  <td className="p-4 text-xs text-gray-500">
                    {formatDate(loc.created_at)} {/* 👈 Display Date */}
                  </td>
                  <td className="p-4 font-bold text-blue-600 dark:text-blue-400">
                    {loc.client || '-'}
                  </td>
                  <td className="p-4 font-medium">
                    {loc.shop_name || '-'}
                  </td>
                  <td className="p-4 text-blue-600 hover:underline">
                    {loc.email ? <a href={`mailto:${loc.email}`}>{loc.email}</a> : '-'}
                  </td>
                  <td className="p-4">
                    <span className="bg-gray-200 dark:bg-zinc-600 px-2 py-1 rounded text-xs">
                      {loc.pm_name}
                    </span>
                  </td>
                  <td className="p-4">{loc.city}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">{loc.address}</td>
                  <td className="p-4">{loc.phone || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  Brak danych do wyświetlenia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}