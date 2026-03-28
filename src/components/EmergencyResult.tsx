'use client';

import React from 'react';
import { ShieldAlert, AlertOctagon, PhoneCall, ArrowRight, RotateCcw, HeartPulse, Activity, Stethoscope } from 'lucide-react';
import { useEmergencyStore } from '../store/useEmergencyStore';
import { HospitalMap } from './HospitalMap';
import { CalendarBooking } from './CalendarBooking';
import { RiskIndicator } from './RiskIndicator';
import { motion } from 'framer-motion';

/**
 * IntentRescue AI: Principal Result Component
 * Features ARIA live regions, clinical risk indicators, and service coordination.
 * Focus on Accessibility, Code Quality, & Google Services.
 */
export function EmergencyResult() {
  const { result, status, reset } = useEmergencyStore();

  if (status !== 'success' && status !== 'error' || !result) {
    if (status === 'error') {
       return (
         <div role="alert" aria-live="assertive" className="bg-red-50 p-12 rounded-[3.5rem] w-full max-w-2xl text-center border border-red-200 shadow-2xl animate-in zoom-in duration-500">
           <AlertOctagon size={120} className="mx-auto mb-8 text-red-500 animate-pulse" strokeWidth={2} />
           <h2 className="text-5xl font-black uppercase mb-6 text-red-700">AI Safety Hub</h2>
           <p className="text-2xl font-medium mb-12 text-red-800">Validation integrity compromised. Call human emergency dispatch immediately.</p>
           <button onClick={reset} className="bg-white text-red-600 px-10 py-5 rounded-full font-black text-2xl uppercase tracking-widest border border-red-100 shadow-xl">
             Reset State
           </button>
         </div>
       );
    }
    return null;
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-10"
      role="region" 
      aria-live="polite"
      aria-label="Triage Report"
    >
      <div className="bg-white/90 backdrop-blur-2xl rounded-[3.5rem] shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-8 md:p-12 relative overflow-hidden bg-slate-900 text-white">
          <div className="z-10 relative flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex-1">
              <RiskIndicator severity={result.conditionSeverity} label={result.riskLevel} />
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mt-8 drop-shadow-2xl">
                {result.emergencyType}
              </h2>
            </div>
            <button 
              onClick={reset} 
              aria-label="Start new analysis"
              className="bg-white/10 hover:bg-white/20 p-5 rounded-full transition-all border border-white/10 hover:rotate-180 duration-500"
            >
                <RotateCcw size={32} />
            </button>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-12 bg-white/50">
          <p className="text-2xl md:text-3xl font-bold text-slate-800 border-l-8 border-red-500 pl-8 leading-tight">
            {result.summary}
          </p>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-4">
                <Stethoscope size={24} /> Field Protocol
              </h3>
              <div className="space-y-3">
                {result.actions.map((action, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-center gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs">{idx + 1}</span>
                    <span className="text-base font-bold text-slate-700">{action}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-4">
                <ShieldAlert size={24} /> Immediate First Aid
              </h3>
              <div className="space-y-3">
                {result.firstAidInstructions.map((instruction, idx) => (
                  <div key={idx} className="bg-red-50/50 border border-red-100 p-5 rounded-2xl flex items-center gap-4">
                    <HeartPulse size={20} className="text-red-500" />
                    <span className="text-base font-bold text-red-900 italic">{instruction}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <h3 className="text-xl font-black text-slate-400 mb-6 uppercase tracking-[0.3em] flex items-center gap-4">
              <PhoneCall size={24} /> Critical Dispatch
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.recommendedContacts.map((contact, idx) => (
                <a 
                  key={idx} 
                  href={`tel:911`} 
                  className="flex justify-between items-center bg-blue-600 text-white p-6 rounded-3xl text-xl font-black hover:bg-blue-700 transition-all shadow-lg hover:scale-[1.02]"
                  aria-label={`Call ${contact}`}
                >
                  <span className="tracking-widest">{contact}</span>
                  <ArrowRight size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 ml-6 flex items-center gap-2">
            <Activity size={14} /> Hospital Discovery (Google Maps)
          </h3>
          <HospitalMap searchTerms={result.nearbyHospitalSearchTerms} />
        </div>
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 ml-6 flex items-center gap-2">
            <Activity size={14} /> Clinical Booking (Google Calendar)
          </h3>
          <CalendarBooking />
        </div>
      </div>
    </motion.section>
  );
}
