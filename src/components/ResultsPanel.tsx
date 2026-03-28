'use client';

import React from 'react';
import { ShieldAlert, AlertOctagon, PhoneCall, ArrowRight, RotateCcw } from 'lucide-react';
import { useEmergencyStore } from '../store/useEmergencyStore';

export function ResultsPanel() {
  const { result, status, reset } = useEmergencyStore();

  if (status !== 'success' && status !== 'error' || !result) {
    if (status === 'error') {
       return (
         <div className="bg-red-900 text-white p-8 rounded-3xl w-full max-w-2xl text-center border-[6px] border-black" aria-live="assertive">
           <AlertOctagon size={80} className="mx-auto mb-6 animate-pulse" />
           <h2 className="text-4xl font-black uppercase tracking-widest mb-4">System Error</h2>
           <p className="text-2xl font-bold mb-8">Unable to process the emergency. Seek immediate human assistance.</p>
           <button onClick={reset} className="bg-white text-red-900 px-8 py-4 rounded-2xl font-black text-2xl uppercase border-b-[8px] border-gray-300 active:border-b-0 active:translate-y-[8px] hover:bg-gray-100 transition-all">
             Try Again
           </button>
         </div>
       );
    }
    return null;
  }

  // Determine colors based on risk level
  const isCritical = result.riskLevel === 'Critical' || result.riskLevel === 'High';
  const headerBg = isCritical ? 'bg-red-700' : 'bg-orange-600';

  return (
    <section 
      className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border-[6px] border-black overflow-hidden animate-in fade-in zoom-in duration-300" 
      aria-label="Emergency Response Protocols"
      aria-live="assertive"
    >
      <div className={`${headerBg} p-6 md:p-8 text-white border-b-[6px] border-black flex flex-col md:flex-row justify-between md:items-center gap-4`}>
        <div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-widest flex items-center gap-4 py-2 leading-none">
            {isCritical ? <ShieldAlert size={48} className="animate-pulse flex-shrink-0" /> : <AlertOctagon size={48} className="flex-shrink-0" />}
            {result.emergencyType}
          </h2>
          <span className="inline-block mt-3 px-5 py-2 bg-black text-white font-black text-2xl rounded-full border-[3px] border-white uppercase shadow-md">
            Risk: {result.riskLevel}
          </span>
        </div>
        <button onClick={reset} aria-label="Reset and start over" className="bg-black/30 hover:bg-black/50 p-4 rounded-full transition-colors self-start md:self-center border-4 border-transparent hover:border-white focus:outline-none focus:ring-4 focus:ring-white">
            <RotateCcw size={32} />
        </button>
      </div>

      <div className="p-6 md:p-8 bg-gray-50">
        <p className="text-xl md:text-3xl font-bold text-gray-900 mb-10 border-l-[8px] border-black pl-5 leading-tight">
          {result.summary}
        </p>

        <h3 className="text-3xl md:text-4xl font-black text-black mb-6 uppercase tracking-wider">Action Steps</h3>
        <ul className="space-y-5 mb-10">
          {result.actions.map((action, idx) => (
            <li key={idx} className="flex gap-5 items-start bg-white p-5 rounded-3xl border-[4px] border-black shadow-md">
              <span className="flex-shrink-0 bg-black text-white w-12 h-12 flex items-center justify-center rounded-full font-black text-2xl shadow-inner">
                {idx + 1}
              </span>
              <span className="text-2xl md:text-3xl font-bold leading-tight pt-1 text-gray-900">
                {action}
              </span>
            </li>
          ))}
        </ul>

        <h3 className="text-3xl md:text-4xl font-black text-black mb-6 uppercase tracking-wider flex items-center gap-4">
          <PhoneCall size={36} strokeWidth={3} /> Contacts
        </h3>
        <div className="flex flex-col gap-5">
          {result.recommendedContacts.map((contact, idx) => (
            <a 
              key={idx} 
              href={`tel:911`} 
              className="flex justify-between items-center bg-blue-700 text-white p-6 rounded-2xl text-2xl md:text-4xl font-black border-[6px] border-black hover:bg-blue-600 active:translate-y-[8px] active:border-b-0 transition-transform uppercase shadow-[0_8px_0_0_#000] active:shadow-none"
            >
              <span>{contact}</span>
              <ArrowRight size={48} className="hidden sm:block" strokeWidth={3} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
