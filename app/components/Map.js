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
    // Wait 300ms for the CSS transition to finish, then tell Leaflet to resize
    const timer = setTimeout(() => {
       map.invalidateSize();
    }, 300);
    return () => clearTimeout(timer);
  }, [isFullscreen, map]);
  
  return null;
}

export default function Map({ locations }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 👇 NEW: Handle ESC key to exit fullscreen
  useEffect(() => {
    // Only attach listener if currently in fullscreen
    if (!isFullscreen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Default center (e.g., London) or the first location
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
      {/* Toggle Button */}
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

        {/* Helper to fix gray areas on resize */}
        <MapResizer isFullscreen={isFullscreen} />

        {locations.map((loc) => (
          <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
            <Popup>
              {/* Date */}
              <div className="text-xs text-gray-400 mb-1">
                Dodano: {loc.created_at ? new Date(loc.created_at).toLocaleDateString('pl-PL') : 'n/a'}
              </div>

              {/* Shop Name & Client */}
              <strong className="text-lg">{loc.shop_name}</strong><br />
              <span className="text-xs font-bold text-gray-500 uppercase">{loc.client}</span>
              <hr className="my-1 border-gray-300"/>
              
              {/* Standard Details */}
              <strong>{loc.pm_name}</strong><br />
              {loc.city && <span className="font-semibold">{loc.city}, </span>}
              {loc.address}<br />
              
              {loc.phone && <span className="block mt-1">📞 {loc.phone}</span>}
              {loc.comment && <em className="block mt-1 text-gray-600 border-l-2 border-gray-300 pl-2">{loc.comment}</em>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}