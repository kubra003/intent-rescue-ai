import { EmergencyInputPanel } from '../components/EmergencyInputPanel';
import { ResultsPanel } from '../components/ResultsPanel';
import { Activity } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-start py-8 md:py-16 px-4 font-sans max-w-[100vw] overflow-x-hidden selection:bg-red-600 selection:text-white">
      <header className="mb-10 text-center text-white flex flex-col items-center select-none w-full max-w-4xl mx-auto">
        <div className="bg-red-700 p-4 rounded-3xl border-[6px] border-black shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] mb-6">
          <Activity size={80} strokeWidth={3} className="text-white animate-pulse" />
        </div>
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white" style={{ textShadow: "6px 6px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000" }}>
          Intent<span className="text-red-600" style={{ textShadow: "6px 6px 0 #000" }}>Rescue</span>
        </h1>
        <p className="mt-6 text-xl md:text-3xl font-bold bg-black px-8 py-3 rounded-full border-[4px] border-gray-700 text-gray-300 shadow-xl uppercase tracking-widest">
          Emergency AI Bridge
        </p>
      </header>

      <div className="w-full flex flex-col items-center gap-8 z-10 relative">
        <EmergencyInputPanel />
        <ResultsPanel />
      </div>

      <footer className="mt-16 text-gray-600 font-bold uppercase tracking-widest text-sm text-center">
         Deterministic Emergency AI &bull; {new Date().getFullYear()}
      </footer>
    </main>
  );
}
