'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 rounded animate-pulse">Loading map...</div>
});

export default function MapWrapper(props) {
  return <Map {...props} />;
}