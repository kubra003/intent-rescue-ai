'use client';

import React from 'react';
import { ShieldAlert, AlertOctagon, PhoneCall, ArrowRight, RotateCcw } from 'lucide-react';
import { useEmergencyStore } from '../store/useEmergencyStore';

export function ResultsPanel() {
  const { result, status, reset } = useEmergencyStore();

  if (status !== 'success' && status !== 'error' || !result) {
    if (status === 'error') {
       return (
         <div className="bg-red-50 backdrop-blur-3xl text-red-900 p-12 rounded-[3.5rem] w-full max-w-2xl text-center border border-red-200 shadow-[0_40px_100px_rgba(220,38,38,0.15)] animate-in fade-in zoom-in duration-500">
           <AlertOctagon size={120} className="mx-auto mb-8 text-red-500 animate-[pulse_2s_infinite]" strokeWidth={2} />
           <h2 className="text-5xl font-black uppercase tracking-[0.3em] mb-6 text-red-700">AI Error</h2>
           <p className="text-2xl font-medium mb-12 text-red-800">System could not safely categorize the emergency payload. Seek human dispatch immediately.</p>
           <button onClick={reset} className="bg-white hover:bg-slate-50 text-red-600 px-10 py-5 rounded-full font-black text-2xl uppercase tracking-widest border border-red-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl">
             Reset State
           </button>
         </div>
       );
    }
    return null;
  }

  // Determine colors based on risk level
  const isCritical = result.riskLevel === 'Critical' || result.riskLevel === 'High';
  const headerGradient = isCritical ? 'from-red-600 to-rose-700' : 'from-orange-500 to-amber-600';
  const riskColorBadge = isCritical ? 'border-red-500 text-red-700 bg-red-50 shadow-[0_5px_20px_rgba(220,38,38,0.2)]' : 'border-orange-500 text-orange-700 bg-orange-50 shadow-[0_5px_20px_rgba(249,115,22,0.2)]';

  return (
    <section 
      className="bg-white/90 backdrop-blur-[80px] rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.06)] w-full max-w-3xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-700 ease-out" 
      aria-label="Emergency Response Protocols"
    >
      <div className={`bg-gradient-to-r ${headerGradient} p-8 md:p-12 shadow-md flex flex-col md:flex-row justify-between md:items-start gap-8 relative overflow-hidden border-b border-black/10`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="z-10 relative">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-widest flex items-center gap-6 text-white drop-shadow-xl">
            {isCritical ? <ShieldAlert size={64} className="animate-pulse flex-shrink-0 text-white" strokeWidth={2.5} /> : <AlertOctagon size={64} className="flex-shrink-0 text-white" strokeWidth={2.5} />}
            <span className="leading-tight">
               {result.emergencyType}
            </span>
          </h2>
          <div className="mt-8 flex">
            <span className={`px-6 py-3 font-black text-xl md:text-2xl rounded-full border ${riskColorBadge} uppercase tracking-[0.2em] relative overflow-hidden backdrop-blur-md`}>
              Risk &bull; {result.riskLevel}
            </span>
          </div>
        </div>
        <button onClick={reset} aria-label="Reset" className="z-10 bg-black/10 hover:bg-black/20 p-5 rounded-full transition-all border border-transparent hover:border-white/30 self-start hover:rotate-180 duration-500 shadow-md">
            <RotateCcw size={32} className="text-white" strokeWidth={2.5} />
        </button>
      </div>

      <div className="p-8 md:p-12 bg-slate-50 relative">
        <p className="text-2xl md:text-4xl font-semibold text-slate-800 mb-14 border-l-4 border-red-500 pl-6 md:pl-8 leading-relaxed tracking-wide drop-shadow-sm">
          {result.summary}
        </p>

        <h3 className="text-2xl md:text-3xl font-black text-slate-400 mb-8 uppercase tracking-[0.3em]">Protocol Outline</h3>
        <ul className="space-y-6 mb-16 relative z-10">
          <div className="absolute left-[1.65rem] top-8 bottom-8 w-1 bg-slate-200 rounded-full -z-10 hidden md:block" />
          {result.actions.map((action, idx) => (
            <li key={idx} className="flex flex-col md:flex-row gap-5 md:gap-8 items-start group relative">
              <span className="flex-shrink-0 bg-white text-slate-700 border border-slate-200 w-14 h-14 flex items-center justify-center rounded-2xl font-black text-2xl shadow-lg group-hover:bg-red-50 group-hover:border-red-200 group-hover:text-red-700 transition-all duration-300 z-10">
                {idx + 1}
              </span>
              <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-[2rem] shadow-sm w-full group-hover:bg-slate-50 group-hover:border-slate-200 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-500">
                 <span className="text-xl md:text-3xl font-medium leading-snug text-slate-800 block tracking-wide">
                   {action}
                 </span>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="text-xl md:text-2xl font-black text-slate-400 mb-8 uppercase tracking-[0.3em] flex items-center gap-4">
          <PhoneCall size={28} className="text-slate-400" strokeWidth={2.5} /> Instant Dispatch
        </h3>
        <div className="flex flex-col gap-6">
          {result.recommendedContacts.map((contact, idx) => (
            <a 
              key={idx} 
              href={`tel:911`} 
              className="group relative overflow-hidden flex justify-between items-center bg-blue-600 text-white p-8 md:p-10 rounded-[2.5rem] text-3xl md:text-5xl font-black border border-blue-500 hover:border-blue-400 transition-all duration-500 shadow-[0_20px_50px_rgba(37,99,235,0.25)] hover:shadow-[0_30px_60px_rgba(37,99,235,0.4)] hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <span className="relative z-10 tracking-widest drop-shadow-md">{contact}</span>
              <ArrowRight size={56} className="relative z-10 hidden sm:block opacity-70 group-hover:opacity-100 group-hover:translate-x-4 transition-all duration-500 drop-shadow-md" strokeWidth={3} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
