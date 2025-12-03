'use server';

import db from './lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// 👇 Zaktualizowana funkcja addLocation
export async function addLocation(prevState, formData) {
  const pm_name = formData.get('pm_name');
  const client = formData.get('client');
  const shop_name = formData.get('shop_name');
  const address = formData.get('address');
  const city = formData.get('city');
  const comment = formData.get('comment');
  const phone = formData.get('phone');
  const email = formData.get('email');
  
  // 👇 Pobieramy status (domyślnie 'Pracuję' jeśli puste)
  const status = formData.get('status') || 'Pracuję';

  const searchParams = `${address}, ${city}`;

  const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchParams)}`, {
    headers: { 'User-Agent': 'PmMapApp/1.0' }
  });
  const geoData = await geoRes.json();

  if (!geoData || geoData.length === 0) {
    return { error: 'Nie znaleziono współrzędnych dla tego adresu. Sprawdź miasto i ulicę.' };
  }

  const lat = geoData[0].lat;
  const lon = geoData[0].lon;
  const created_at = new Date().toISOString();

  try {
    // 👇 Dodano 'status' do zapytania SQL
    await db.execute({
      sql: `INSERT INTO locations (pm_name, client, shop_name, email, address, city, latitude, longitude, comment, phone, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [pm_name, client, shop_name, email, address, city, lat, lon, comment, phone, status, created_at]
    });
  } catch (e) {
    console.error("Database Error:", e);
    return { error: "Błąd zapisu do bazy danych." };
  }

  revalidatePath('/');
  return { success: true, message: 'Punkt został dodany pomyślnie!' };
}

// ... funkcje getLocations, getUniquePMs, getAllLocations, getLocationById bez zmian ...

export async function getLocations(pmName) {
  if (!pmName) return [];
  const result = await db.execute({
    sql: 'SELECT * FROM locations WHERE pm_name = ?',
    args: [pmName]
  });
  return result.rows.map((row) => ({ ...row }));
}

export async function getUniquePMs() {
  const result = await db.execute('SELECT DISTINCT pm_name FROM locations');
  return result.rows.map(row => row.pm_name);
}

export async function getAllLocations() {
  try {
    const result = await db.execute('SELECT * FROM locations ORDER BY created_at DESC');
    return JSON.parse(JSON.stringify(result.rows));
  } catch (e) {
    console.error("Błąd:", e);
    return [];
  }
}

export async function getLocationById(id) {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM locations WHERE id = ?',
      args: [id]
    });
    if (result.rows.length === 0) return null;
    return JSON.parse(JSON.stringify(result.rows[0]));
  } catch (e) {
    return null;
  }
}

// 👇 Zaktualizowana funkcja updateLocation
export async function updateLocation(formData) {
  const id = formData.get('id');
  const email = formData.get('email');
  const pm_name = formData.get('pm_name');
  const client = formData.get('client');
  const shop_name = formData.get('shop_name');
  const address = formData.get('address');
  const city = formData.get('city');
  const comment = formData.get('comment');
  const phone = formData.get('phone');
  
  // 👇 Pobieramy status
  const status = formData.get('status');

  const searchParams = `${address}, ${city}`;
  const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchParams)}`, {
    headers: { 'User-Agent': 'PmMapApp/1.0' }
  });
  const geoData = await geoRes.json();

  let lat = 0, lon = 0;
  if (geoData && geoData.length > 0) {
    lat = geoData[0].lat;
    lon = geoData[0].lon;
  }

  try {
    // 👇 Dodano status=? do UPDATE
    await db.execute({
      sql: `UPDATE locations 
            SET pm_name=?, client=?, shop_name=?, email=?, address=?, city=?, latitude=?, longitude=?, comment=?, phone=?, status=?
            WHERE id=?`,
      args: [pm_name, client, shop_name, email, address, city, lat, lon, comment, phone, status, id]
    });
  } catch (e) {
    console.error(e);
    return { error: 'Failed to update' };
  }

  revalidatePath('/');
  revalidatePath('/manage');
  redirect('/manage');
}

export async function deleteLocation(formData) {
  const id = formData.get('id');
  await db.execute({
    sql: 'DELETE FROM locations WHERE id = ?',
    args: [id]
  });
  revalidatePath('/');
  revalidatePath('/manage');
}