'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

// 1. Helper component to redraw map when size changes
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

  // Default center (e.g., London) or the first location
  const center = locations.length > 0 
    ? [locations[0].latitude, locations[0].longitude] 
    : [51.505, -0.09]; 

  return (
    <div 
      // 2. Toggle between specific height vs. Full Screen (fixed position)
      className={
        isFullscreen 
          ? "fixed inset-0 z-50 h-screen w-screen bg-gray-100" 
          : "relative w-full h-[400px] rounded-lg overflow-hidden"
      }
    >
      {/* 3. The Toggle Button */}
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="absolute top-4 right-4 z-[9999] bg-white text-black px-3 py-2 rounded shadow-md font-medium hover:bg-gray-100 transition"
        type="button"
      >
        {isFullscreen ? 'Exit Fullscreen' : '⛶ Fullscreen'}
      </button>

      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MapResizer isFullscreen={isFullscreen} />

        {locations.map((loc) => (
          <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
            <Popup>
              {/* 👇 Show Shop Name prominently */}
              <strong className="text-lg">{loc.shop_name}</strong><br />
              {/* 👇 Show Client */}
              <span className="text-xs font-bold text-gray-500 uppercase">{loc.client}</span>
              <hr className="my-1 border-gray-300"/>
              
              <strong>{loc.pm_name}</strong><br />
              {loc.city}, {loc.address}<br />
              {loc.phone && <span className="block mt-1">📞 {loc.phone}</span>}
              {loc.comment && <em className="block mt-1 text-gray-600 border-l-2 border-gray-300 pl-2">{loc.comment}</em>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}