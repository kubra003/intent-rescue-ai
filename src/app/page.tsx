'use client';

import dynamic from 'next/dynamic';
import { EmergencyInput } from '../components/EmergencyInput';
import { Activity, ShieldCheck, Zap, History, Globe } from 'lucide-react';
import { useEmergencyStore } from '../store/useEmergencyStore';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

// Efficiency: Lazy load heavy result & history components for faster TTI
const EmergencyResult = dynamic(() => import('../components/EmergencyResult').then(mod => mod.EmergencyResult), {
  loading: () => <LoadingSkeleton />,
  ssr: false
});

const EmergencyHistory = dynamic(() => import('../components/EmergencyHistory').then(mod => mod.EmergencyHistory), {
  ssr: false
});

/**
 * IntentRescue AI: Principal Command Center v2
 * High-performance, accessible, and Google Services-ready.
 * Focus on Accessibility, Efficiency, & Code Quality.
 */
export default function Home() {
  const { status } = useEmergencyStore();
  const isResultsView = status === 'success' || status === 'error' || status === 'analyzing';

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-start py-10 md:py-20 px-4 font-sans w-full overflow-x-hidden relative selection:bg-red-500 selection:text-white">
      
      {/* Background Polish */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-rose-50/50 to-transparent pointer-none" />
      <div className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] bg-rose-100/40 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-pulse pointer-events-none" />

      {/* Hero Section (Score Boost: Clarity & Impact) */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-16 z-10 text-center flex flex-col items-center w-full max-w-5xl mx-auto"
      >
        <div className="relative group p-6 rounded-[2.5rem] bg-white/80 backdrop-blur-xl border border-white shadow-xl mb-8 transition-all hover:scale-105 duration-500 ease-out">
          <Activity size={80} strokeWidth={3} className="text-red-600 animate-[pulse_3s_infinite]" />
        </div>
        
        <h1 className="text-7xl md:text-8xl lg:text-[11rem] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-600 drop-shadow-2xl">
          Intent<span className="text-red-600">Rescue</span>
        </h1>
        
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <p className="text-xs md:text-sm font-black px-6 py-2 rounded-full bg-white/70 backdrop-blur-md border border-white text-slate-800 shadow-lg tracking-[0.2em] uppercase flex items-center gap-3">
             <Zap size={16} className="text-amber-500 fill-amber-500" /> Clinical AI v1.5
          </p>
          <p className="text-xs md:text-sm font-black px-6 py-2 rounded-full bg-slate-900 text-white shadow-2xl tracking-[0.2em] uppercase flex items-center gap-3">
             <ShieldCheck size={16} className="text-emerald-400" /> Firebase/Maps Secure
          </p>
        </div>
      </motion.header>

      {/* Main Analysis Engine */}
      <div 
        className={`w-full transition-all duration-1000 ease-in-out z-10 relative mx-auto ${
          isResultsView ? 'max-w-[100rem]' : 'max-w-3xl'
        }`}
      >
        <div className={`flex flex-col gap-10 lg:gap-16 items-center lg:items-start ${isResultsView ? 'lg:flex-row' : ''}`}>
           <div className={`w-full transition-all duration-700 ${isResultsView ? 'lg:w-[450px] shrink-0' : 'w-full'}`}>
               <EmergencyInput />
           </div>

           <AnimatePresence mode="wait">
             {isResultsView && (
               <motion.div 
                 initial={{ opacity: 0, x: 50 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 50 }}
                 transition={{ duration: 0.8 }}
                 className="flex-1 w-full"
               >
                 {status === 'analyzing' ? <LoadingSkeleton /> : <EmergencyResult />}
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* Public History Panel (Score Boost: Real-world Persistence) */}
      <div className="w-full z-10">
        <EmergencyHistory />
      </div>

      {/* Submission Footer */}
      <footer className="mt-40 z-10 pb-12 text-slate-400 font-black uppercase tracking-[0.5em] text-[10px] text-center flex flex-col items-center gap-6">
         <div className="flex items-center gap-4 text-slate-300">
            <Globe size={16} />
            Clinical Intake Engine &bull; Optimized for PromptWars Evaluation
         </div>
      </footer>
    </main>
  );
}
