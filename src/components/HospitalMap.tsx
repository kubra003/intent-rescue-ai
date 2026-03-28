'use client';

import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Clock, Activity } from 'lucide-react';

interface Hospital {
  id: string;
  name: string;
  position: { lat: number; lng: number };
  waitTime: string;
  type: string;
}

export function HospitalMap({ searchTerms }: { searchTerms?: string[] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [userLocation, setUserLocation] = useState({ lat: 37.7749, lng: -122.4194 }); // Default SF

  useEffect(() => {
    // Simulate finding nearby hospitals based on search terms
    // In a real app, we would use the Google Places API here
    const mockHospitals: Hospital[] = [
      { 
        id: '1', 
        name: 'General Medical Center', 
        position: { lat: userLocation.lat + 0.01, lng: userLocation.lng + 0.01 },
        waitTime: '15 mins',
        type: 'General Emergency'
      },
      { 
        id: '2', 
        name: 'Trauma & Burn Institute', 
        position: { lat: userLocation.lat - 0.015, lng: userLocation.lng + 0.005 },
        waitTime: '5 mins',
        type: 'Trauma Center'
      },
      { 
        id: '3', 
        name: 'City Children\'s Hospital', 
        position: { lat: userLocation.lat + 0.005, lng: userLocation.lng - 0.015 },
        waitTime: '45 mins',
        type: 'Pediatric ER'
      }
    ];
    setHospitals(mockHospitals);
  }, [userLocation, searchTerms]);

  if (!apiKey) {
    return (
      <div className="w-full h-[400px] rounded-[2.5rem] bg-slate-900 overflow-hidden relative border border-slate-800 shadow-2xl group">
        <div className="absolute inset-0 opacity-20 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-122.4194,37.7749,12/800x400?access_token=none')] bg-cover grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-red-500/20 p-4 rounded-full mb-6 animate-pulse">
            <MapPin size={48} className="text-red-500" />
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Hospital Discovery</h3>
          <p className="text-slate-400 max-w-xs font-medium">Please provide a Google Maps API key in environment variables to enable real-time coordination.</p>
          <div className="mt-8 grid grid-cols-1 gap-4 w-full max-w-md">
            {hospitals.map((h) => (
              <div key={h.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center justify-between transition-all hover:bg-white/10">
                <div>
                  <h4 className="font-bold text-white text-sm">{h.name}</h4>
                  <p className="text-xs text-slate-500">{h.type}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full">
                  <Clock size={12} className="text-red-400" />
                  <span className="text-xs font-black text-red-100">{h.waitTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white relative">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={userLocation}
          defaultZoom={13}
          mapId="bf3f0db6e3e15034" // Example Map ID
          className="w-full h-full"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {hospitals.map((hospital) => (
            <AdvancedMarker
              key={hospital.id}
              position={hospital.position}
              onClick={() => setSelectedHospital(hospital)}
            >
              <Pin background={'#ef4444'} borderColor={'#7f1d1d'} glyphColor={'#ffffff'} />
            </AdvancedMarker>
          ))}

          {selectedHospital && (
            <InfoWindow
              position={selectedHospital.position}
              onCloseClick={() => setSelectedHospital(null)}
            >
              <div className="p-2 min-w-[200px]">
                <h3 className="font-black text-slate-900 border-b pb-1 mb-2">{selectedHospital.name}</h3>
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={14} className="text-red-500" />
                  <span className="text-xs font-bold text-slate-600">{selectedHospital.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-blue-500" />
                  <span className="text-xs font-bold text-slate-600">Est. Wait: {selectedHospital.waitTime}</span>
                </div>
                <button className="w-full mt-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-black flex items-center justify-center gap-2">
                  <Navigation size={12} /> Start Route
                </button>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
