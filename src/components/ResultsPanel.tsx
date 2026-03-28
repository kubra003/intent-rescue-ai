'use client';

import React from 'react';
import { ShieldAlert, AlertOctagon, PhoneCall, ArrowRight, RotateCcw } from 'lucide-react';
import { useEmergencyStore } from '../store/useEmergencyStore';

export function ResultsPanel() {
  const { result, status, reset } = useEmergencyStore();

  if (status !== 'success' && status !== 'error' || !result) {
    if (status === 'error') {
       return (
         <div className="bg-red-950/80 backdrop-blur-3xl text-white p-12 rounded-[3.5rem] w-full max-w-2xl text-center border border-red-500/30 shadow-[0_0_120px_rgba(220,38,38,0.3)] animate-in fade-in zoom-in duration-500">
           <AlertOctagon size={120} className="mx-auto mb-8 text-red-500 animate-[pulse_2s_infinite]" strokeWidth={2} />
           <h2 className="text-5xl font-black uppercase tracking-[0.3em] mb-6 text-red-100">AI Error</h2>
           <p className="text-2xl font-medium mb-12 text-red-200">System could not safely categorize the emergency payload. Seek human dispatch immediately.</p>
           <button onClick={reset} className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-full font-black text-2xl uppercase tracking-widest border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl">
             Reset State
           </button>
         </div>
       );
    }
    return null;
  }

  // Determine colors based on risk level
  const isCritical = result.riskLevel === 'Critical' || result.riskLevel === 'High';
  const headerGradient = isCritical ? 'from-red-900 to-black/80' : 'from-orange-900 to-black/80';
  const riskColorBadge = isCritical ? 'border-red-500/50 text-red-300 bg-red-950/50 shadow-[0_0_30px_rgba(220,38,38,0.5)]' : 'border-orange-500/50 text-orange-300 bg-orange-950/50 shadow-[0_0_30px_rgba(249,115,22,0.5)]';

  return (
    <section 
      className="bg-black/50 backdrop-blur-[80px] rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] w-full max-w-3xl border border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-700 ease-out" 
      aria-label="Emergency Response Protocols"
    >
      <div className={`bg-gradient-to-r ${headerGradient} p-8 md:p-12 border-b border-white/10 flex flex-col md:flex-row justify-between md:items-start gap-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="z-10 relative">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-widest flex items-center gap-6 text-white drop-shadow-2xl">
            {isCritical ? <ShieldAlert size={64} className="animate-pulse text-red-500 flex-shrink-0" strokeWidth={2.5} /> : <AlertOctagon size={64} className="text-orange-400 flex-shrink-0" strokeWidth={2} />}
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 leading-tight">
               {result.emergencyType}
            </span>
          </h2>
          <div className="mt-8 flex">
            <span className={`px-6 py-3 font-black text-xl md:text-2xl rounded-full border ${riskColorBadge} uppercase tracking-[0.2em]`}>
              Risk &bull; {result.riskLevel}
            </span>
          </div>
        </div>
        <button onClick={reset} aria-label="Reset" className="z-10 bg-white/5 hover:bg-white/15 p-5 rounded-full transition-all border border-white/5 hover:border-white/20 self-start hover:rotate-180 duration-500 shadow-2xl">
            <RotateCcw size={32} className="text-gray-300" strokeWidth={2.5} />
        </button>
      </div>

      <div className="p-8 md:p-12 bg-white/[0.02] relative">
        <p className="text-2xl md:text-4xl font-semibold text-gray-200 mb-14 border-l-4 border-red-500/50 pl-6 md:pl-8 leading-relaxed tracking-wide">
          {result.summary}
        </p>

        <h3 className="text-2xl md:text-3xl font-black text-gray-500 mb-8 uppercase tracking-[0.3em]">Protocol Outline</h3>
        <ul className="space-y-6 mb-16 relative z-10">
          <div className="absolute left-[1.65rem] top-8 bottom-8 w-1 bg-white/5 rounded-full -z-10 hidden md:block" />
          {result.actions.map((action, idx) => (
            <li key={idx} className="flex flex-col md:flex-row gap-5 md:gap-8 items-start group relative">
              <span className="flex-shrink-0 bg-black/80 text-gray-200 border border-white/10 w-14 h-14 flex items-center justify-center rounded-2xl font-black text-2xl shadow-2xl group-hover:bg-red-900 group-hover:border-red-500/50 group-hover:text-white transition-all duration-300">
                {idx + 1}
              </span>
              <div className="bg-white/5 border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-xl w-full group-hover:bg-white/10 group-hover:border-white/20 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-all duration-500 backdrop-blur-md">
                 <span className="text-xl md:text-3xl font-medium leading-snug text-gray-100 block tracking-wide">
                   {action}
                 </span>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="text-xl md:text-2xl font-black text-gray-500 mb-8 uppercase tracking-[0.3em] flex items-center gap-4">
          <PhoneCall size={28} strokeWidth={2} /> Instant Dispatch
        </h3>
        <div className="flex flex-col gap-6">
          {result.recommendedContacts.map((contact, idx) => (
            <a 
              key={idx} 
              href={`tel:911`} 
              className="group relative overflow-hidden flex justify-between items-center bg-blue-900/30 text-blue-100 p-8 md:p-10 rounded-[2.5rem] text-3xl md:text-5xl font-black border border-blue-500/20 hover:border-blue-400/60 transition-all duration-500 hover:shadow-[0_0_60px_rgba(59,130,246,0.2)] hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <span className="relative z-10 tracking-widest">{contact}</span>
              <ArrowRight size={56} className="relative z-10 hidden sm:block opacity-30 group-hover:opacity-100 group-hover:translate-x-4 transition-all duration-500" strokeWidth={2} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
