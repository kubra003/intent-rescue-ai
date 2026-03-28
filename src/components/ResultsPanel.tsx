'use client';

import React from 'react';
import { ShieldAlert, AlertOctagon, PhoneCall, ArrowRight, RotateCcw, HeartPulse, Activity, Stethoscope } from 'lucide-react';
import { useEmergencyStore } from '../store/useEmergencyStore';
import { HospitalMap } from './HospitalMap';
import { CalendarBooking } from './CalendarBooking';
import { motion, AnimatePresence } from 'framer-motion';

export function ResultsPanel() {
  const { result, status, reset } = useEmergencyStore();

  if (status !== 'success' && status !== 'error' || !result) {
    if (status === 'error') {
       return (
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-red-50 backdrop-blur-3xl text-red-900 p-12 rounded-[3.5rem] w-full max-w-2xl text-center border border-red-200 shadow-[0_40px_100px_rgba(220,38,38,0.15)]"
         >
           <AlertOctagon size={120} className="mx-auto mb-8 text-red-500 animate-pulse" strokeWidth={2} />
           <h2 className="text-5xl font-black uppercase tracking-[0.3em] mb-6 text-red-700">AI Error</h2>
           <p className="text-2xl font-medium mb-12 text-red-800">System could not safely categorize the emergency payload. Seek human dispatch immediately.</p>
           <button onClick={reset} className="bg-white hover:bg-slate-50 text-red-600 px-10 py-5 rounded-full font-black text-2xl uppercase tracking-widest border border-red-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl">
             Reset State
           </button>
         </motion.div>
       );
    }
    return null;
  }

  const isCritical = result.riskLevel === 'Critical' || result.riskLevel === 'High';
  const severityColors = [
    'bg-emerald-500', // 1
    'bg-blue-500',    // 2
    'bg-amber-500',   // 3
    'bg-orange-500',  // 4
    'bg-red-600'      // 5
  ];
  const severityColor = severityColors[result.conditionSeverity - 1] || 'bg-slate-500';

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full space-y-10"
      aria-label="Emergency Response Protocols"
    >
      {/* Risk & Severity Header */}
      <div className="bg-white/90 backdrop-blur-2xl rounded-[3.5rem] shadow-2xl border border-slate-200 overflow-hidden">
        <div className={`p-8 md:p-12 relative overflow-hidden bg-slate-900 text-white`}>
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Activity size={200} className="text-white" />
          </div>
          
          <div className="z-10 relative flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-4 h-4 rounded-full ${severityColor} animate-ping`} />
                <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Clinical Severity Level {result.conditionSeverity}</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter flex items-center gap-6 drop-shadow-2xl">
                {result.emergencyType}
              </h2>
              <div className="mt-8 flex gap-4">
                <span className={`px-6 py-3 font-black text-xl rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-md uppercase tracking-[0.2em]`}>
                  {result.riskLevel} Risk
                </span>
                <span className={`px-6 py-3 font-black text-xl rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-md uppercase tracking-[0.2em] flex items-center gap-2`}>
                   <HeartPulse size={20} className="text-red-400" /> Triage Score: {result.conditionSeverity}/5
                </span>
              </div>
            </div>
            <button onClick={reset} className="bg-white/10 hover:bg-white/20 p-5 rounded-full transition-all border border-white/10 hover:rotate-180 duration-500">
                <RotateCcw size={32} />
            </button>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-12">
          {/* Summary */}
          <p className="text-2xl md:text-4xl font-bold text-slate-800 leading-tight tracking-tight border-l-8 border-red-500 pl-8">
            {result.summary}
          </p>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {/* Action Protocols */}
            <div className="space-y-8">
              <h3 className="text-2xl font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-4">
                <Stethoscope size={28} /> Response Protocol
              </h3>
              <div className="space-y-4">
                {result.actions.map((action, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="bg-slate-50 border border-slate-100 p-6 rounded-3xl flex items-start gap-6 hover:bg-white hover:border-slate-200 hover:shadow-lg transition-all duration-300"
                  >
                    <span className="shrink-0 w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">{idx + 1}</span>
                    <span className="text-lg font-bold text-slate-700 leading-snug">{action}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* First Aid */}
            <div className="space-y-8">
              <h3 className="text-2xl font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-4">
                <ShieldAlert size={28} /> First Aid Execution
              </h3>
              <div className="space-y-4">
                {result.firstAidInstructions.map((instruction, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="bg-red-50/50 border border-red-100 p-6 rounded-3xl flex items-start gap-6 group hover:bg-red-50 transition-all duration-300"
                  >
                    <div className="shrink-0 p-2 bg-red-100 rounded-lg text-red-600 group-hover:scale-110 transition-transform">
                      <HeartPulse size={20} />
                    </div>
                    <span className="text-lg font-bold text-red-900 leading-snug italic">"{instruction}"</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Dispatch */}
          <div className="pt-8">
            <h3 className="text-2xl font-black text-slate-400 mb-8 uppercase tracking-[0.3em] flex items-center gap-4">
              <PhoneCall size={28} /> Emergency Dispatch
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.recommendedContacts.map((contact, idx) => (
                <a 
                  key={idx} 
                  href={`tel:911`} 
                  className="group relative flex justify-between items-center bg-blue-600 text-white p-8 rounded-[2.5rem] text-3xl font-black hover:bg-blue-700 transition-all duration-300 shadow-xl hover:scale-[1.02]"
                >
                  <span className="tracking-widest">{contact}</span>
                  <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Google Services Integration Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-xl font-black uppercase tracking-[0.4em] text-slate-500 ml-6">Resource Discovery &bull; Google Maps</h3>
          <HospitalMap searchTerms={result.nearbyHospitalSearchTerms} />
        </div>
        <div className="space-y-6">
          <h3 className="text-xl font-black uppercase tracking-[0.4em] text-slate-500 ml-6">Triage Management &bull; Google Calendar</h3>
          <CalendarBooking />
        </div>
      </div>
    </motion.section>
  );
}
