import { EmergencyInputPanel } from '../components/EmergencyInputPanel';
import { ResultsPanel } from '../components/ResultsPanel';
import { Activity } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-start py-10 md:py-20 px-4 font-sans w-full overflow-x-hidden relative selection:bg-red-500 selection:text-white">
      
      {/* Dynamic Bright Medical Glassmorphic Background Elements */}
      <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-rose-200/50 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-pulse pointer-events-none" />
      <div className="absolute top-[30%] -right-[10%] w-[50vw] h-[50vw] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] bg-amber-100/50 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none" />

      <header className="mb-16 z-10 text-center flex flex-col items-center w-full max-w-5xl mx-auto">
        <div className="relative group p-6 rounded-[2rem] bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_60px_rgba(220,38,38,0.1)] mb-8 transition-all hover:scale-105 hover:bg-white hover:shadow-[0_20px_80px_rgba(220,38,38,0.2)] duration-500 ease-out cursor-default">
          <Activity size={72} strokeWidth={3} className="text-red-600 animate-[pulse_3s_infinite]" />
        </div>
        
        <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-600 drop-shadow-xl">
          Intent<span className="text-red-600" style={{ textShadow: "0 10px 40px rgba(220,38,38,0.2)" }}>Rescue</span>
        </h1>
        
        <p className="mt-8 text-sm md:text-xl font-bold px-8 py-3 rounded-full bg-white/70 backdrop-blur-md border border-white text-slate-600 shadow-[0_10px_30px_rgba(0,0,0,0.05)] tracking-[0.3em] uppercase">
          AI Emergency Triage Engine
        </p>
      </header>

      {/* Main Grid Layout */}
      <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 lg:gap-16 z-10 relative max-w-[90rem] mx-auto">
         <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
             <EmergencyInputPanel />
         </div>
         <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
             <ResultsPanel />
         </div>
      </div>

      <footer className="mt-32 z-10 pb-8 text-slate-400 font-bold uppercase tracking-[0.4em] text-xs text-center">
         Deterministic Clinical Edge Intelligence &bull; {new Date().getFullYear()}
      </footer>
    </main>
  );
}
