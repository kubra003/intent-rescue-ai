import { create } from 'zustand';
import { EmergencyResponse } from '../types/emergency';

interface EmergencyState {
  inputText: string;
  imagePreview: string | null;
  status: 'idle' | 'analyzing' | 'success' | 'error';
  result: EmergencyResponse | null;
  setInputText: (text: string | ((prev: string) => string)) => void;
  setImagePreview: (url: string | null) => void;
  submitEmergency: (payload: { text: string; imageBase64?: string }) => Promise<void>;
  reset: () => void;
}

export const useEmergencyStore = create<EmergencyState>((set) => ({
  inputText: '',
  imagePreview: null,
  status: 'idle',
  result: null,

  setInputText: (val) => set((state) => ({ 
    inputText: typeof val === 'function' ? val(state.inputText) : val 
  })),
  setImagePreview: (url) => set({ imagePreview: url }),

  submitEmergency: async (payload) => {
    set({ status: 'analyzing', result: null });
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze emergency.');
      }

      const data: EmergencyResponse = await response.json();
      set({ status: 'success', result: data });
    } catch (error) {
      console.error(error);
      set({ status: 'error' });
    }
  },

  reset: () => set({ inputText: '', imagePreview: null, status: 'idle', result: null }),
}));
