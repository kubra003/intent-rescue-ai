import { EmergencyInputPanel } from '../components/EmergencyInputPanel';
import { ResultsPanel } from '../components/ResultsPanel';
import { Activity } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-start py-10 md:py-20 px-4 font-sans w-full overflow-x-hidden relative selection:bg-red-600 selection:text-white">
      
      {/* Dynamic Glassmorphic Background Elements */}
      <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-red-900/30 rounded-full mix-blend-screen filter blur-[120px] opacity-70 animate-pulse pointer-events-none" />
      <div className="absolute top-[30%] -right-[10%] w-[50vw] h-[50vw] bg-orange-900/20 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none" />

      <header className="mb-16 z-10 text-center flex flex-col items-center w-full max-w-5xl mx-auto">
        <div className="relative group p-6 rounded-[2rem] bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_0_80px_rgba(220,38,38,0.15)] mb-8 transition-all hover:scale-105 hover:bg-white/[0.05] hover:shadow-[0_0_100px_rgba(220,38,38,0.3)] duration-500 ease-out cursor-default">
          <Activity size={72} strokeWidth={2.5} className="text-red-500 animate-[pulse_3s_infinite]" />
        </div>
        
        <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 drop-shadow-2xl">
          Intent<span className="text-red-600" style={{ textShadow: "0 0 80px rgba(220,38,38,0.8)" }}>Rescue</span>
        </h1>
        
        <p className="mt-8 text-sm md:text-xl font-medium px-8 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-gray-400 shadow-2xl tracking-[0.3em] uppercase">
          AI Emergency Triage Engine
        </p>
      </header>

      {/* Main Grid Layout to accommodate the sleek panels */}
      <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 lg:gap-16 z-10 relative max-w-[90rem] mx-auto">
         <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
             <EmergencyInputPanel />
         </div>
         <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
             <ResultsPanel />
         </div>
      </div>

      <footer className="mt-32 z-10 pb-8 text-gray-600 font-bold uppercase tracking-[0.4em] text-xs text-center">
         Deterministic Edge Intelligence &bull; {new Date().getFullYear()}
      </footer>
    </main>
  );
}
