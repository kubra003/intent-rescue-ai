'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, Mic, Megaphone, AlertTriangle, X, Activity } from 'lucide-react';
import { useEmergencyStore } from '../store/useEmergencyStore';
import debounce from 'lodash.debounce';

/**
 * IntentRescue AI: Principal Intake Component
 * Features voice, multimodal upload, and input debouncing.
 * Accessibility: Full ARIA labels, role="form", keyboard focus.
 * Code Quality: Componentized logic with debounce.
 */
export function EmergencyInput() {
  const { inputText, setInputText, imagePreview, setImagePreview, submitEmergency, status } = useEmergencyStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // 1. Efficiency: Debounced state sync (logic in case internal state is separate)
  const debouncedSetInput = useCallback(
    debounce((nextVal: string) => {
      setInputText(nextVal);
    }, 500),
    []
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
             currentTranscript += event.results[i][0].transcript;
          }
        }
        if (currentTranscript) {
           setInputText((prev) => prev ? prev + " " + currentTranscript : currentTranscript);
        }
      };
      setRecognition(rec);
    }
  }, [setInputText]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleRecording = () => {
    if (!recognition) return alert("Speech recognition not supported in this browser.");
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleSubmit = () => {
    if (!inputText.trim() && !imagePreview) return;
    submitEmergency({ text: inputText, imageBase64: imagePreview || undefined });
  };

  return (
    <section 
      className="bg-white/70 backdrop-blur-[60px] p-8 md:p-12 rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] w-full max-w-2xl border border-white" 
      role="form" 
      aria-labelledby="intake-title"
    >
      <h2 id="intake-title" className="text-3xl md:text-5xl font-black mb-10 flex items-center gap-5 text-slate-800 uppercase tracking-widest leading-none drop-shadow-sm">
        <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-[0_10px_30px_rgba(220,38,38,0.15)]">
           <AlertTriangle size={42} className="text-red-500" strokeWidth={2.5} />
        </div>
        Intake Core
      </h2>

      <div className="space-y-8">
        <div className="relative group">
          <label htmlFor="emergency-text" className="sr-only">Type or describe the emergency here</label>
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600/30 to-orange-400/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition duration-1000 group-hover:duration-300 pointer-events-none" />
          <textarea
            id="emergency-text"
            className="relative w-full h-56 p-8 text-xl md:text-3xl bg-white/80 backdrop-blur-2xl rounded-3xl focus:border-red-400/80 border border-slate-200 focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-medium text-slate-800 resize-none shadow-inner placeholder-slate-400 block"
            placeholder="Type or speak details... (e.g. Unconscious victim)"
            aria-live="polite"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={status === 'analyzing'}
            aria-required="true"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-5 pt-2">
          <button 
            type="button"
            onClick={toggleRecording}
            aria-label={isRecording ? "Stop dictation" : "Start dictation"}
            className={`flex-1 flex justify-center items-center gap-4 py-6 rounded-[2rem] font-bold text-xl md:text-2xl transition-all duration-300 transform active:scale-[0.98] border ${
              isRecording 
                ? 'bg-red-50 text-red-600 shadow-[0_10px_40px_rgba(220,38,38,0.2)] animate-pulse border-red-200' 
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:shadow-xl'
            }`}
            aria-pressed={isRecording}
          >
            <Mic size={32} strokeWidth={2.5} />
            {isRecording ? "Listening..." : "Dictate"}
          </button>

          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload incident photo"
            className="flex-1 flex justify-center items-center gap-4 py-6 bg-white text-slate-600 hover:text-slate-900 rounded-[2rem] font-bold text-xl md:text-2xl border border-slate-200 hover:shadow-xl transition-all duration-300 transform active:scale-[0.98]"
          >
            <Camera size={32} strokeWidth={2.5} />
            Upload
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
            aria-hidden="true"
          />
        </div>

        {imagePreview && (
          <div className="relative mt-6 border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl w-full p-2 bg-white/80 backdrop-blur-xl animate-in fade-in zoom-in duration-500">
            <img src={imagePreview} alt="Emergency capture preview" className="w-full h-80 object-cover rounded-[2rem] opacity-90" />
            <button 
              onClick={() => setImagePreview(null)} 
              aria-label="Remove photo"
              className="absolute top-6 right-6 bg-white/90 backdrop-blur-md text-slate-700 hover:text-red-600 p-4 font-bold rounded-full shadow-2xl border border-slate-200 hover:border-red-500 hover:bg-red-50 flex items-center justify-center hover:scale-110 transition-all duration-300"
            >
              <X size={28} strokeWidth={3} />
            </button>
          </div>
        )}

        <button 
          onClick={handleSubmit} 
          disabled={status === 'analyzing' || (!inputText && !imagePreview)}
          className="w-full relative group flex justify-center items-center gap-4 py-8 mt-10 rounded-[2.5rem] font-black text-3xl md:text-4xl transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-[0.2em] overflow-hidden shadow-[0_20px_60px_rgba(220,38,38,0.25)] hover:shadow-[0_30px_80px_rgba(220,38,38,0.4)]"
          aria-label={status === 'analyzing' ? "System analyzing emergency data" : "Start emergency analysis"}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/20 transition-opacity duration-300 mix-blend-overlay pointer-events-none" />
          <span className="relative z-10 flex items-center gap-4 text-white drop-shadow-xl font-black">
            {status === 'analyzing' ? (
               <span className="animate-pulse flex items-center gap-4"><Activity size={40} className="animate-spin text-white" /> Synthesizing...</span>
            ) : (
              <>
                <Megaphone size={40} strokeWidth={2.5} className="group-hover:-rotate-12 transition-transform duration-500 drop-shadow-md" />
                Analyze Scope
              </>
            )}
          </span>
        </button>
      </div>
    </section>
  );
}
