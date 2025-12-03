'use client';

import { useActionState } from 'react'; // lub useFormState w starszych wersjach React
import { useFormStatus } from 'react-dom';
import { addLocation } from '../actions';
import { useEffect, useRef } from 'react';

const initialState = {
  success: false,
  error: null,
  message: null
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2 ${
        pending ? 'opacity-70 cursor-wait' : ''
      }`}
    >
      {pending ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Zapisywanie...
        </>
      ) : (
        'Zapisz'
      )}
    </button>
  );
}

export default function AddLocationForm({ pmList }) {
  const [state, formAction] = useActionState(addLocation, initialState);
  const formRef = useRef(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      {state?.success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Sukces!</strong>
          <span className="block sm:inline"> {state.message}</span>
        </div>
      )}

      {state?.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Błąd!</strong>
          <span className="block sm:inline"> {state.error}</span>
        </div>
      )}

      <label className="block">
        <span className="text-sm font-medium">Manager</span>
        <select name="pm_name" className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" required defaultValue="">
          <option value="" disabled>Wybierz z listy</option>
          {pmList.map(pm => <option key={pm} value={pm}>{pm}</option>)}
        </select>
      </label>

      {/* 👇 NOWE POLE STATUS */}
      <label className="block">
        <span className="text-sm font-medium">Status</span>
        <select 
          name="status" 
          className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" 
          defaultValue="Pracuję"
        >
          <option value="Pracuję">Pracuję</option>
          <option value="Nie pracuję">Nie pracuję</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium">Klient</span>
        <input type="text" name="client" className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" required />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Nazwa punktu</span>
        <input type="text" name="shop_name" className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" required />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Email</span>
        <input type="email" name="email" className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Miasto</span>
        <input type="text" name="city" className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" required />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Adres</span>
        <input type="text" name="address" className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" required />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Telefon</span>
        <input type="tel" name="phone" className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Notatka</span>
        <textarea name="comment" className="mt-1 block w-full p-2 border rounded dark:bg-zinc-700" rows="3"></textarea>
      </label>

      <SubmitButton />
    </form>
  );
}