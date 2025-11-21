import { addLocation, getLocations, getUniquePMs } from './actions';
import MapWrapper from './components/MapWrapper';
import PMFilter from './components/PMFilter'; // <--- Import the new component
import Link from 'next/link';

const PM_LIST = ['Igor Panchuk', 'Aleksander Brzozowski'];

export default async function Home({ searchParams }) {
  const resolvedParams = await searchParams;
  const selectedPM = resolvedParams?.pm || '';

  const locations = selectedPM ? await getLocations(selectedPM) : [];
  const existingPMs = await getUniquePMs();

  // Combine lists on the server
  const allPMs = [...new Set([...PM_LIST, ...existingPMs])].sort();

  return (
    <main className="p-8 max-w-4xl mx-auto bg-white text-black dark:bg-zinc-900 dark:text-white min-h-screen">
      
      <div className="relative mb-8">
        <div className="absolute right-0 top-0">
          <Link href="/manage" className="text-sm text-white-600 underline hover:text-white-800">
            Zarządzaj adresami &rarr;
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">

        {/* LEFT COLUMN: FORM */}
        <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Dodaj nowy adres</h2>
          {/* The Server Action <form> is fine here because it doesn't use inline event handlers */}
          <form action={addLocation} className="flex flex-col gap-4">

            <label className="block">
              <span className="text-sm font-medium">Manager</span>
              <select name="pm_name" className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" required>
                <option value="" disabled defaultValue>Wybierz z listy</option>
                {PM_LIST.map(pm => <option key={pm} value={pm}>{pm}</option>)}
              </select>
            </label>

            {/* NEW: City Field */}
            <label className="block">
              <span className="text-sm font-medium">Miasto</span>
              <input type="text" name="city" className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" required />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Adres</span>
              <input type="text" name="address" placeholder="10 Downing Street" className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" required />
            </label>

            <label className="block">
              <span className="text-sm font-medium">telefon</span>
              <input type="tel" name="phone" className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Notatka</span>
              <textarea name="comment" className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" rows="3"></textarea>
            </label>

            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
              Zapisz
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: MAP VIEW */}
        <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Zobacz adresy</h2>

          {/* Replaced the old <form> with the Client Component */}
          <PMFilter pms={allPMs} />

          {selectedPM ? (
            locations.length > 0 ? (
              <MapWrapper locations={locations} />
            ) : (
              <p className="text-gray-500 italic">Nie znaleziono adresów dla {selectedPM}.</p>
            )
          ) : (
            <div className="h-[400px] bg-gray-200 rounded flex items-center justify-center text-gray-500">
              Wybierz managera
            </div>
          )}
        </div>

      </div>
    </main>
  );
}