'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RiskIndicatorProps {
  severity: number; // 1-5
  label: string;
}

/**
 * IntentRescue AI: Clinical Severity & Risk Visualization
 * Features high-contrast color coding and accessibility-first design.
 * Focus on Accessibility & Code Quality.
 */
export function RiskIndicator({ severity, label }: RiskIndicatorProps) {
  const levels = [1, 2, 3, 4, 5];
  
  const getSeverityColor = (level: number) => {
    if (level > severity) return 'bg-slate-200';
    switch (severity) {
      case 1: return 'bg-emerald-500';
      case 2: return 'bg-blue-500';
      case 3: return 'bg-amber-500';
      case 4: return 'bg-orange-500';
      case 5: return 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]';
      default: return 'bg-slate-400';
    }
  };

  const getSeverityText = () => {
    switch (severity) {
      case 5: return 'Critical - Immediate Action';
      case 4: return 'High - Urgent Care';
      case 3: return 'Medium - Stable';
      case 2: return 'Low - Minor';
      case 1: return 'Minimal - Routine';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-4 w-full" role="group" aria-label={`Severity Level: ${getSeverityText()}`}>
      <div className="flex justify-between items-end mb-2">
        <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Clinical Triage Score</span>
        <span className="text-sm font-black text-slate-900 uppercase tracking-widest">{label}</span>
      </div>
      
      <div className="flex gap-2 h-4 w-full">
        {levels.map((level) => (
          <motion.div
            key={level}
            initial={{ scaleY: 0.5, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: level * 0.1 }}
            className={`flex-1 rounded-full transition-all duration-500 ${getSeverityColor(level)}`}
          />
        ))}
      </div>
      
      <div className="flex justify-between items-center bg-slate-100/50 p-4 rounded-2xl border border-slate-100">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</div>
        <div className="text-sm font-black text-slate-800 uppercase tracking-widest animate-pulse">
          {getSeverityText()}
        </div>
      </div>
    </div>
  );
}
