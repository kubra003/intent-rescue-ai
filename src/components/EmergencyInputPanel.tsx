'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, Mic, Megaphone, AlertTriangle, X, Activity } from 'lucide-react';
import { useEmergencyStore } from '../store/useEmergencyStore';

export function EmergencyInputPanel() {
  const { inputText, setInputText, imagePreview, setImagePreview, submitEmergency, status } = useEmergencyStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

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
    <section className="bg-white/[0.03] backdrop-blur-[60px] p-8 md:p-12 rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] w-full max-w-2xl border border-white/10" aria-label="Emergency Input Form">
      <h2 className="text-3xl md:text-5xl font-black mb-10 flex items-center gap-5 text-white uppercase tracking-widest leading-none drop-shadow-lg">
        <div className="bg-red-500/10 p-5 rounded-[1.5rem] border border-red-500/20 shadow-[0_0_40px_rgba(220,38,38,0.2)]">
           <AlertTriangle size={42} className="text-red-500" strokeWidth={2.5} />
        </div>
        Intake Core
      </h2>

      <div className="space-y-8">
        <div className="relative group">
          <label htmlFor="emergency-text" className="sr-only">Type or describe the emergency here</label>
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600/50 to-orange-600/50 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-300 pointer-events-none" />
          <textarea
            id="emergency-text"
            className="relative w-full h-56 p-8 text-xl md:text-3xl bg-black/40 backdrop-blur-2xl rounded-3xl focus:border-red-500/50 border border-white-[0.05] focus:ring-4 focus:ring-red-500/20 outline-none transition-all font-medium text-gray-100 resize-none shadow-inner placeholder-gray-700 block"
            placeholder="Type or speak details... (e.g. Unconscious victim)"
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
            className={`flex-1 flex justify-center items-center gap-4 py-6 rounded-[2rem] font-bold text-xl md:text-2xl transition-all duration-300 transform active:scale-[0.98] border border-white/10 ${
              isRecording 
                ? 'bg-red-500/20 text-red-400 shadow-[0_0_40px_rgba(220,38,38,0.3)] animate-pulse border-red-500/50' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white hover:shadow-2xl'
            }`}
            aria-pressed={isRecording}
          >
            <Mic size={32} strokeWidth={2.5} />
            {isRecording ? "Listening..." : "Dictate"}
          </button>

          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex justify-center items-center gap-4 py-6 bg-white/5 text-gray-400 hover:text-white rounded-[2rem] font-bold text-xl md:text-2xl border border-white/10 hover:bg-white/10 hover:shadow-2xl transition-all duration-300 transform active:scale-[0.98]"
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
          />
        </div>

        {imagePreview && (
          <div className="relative mt-6 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl w-full p-2 bg-black/50 backdrop-blur-xl animate-in fade-in zoom-in duration-500">
            <img src={imagePreview} alt="Uploaded" className="w-full h-80 object-cover rounded-[2rem] opacity-75 mix-blend-lighten" />
            <button 
              onClick={() => setImagePreview(null)} 
              className="absolute top-6 right-6 bg-black/80 backdrop-blur-md text-gray-300 hover:text-white p-4 font-bold rounded-full shadow-2xl border border-white/10 hover:border-red-500 hover:bg-red-900/50 hover:scale-110 transition-all duration-300"
            >
              <X size={28} strokeWidth={3} />
            </button>
          </div>
        )}

        <button 
          onClick={handleSubmit} 
          disabled={status === 'analyzing' || (!inputText && !imagePreview)}
          className="w-full relative group flex justify-center items-center gap-4 py-8 mt-10 rounded-[2.5rem] font-black text-3xl md:text-4xl transition-all duration-500 disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-[0.2em] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-600 to-orange-700 transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity duration-300 mix-blend-overlay pointer-events-none" />
          <span className="relative z-10 flex items-center gap-4 text-white drop-shadow-xl font-black">
            {status === 'analyzing' ? (
               <span className="animate-pulse flex items-center gap-4 opacity-80"><Activity size={40} className="animate-spin text-white" /> Synthesizing...</span>
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
