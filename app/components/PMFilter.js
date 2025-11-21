'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function PMFilter({ pms }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPM = searchParams.get('pm') || '';

  const handleChange = (e) => {
    const pm = e.target.value;
    const params = new URLSearchParams(searchParams);
    
    if (pm) {
      params.set('pm', pm);
    } else {
      params.delete('pm');
    }
    
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 mb-6">
      <select
        value={selectedPM}
        onChange={handleChange}
        className="flex-1 p-2 border rounded dark:bg-zinc-700"
      >
        <option value="">Wybierz managera aby zobaczyć...</option>
        {/* 👇 New Option for All */}
        <option value="all">Wszyscy</option>
        <hr />
        {pms.map((pm) => (
          <option key={pm} value={pm}>
            {pm}
          </option>
        ))}
      </select>
    </div>
  );
}