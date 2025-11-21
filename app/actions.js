'use server';

import db from './lib/db';
import { revalidatePath } from 'next/cache';

export async function addLocation(formData) {
  const pm_name = formData.get('pm_name');
  const address = formData.get('address');
  const city = formData.get('city'); // <--- New Field
  const comment = formData.get('comment');
  const phone = formData.get('phone');

  // Combine address + city for better geocoding results
  const searchParams = `${address}, ${city}`; 
  
  const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchParams)}`, {
    headers: { 'User-Agent': 'PmMapApp/1.0' }
  });
  const geoData = await geoRes.json();

  if (!geoData || geoData.length === 0) {
    return { error: 'Could not find coordinates for this address.' };
  }

  const lat = geoData[0].lat;
  const lon = geoData[0].lon;

  try {
    // Update SQL to include city
    await db.execute({
      sql: `INSERT INTO locations (pm_name, address, city, latitude, longitude, comment, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [pm_name, address, city, lat, lon, comment, phone]
    });
  } catch (e) {
    console.error("Database Error:", e);
    return { error: "Failed to save location" };
  }

  revalidatePath('/');
  return { success: true };
}

// Keep the plain object fix we added earlier!
export async function getLocations(pmName) {
  if (!pmName) return [];
  
  const result = await db.execute({
    sql: 'SELECT * FROM locations WHERE pm_name = ?',
    args: [pmName]
  });

  return result.rows.map((row) => ({
    ...row
  }));
}

export async function getUniquePMs() {
  const result = await db.execute('SELECT DISTINCT pm_name FROM locations');
  return result.rows.map(row => row.pm_name);
}

// 1. Fetch a single location by ID for the Edit Form
export async function getLocationById(id) {
  const result = await db.execute({
    sql: 'SELECT * FROM locations WHERE id = ?',
    args: [id]
  });
  
  if (result.rows.length === 0) return null;
  return { ...result.rows[0] }; // Sanitize to plain object
}

// 2. Fetch ALL locations for the management list
export async function getAllLocations() {
  const result = await db.execute('SELECT * FROM locations ORDER BY created_at DESC');
  return result.rows.map(row => ({ ...row }));
}

// 3. Update an existing location
export async function updateLocation(formData) {
  const id = formData.get('id');
  const pm_name = formData.get('pm_name');
  const address = formData.get('address');
  const city = formData.get('city');
  const comment = formData.get('comment');
  const phone = formData.get('phone');

  // Optional: Re-geocode if the address changed. 
  // For simplicity, we'll re-geocode every time here, but you could check if address changed.
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
    await db.execute({
      sql: `UPDATE locations 
            SET pm_name=?, address=?, city=?, latitude=?, longitude=?, comment=?, phone=?
            WHERE id=?`,
      args: [pm_name, address, city, lat, lon, comment, phone, id]
    });
  } catch (e) {
    console.error(e);
    return { error: 'Failed to update' };
  }

  revalidatePath('/');
  revalidatePath('/manage');
  redirect('/manage'); // Go back to list after save
}

// 4. Delete a location
export async function deleteLocation(formData) {
  const id = formData.get('id');
  await db.execute({
    sql: 'DELETE FROM locations WHERE id = ?',
    args: [id]
  });
  
  revalidatePath('/');
  revalidatePath('/manage');
}