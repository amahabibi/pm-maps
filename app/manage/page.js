import Link from 'next/link';
import { getAllLocations, deleteLocation } from '../actions';
import { Metadata } from 'next';

export const metadata = {
  title: 'Zarządzaj adresami',
};

// 👇 TO JEST KLUCZOWE DLA LISTY
export const dynamic = 'force-dynamic';

export default async function ManagePage() {
  const locations = await getAllLocations();

  return (
    <main className="p-1 max-w-6xl mx-auto bg-white text-black dark:bg-zinc-900 dark:text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Zarządzaj adresami</h1>
        <Link href="/" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          ← Powrót do mapy
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b dark:border-zinc-700">
              <th className="p-4">Manager</th>
              <th className="p-4">Klient</th>        
              <th className="p-4">Nazwa punktu</th>  
              <th className="p-4">Miaso</th>
              <th className="p-4">Adres</th>
              <th className="p-4">Telefon</th>
              <th className="p-4">Notatka</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc.id} className="border-b dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800">
                <td className="p-4 font-medium">{loc.pm_name}</td>
                <td className="p-4">{loc.client}</td>    
                <td className="p-4">{loc.shop_name}</td>  
                <td className="p-4">{loc.city}</td>
                <td className="p-4">{loc.address}</td>
                <td className="p-4">{loc.phone}</td>
                <td className="p-4 flex gap-2">
                  <Link 
                    href={`/manage/${loc.id}`} 
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-sm"
                  >
                    Zmień
                  </Link>
                  <form action={deleteLocation}>
                    <input type="hidden" name="id" value={loc.id} />
                    <button type="submit" className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 text-sm">
                      Usuń
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {locations.length === 0 && (
          <p className="text-center py-8 text-gray-500">Nie znaleziono adresów</p>
        )}
      </div>
    </main>
  );
}