'use server';

import db from './lib/db';

import { revalidatePath } from 'next/cache';

export async function addLocation(formData) {
  const pm_name = formData.get('pm_name');
  const address = formData.get('address');
  const comment = formData.get('comment');
  const phone = formData.get('phone');

  // 1. Geocode the address using OpenStreetMap (Nominatim)
  // Note: User-Agent is required by Nominatim's TOS
  const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`, {
    headers: { 'User-Agent': 'PmMapApp/1.0' }
  });
  const geoData = await geoRes.json();

  if (!geoData || geoData.length === 0) {
    return { error: 'Could not find coordinates for this address.' };
  }

  const lat = geoData[0].lat;
  const lon = geoData[0].lon;

  // 2. Save to SQLite
  const stmt = db.prepare(`
    INSERT INTO locations (pm_name, address, latitude, longitude, comment, phone)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(pm_name, address, lat, lon, comment, phone);

  revalidatePath('/');
  return { success: true };
}

export async function getLocations(pmName) {
  if (!pmName) return [];
  const stmt = db.prepare('SELECT * FROM locations WHERE pm_name = ?');
  return stmt.all(pmName);
}

export async function getUniquePMs() {
  const stmt = db.prepare('SELECT DISTINCT pm_name FROM locations');
  return stmt.all().map(row => row.pm_name);
}