import { addLocation, getLocations, getUniquePMs } from './actions';
import MapWrapper from './components/MapWrapper'; 
import PMFilter from './components/PMFilter'; // <--- Import the new component

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
      <h1 className="text-3xl font-bold mb-8 text-center">PM Location Manager</h1>

      <div className="grid md:grid-cols-2 gap-12">
        
        {/* LEFT COLUMN: FORM */}
        <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Location</h2>
          {/* The Server Action <form> is fine here because it doesn't use inline event handlers */}
          <form action={addLocation} className="flex flex-col gap-4">
            <label className="block">
              <span className="text-sm font-medium">Select PM</span>
              <select name="pm_name" className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" required>
                <option value="" disabled defaultValue>Choose a PM...</option>
                {PM_LIST.map(pm => <option key={pm} value={pm}>{pm}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium">Adres</span>
              <input type="text" name="address" placeholder="123 Main St, City..." className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" required />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Telefon</span>
              <input type="tel" name="phone" className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Komentarz/Notatka</span>
              <textarea name="comment" className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" rows="3"></textarea>
            </label>

            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
              Save Location
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
               <p className="text-gray-500 italic">No locations found for {selectedPM}.</p>
             )
          ) : (
            <div className="h-[400px] bg-gray-200 rounded flex items-center justify-center text-gray-500">
              Select a PM to view map
            </div>
          )}
        </div>

      </div>
    </main>
  );
}