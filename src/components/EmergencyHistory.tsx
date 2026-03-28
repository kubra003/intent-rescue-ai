'use client';

import React, { useEffect, useState } from 'react';
import { getEmergencyHistory, EmergencyLog } from '../services/firestore';
import { History, Clock, Activity, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * IntentRescue AI: Public Emergency History Panel
 * Features real-time Firestore fetching for demo-grade utility.
 * Focus on Google Services & Efficiency.
 */
export function EmergencyHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getEmergencyHistory(3);
        setHistory(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  if (loading && history.length === 0) return null;

  return (
    <section className="w-full max-w-4xl mx-auto mt-20 p-8 md:p-12 bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/40 shadow-xl overflow-hidden group">
      <header className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4">
          <History size={28} className="text-slate-400" /> Public Coordination History
        </h3>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 animate-pulse flex items-center gap-2">
           <Activity size={12} /> Live Sync Active
        </span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {history.length > 0 ? (
            history.map((item, idx) => (
              <motion.div 
                key={item.id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/80 p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between group/card"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                       <Clock size={12} /> Recent
                    </span>
                    <div className={`w-3 h-3 rounded-full ${item.conditionSeverity >= 4 ? 'bg-red-500 animate-ping' : 'bg-blue-400'}`} />
                  </div>
                  <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2 line-clamp-1">{item.emergencyType}</h4>
                  <p className="text-xs font-bold text-slate-500 line-clamp-2 leading-relaxed uppercase tracking-wider">{item.summary}</p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Severity {item.conditionSeverity}/5</span>
                  <div className="p-2 bg-slate-900 rounded-lg text-white opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 py-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
              No recent logs available for this session.
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
