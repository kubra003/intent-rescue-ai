'use client';

import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, Video, Phone, ChevronRight, AlertCircle } from 'lucide-react';

export function CalendarBooking() {
  const [isBooked, setIsBooked] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const slots = [
    { time: '14:30', doctor: 'Dr. Aris (Trauma)', available: true },
    { time: '15:00', doctor: 'Dr. Sarah (ER)', available: true },
    { time: '15:15', doctor: 'Dr. Mike (Pediatrics)', available: false },
    { time: '16:45', doctor: 'On-Call Resident', available: true },
  ];

  const handleBook = () => {
    if (!selectedSlot) return;
    // Simulate Google Calendar API call
    setTimeout(() => {
      setIsBooked(true);
    }, 800);
  };

  if (isBooked) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 shadow-[0_20px_50px_rgba(16,185,129,0.1)]">
        <div className="bg-emerald-500 p-5 rounded-full mb-6">
          <CheckCircle size={48} className="text-white" />
        </div>
        <h3 className="text-2xl font-black text-emerald-900 uppercase tracking-widest mb-2">Triage Secured</h3>
        <p className="text-emerald-700 font-medium max-w-xs">A clinical callback has been scheduled with {slots.find(s => s.time === selectedSlot)?.doctor}. Watch your email for a Google Meet link.</p>
        <div className="mt-8 flex gap-4">
          <button className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors">Add to Google Calendar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-2xl p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
        <Calendar size={120} className="text-slate-900" />
      </div>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2 font-black uppercase tracking-[0.2em] text-blue-600 text-xs">
          <div className="w-8 h-[2px] bg-blue-600" />
          Clinical Coordination
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Emergency Coordination</h2>
      </header>

      <div className="space-y-4 mb-8">
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 font-bold leading-relaxed uppercase tracking-wider">
            Critical Level 4 Detected. Real-time slot reservation active.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {slots.map((slot) => (
            <button
              key={slot.time}
              disabled={!slot.available}
              onClick={() => setSelectedSlot(slot.time)}
              className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all duration-300 ${
                !slot.available 
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 border-transparent grayscale' 
                  : selectedSlot === slot.time 
                    ? 'border-blue-600 bg-blue-50/50 shadow-lg scale-[1.02]' 
                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl ${selectedSlot === slot.time ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Clock size={24} />
                </div>
                <div className="text-left">
                  <div className="text-xl font-black text-slate-900">{slot.time}</div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{slot.doctor}</div>
                </div>
              </div>
              <ChevronRight size={20} className={selectedSlot === slot.time ? 'text-blue-600' : 'text-slate-300'} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={handleBook}
          disabled={!selectedSlot}
          className="flex-[2] py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-40 hover:bg-blue-600 shadow-xl flex items-center justify-center gap-4"
        >
          <Video size={28} /> Confirm Triage
        </button>
        <button className="flex-1 py-6 bg-white border border-slate-200 text-slate-900 rounded-[2rem] font-black text-xl uppercase tracking-widest transition-all duration-300 hover:bg-slate-50 shadow-md flex items-center justify-center">
          <Phone size={28} />
        </button>
      </div>
    </div>
  );
}
