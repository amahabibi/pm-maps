'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

// Helper component to redraw map when size changes
function MapResizer({ isFullscreen }) {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);
    return () => clearTimeout(timer);
  }, [isFullscreen, map]);

  return null;
}

export default function Map({ locations }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 👇 UPDATED: Handle ESC key with 'capture' phase
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault(); // Prevent browser defaults
        setIsFullscreen(false);
      }
    };

    // 'true' enabled event capturing, intercepting the key BEFORE Leaflet gets it
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isFullscreen]);

  // Default center
  const center = locations.length > 0
    ? [locations[0].latitude, locations[0].longitude]
    : [51.505, -0.09];

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 h-screen w-screen bg-gray-100"
          : "relative w-full h-[400px] rounded-lg overflow-hidden"
      }
    >
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="absolute top-4 right-4 z-[9999] bg-white text-black px-3 py-2 rounded shadow-md font-medium hover:bg-gray-100 transition"
        type="button"
      >
        {isFullscreen ? 'Exit Fullscreen (Esc)' : '⛶ Fullscreen'}
      </button>

      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <MapResizer isFullscreen={isFullscreen} />

        {locations.map((loc) => (
          <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
            <Popup>
              <div className="text-xs text-gray-400 mb-1">
                Dodano: {loc.created_at ? new Date(loc.created_at).toLocaleDateString('pl-PL') : 'n/a'}
              </div>

              <strong className="text-lg">{loc.shop_name}</strong><br />
              <span className="text-xs font-bold text-gray-500 uppercase">{loc.client}</span>
              <hr className="my-1 border-gray-300" />

              <strong>{loc.pm_name}</strong><br />
              {loc.city && <span className="font-semibold">{loc.city}, </span>}
              {loc.email && (
                <span className="block mt-1 text-blue-600">
                  ✉️ <a href={`mailto:${loc.email}`} className="hover:underline">{loc.email}</a>
                </span>
              )}
              {loc.address}<br />

              {loc.phone && <span className="block mt-1">📞 {loc.phone}</span>}
              {loc.comment && <em className="block mt-1 text-gray-600 border-l-2 border-gray-300 pl-2">{loc.comment}</em>}
              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${loc.status === 'Nie pracuję' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                {loc.status || 'Pracuję'}
              </span>
              <hr className="my-1 border-gray-300" />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}