'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, Mic, Megaphone, AlertTriangle, X } from 'lucide-react';
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
    <section className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-2xl border-[6px] border-black" aria-label="Emergency Input Form">
      <h2 className="text-3xl md:text-4xl font-black mb-6 flex items-center gap-3 text-red-700 uppercase tracking-widest leading-none">
        <AlertTriangle size={42} aria-hidden="true" strokeWidth={3} />
        Emergency Intake
      </h2>

      <div className="space-y-6">
        <div className="relative">
          <label htmlFor="emergency-text" className="sr-only">Type or describe the emergency here</label>
          <textarea
            id="emergency-text"
            className="w-full h-40 p-5 text-xl md:text-2xl border-[4px] border-black rounded-xl focus:border-red-600 focus:ring-4 focus:ring-red-200 transition-all font-bold text-gray-900 resize-none shadow-inner"
            placeholder="What is happening? (e.g., Car crash, poison, chemical leak...)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={status === 'analyzing'}
            aria-required="true"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            type="button"
            onClick={toggleRecording}
            className={`flex-1 flex justify-center items-center gap-3 py-5 rounded-2xl font-bold text-xl md:text-2xl border-b-[6px] active:border-b-0 active:translate-y-2 transition-all ${
              isRecording ? 'bg-red-600 text-white border-red-900 animate-pulse' : 'bg-gray-200 text-black border-gray-400 hover:bg-gray-300'
            }`}
            aria-pressed={isRecording}
            aria-label={isRecording ? "Stop voice recording" : "Start voice recording"}
          >
            <Mic size={32} strokeWidth={2.5} />
            {isRecording ? "Listening..." : "Voice"}
          </button>

          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex justify-center items-center gap-3 py-5 bg-black text-white rounded-2xl font-bold text-xl md:text-2xl border-b-[6px] border-gray-800 hover:bg-gray-900 active:border-b-0 active:translate-y-2 transition-all"
            aria-label="Upload photo of emergency"
          >
            <Camera size={32} strokeWidth={2.5} />
            Upload Photo
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
          <div className="relative mt-4 border-4 border-black rounded-xl overflow-hidden shadow-sm w-full">
            <img src={imagePreview} alt="Uploaded emergency" className="w-full h-64 object-cover" />
            <button 
              onClick={() => setImagePreview(null)} 
              className="absolute top-3 right-3 bg-red-600 text-white p-2 font-bold rounded-full shadow-lg border-2 border-white hover:bg-red-700" 
              aria-label="Remove image"
            >
              <X size={24} strokeWidth={3} />
            </button>
          </div>
        )}

        <button 
          onClick={handleSubmit} 
          disabled={status === 'analyzing' || (!inputText && !imagePreview)}
          className="w-full flex justify-center items-center gap-3 py-6 mt-4 bg-red-700 text-white rounded-2xl font-black text-3xl border-b-[8px] border-red-900 hover:bg-red-600 active:border-b-0 active:translate-y-[8px] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider shadow-xl"
          aria-live="polite"
        >
          {status === 'analyzing' ? (
             <span className="animate-pulse">Analyzing...</span>
          ) : (
            <>
              <Megaphone size={40} className="animate-bounce" />
              Get Action Plan
            </>
          )}
        </button>
      </div>
    </section>
  );
}
