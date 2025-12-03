import { getLocations, getUniquePMs, getAllLocations } from './actions';
import MapWrapper from './components/MapWrapper';
import PMFilter from './components/PMFilter';
import AddLocationForm from './components/AddLocationForm'; // 👈 Importujemy nowy komponent
import Link from 'next/link';

const PM_LIST = ['Igor Panchuk', 'Aleksander Brzozowski'];

export const metadata = {
  title: 'Mapa punktów',
};

export default async function Home({ searchParams }) {
  const resolvedParams = await searchParams;
  const selectedPM = resolvedParams?.pm || '';

  let locations = [];
  if (selectedPM === 'all') {
    locations = await getAllLocations();
  } else if (selectedPM) {
    locations = await getLocations(selectedPM);
  }

  const existingPMs = await getUniquePMs();
  const allPMs = [...new Set([...PM_LIST, ...existingPMs])].sort();

  return (
    <main className="p-1 max-w-4xl mx-auto bg-white text-black dark:bg-zinc-900 dark:text-white min-h-screen">
      
      <div className="relative mb-8 flex justify-end gap-4 pt-4">
        <Link href="/clients" className="text-sm font-medium text-white-600 hover:underline">
          📂 Lista Klientów
        </Link>
        <Link href="/manage" className="text-sm font-medium text-white-600 hover:text-white-800 hover:underline">
          Zarządzaj adresami &rarr;
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-12">

        {/* LEFT COLUMN: FORM */}
        <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Dodaj nowy adres</h2>
          
          {/* 👇 Tutaj używamy nowego komponentu */}
          <AddLocationForm pmList={PM_LIST} />
          
        </div>

        {/* RIGHT COLUMN: MAP VIEW */}
        <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Zobacz adresy</h2>

          <PMFilter pms={allPMs} />

          {selectedPM ? (
            locations.length > 0 ? (
              <MapWrapper locations={locations} />
            ) : (
              <p className="text-gray-500 italic">
                 {selectedPM === 'all' ? 'Nie znaleziono żadnych adresów.' : `Nie znaleziono adresów dla ${selectedPM}.`}
              </p>
            )
          ) : (
            <div className="h-[400px] bg-gray-200 rounded flex items-center justify-center text-gray-500">
              Wybierz managera lub "Pokaż wszystkich"
            </div>
          )}
        </div>

      </div>
    </main>
  );
}