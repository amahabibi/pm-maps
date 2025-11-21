import { getLocationById, updateLocation } from '../../actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const {id} = await params;
  const location = await getLocationById(id);
  
  return {
    title: `Edytuj punkt${location ? ': ' + location.shop_name : 'Nie znaleziono'}`,
  }
}

export default async function EditPage({ params }) {
  // Await params before accessing properties
  const { id } = await params;
  const location = await getLocationById(id);
  
  if (!location) {
    return <div className="p-8">Location not found</div>;
  }

  const PM_LIST = ['Igor Panchuk', 'Aleksander Brzozowski'];

  return (
    <main className="p-8 max-w-2xl mx-auto bg-white text-black dark:bg-zinc-900 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Zmień adres</h1>
      
      <form action={updateLocation} className="flex flex-col gap-4">
        {/* Hidden ID field so the backend knows which row to update */}
        <input type="hidden" name="id" value={location.id} />

        <label className="block">
          <span className="text-sm font-medium">Select PM</span>
          <select 
            name="pm_name" 
            defaultValue={location.pm_name}
            className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" 
            required
          >
            {PM_LIST.map(pm => <option key={pm} value={pm}>{pm}</option>)}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Klient</span>
          <input 
            type="text" 
            name="client" 
            defaultValue={location.client}
            className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" 
            required 
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Nazwa punktu</span>
          <input 
            type="text" 
            name="shop_name" 
            defaultValue={location.shop_name}
            className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" 
            required 
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Miasto</span>
          <input 
            type="text" 
            name="city" 
            defaultValue={location.city}
            className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" 
            required 
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Adres</span>
          <input 
            type="text" 
            name="address" 
            defaultValue={location.address}
            className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" 
            required 
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Telefon</span>
          <input 
            type="tel" 
            name="phone" 
            defaultValue={location.phone}
            className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" 
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Notatka</span>
          <textarea 
            name="comment" 
            defaultValue={location.comment}
            className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" 
            rows="3"
          ></textarea>
        </label>

        <div className="flex gap-4 mt-4">
          <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Aktualizuj
          </button>
          <Link href="/manage" className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 text-center">
            Zamknij
          </Link>
        </div>
      </form>
    </main>
  );
}