
import React from 'react';
import { TranslationResult } from '../types';
import { Volume2 } from 'lucide-react';

interface Props {
  data: TranslationResult;
  onPlay: () => void;
  isPlaying: boolean;
}

export const TranslationCard: React.FC<Props> = ({ data, onPlay, isPlaying }) => {
  return (
    <div className="w-full max-w-md mx-auto mt-6 space-y-4">
      {/* Input */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
        <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">
          You said ({data.sourceLanguage})
        </p>
        <p className="text-xl text-slate-800 font-medium">{data.sourceText}</p>
      </div>

      {/* Output */}
      <div className="bg-indigo-600 p-5 rounded-2xl shadow-lg text-white relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
        
        <div className="flex justify-between items-start mb-2 relative z-10">
          <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
            Translation ({data.targetLanguage})
          </p>
          <button 
            onClick={onPlay}
            className={`p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm ${isPlaying ? 'animate-pulse text-yellow-300 ring-2 ring-yellow-300/50' : 'text-white'}`}
            title="Listen"
          >
            <Volume2 size={20} />
          </button>
        </div>
        
        {/* Main Translation Text */}
        <p className="text-2xl font-bold leading-relaxed mb-1 relative z-10">{data.translatedText}</p>
        
        {/* Phonetic Guide (For Thai) */}
        {data.phonetic && (
          <div className="mt-3 pt-3 border-t border-indigo-500/30 relative z-10">
             <p className="text-xs text-indigo-300 uppercase font-bold mb-0.5 tracking-wide">Pronunciation</p>
             <p className="text-lg font-serif italic text-indigo-100">"{data.phonetic}"</p>
          </div>
        )}
      </div>

      {/* Marcelo's Tip */}
      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 shadow-sm flex items-start gap-3 mt-4 transform transition-all duration-500 translate-y-0 opacity-100">
        <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 shadow-sm">
            💡
        </div>
        <div>
            <p className="text-xs font-bold text-yellow-700 uppercase mb-1 tracking-wider">Marcelo's Tip</p>
            <p className="text-sm text-slate-700 italic leading-relaxed">"{data.tip}"</p>
        </div>
      </div>
    </div>
  );
};
