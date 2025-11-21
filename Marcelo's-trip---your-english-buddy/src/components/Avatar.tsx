import React, { useEffect, useState } from 'react';
import { AppState } from '../types';

interface AvatarProps {
  state: AppState;
}

export const Avatar: React.FC<AvatarProps> = ({ state }) => {
  const isSpeaking = state === AppState.SPEAKING;
  const isThinking = state === AppState.PROCESSING;
  const isListening = state === AppState.RECORDING;
  const [blink, setBlink] = useState(false);

  // Random blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 4000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-56 h-56 mx-auto transition-all duration-500">
      {/* Aura/Glow Effect */}
      <div className={`absolute inset-0 rounded-full blur-3xl transition-opacity duration-500 scale-110 ${
        isListening ? 'bg-red-500/20 opacity-100 animate-pulse' :
        isThinking ? 'bg-indigo-500/20 opacity-100 animate-pulse' :
        isSpeaking ? 'bg-green-500/20 opacity-100' : 'opacity-0'
      }`}></div>

      {/* --- 3D MARCELO SVG --- */}
      <svg viewBox="0 0 200 200" className={`w-full h-full drop-shadow-2xl animate-float`}>
        <defs>
          {/* Skin: Radial for 3D cheekbones/nose */}
          <radialGradient id="skin-3d" cx="40%" cy="40%" r="60%" fx="40%" fy="40%">
            <stop offset="0%" stopColor="#ffdec7" />
            <stop offset="60%" stopColor="#e2c1a5" />
            <stop offset="100%" stopColor="#cba588" />
          </radialGradient>

          {/* Shirt: Dark Mesh Gradient */}
          <radialGradient id="shirt-3d" cx="30%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#3f3f46" />
            <stop offset="100%" stopColor="#18181b" />
          </radialGradient>

          {/* Hair: Fade Effect Gradient */}
          <linearGradient id="hair-fade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="60%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#333333" />
          </linearGradient>

           {/* Gold Chain: Metallic Shine */}
          <linearGradient id="gold-shine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="40%" stopColor="#fbbf24" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <clipPath id="circle-clip">
             <circle cx="100" cy="100" r="95" />
          </clipPath>
        </defs>
        
        {/* Circle Container Background */}
        <circle cx="100" cy="100" r="98" fill="#ffffff" />
        <circle cx="100" cy="100" r="95" fill="#f8fafc" />
        
        {/* --- AVATAR GROUP --- */}
        <g clipPath="url(#circle-clip)" className="animate-breathe">
            
            {/* SHOULDERS / SHIRT */}
            <g transform="translate(0, 10)">
               <path d="M20 200 L 30 165 Q 60 155 100 155 Q 140 155 170 165 L 180 200 Z" fill="url(#shirt-3d)" />
               {/* Shirt Details (Seams) */}
               <path d="M100 155 L 100 200" stroke="#000" strokeWidth="1" opacity="0.2" />
               <path d="M40 160 Q 50 200 45 200" stroke="#ffffff" strokeWidth="0.5" opacity="0.1" />
               <path d="M160 160 Q 150 200 155 200" stroke="#ffffff" strokeWidth="0.5" opacity="0.1" />
            </g>

            {/* NECK */}
            <path d="M70 130 L 70 160 Q 100 170 130 160 L 130 130" fill="#cba588" />
            {/* Shadow under chin */}
            <path d="M70 130 L 130 130 L 130 150 Q 100 165 70 150 Z" fill="#a6846b" opacity="0.6" />

            {/* GOLD CHAIN */}
            <g transform="translate(0, 5)">
              <path d="M75 155 Q 100 175 125 155" fill="none" stroke="url(#gold-shine)" strokeWidth="4" strokeLinecap="round" />
              <path d="M75 155 Q 100 175 125 155" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="1 3" opacity="0.6" /> 
            </g>

            {/* HEAD GROUP */}
            <g transform="translate(0, -5)">
                
                {/* FACE SHAPE */}
                {/* Strong Jawline, Ears included in shape for seamlessness */}
                <path d="M55 90 Q 52 135 80 155 Q 100 165 120 155 Q 148 135 145 90 Q 145 50 100 50 Q 55 50 55 90" fill="url(#skin-3d)" />

                {/* EARS */}
                {/* Left Ear */}
                <path d="M54 95 Q 45 90 54 80" fill="#dcb696" />
                <path d="M54 95 Q 48 88 54 80" fill="none" stroke="#cba588" strokeWidth="1" />
                {/* Right Ear */}
                <path d="M146 95 Q 155 90 146 80" fill="#dcb696" />
                 <path d="M146 95 Q 152 88 146 80" fill="none" stroke="#cba588" strokeWidth="1" />

                {/* HAIR (The Fade) */}
                {/* Top */}
                <path d="M55 85 Q 55 45 100 45 Q 145 45 145 85 Q 145 65 100 63 Q 55 65 55 85" fill="#1a1a1a" />
                {/* Side Fades */}
                <path d="M55 85 L 55 95 Q 60 95 60 85 Z" fill="url(#hair-fade)" />
                <path d="M145 85 L 145 95 Q 140 95 140 85 Z" fill="url(#hair-fade)" />
                
                {/* BEARD (Groomed) */}
                <path d="M80 135 Q 100 130 120 135 L 120 145 Q 135 130 143 100 L 145 100 Q 138 145 115 160 Q 100 165 85 160 Q 62 145 55 100 L 57 100 Q 65 130 80 145 L 80 135 Z" fill="#262626" opacity="0.95" />

                {/* FACIAL FEATURES */}
                
                {/* Eyebrows */}
                <g fill="#1a1a1a">
                    <path d="M68 88 Q 80 82 92 88 L 90 92 Q 80 86 70 92 Z" />
                    <path d="M108 88 Q 120 82 132 88 L 130 92 Q 120 86 110 92 Z" />
                </g>

                {/* Eyes (3D) */}
                <g transform="translate(0, 0)"> 
                    {/* Left Eye */}
                    <g transform="translate(80, 100)">
                        <path d="M-10 0 Q 0 -6 10 0 Q 0 6 -10 0 Z" fill="#fff" />
                         {blink ? (
                             <path d="M-10 0 Q 0 4 10 0" stroke="#cba588" strokeWidth="3" fill="none" />
                         ) : (
                            <>
                              <circle cx="0" cy="0" r="4.5" fill="#4a3828" /> {/* Iris */}
                              <circle cx="0" cy="0" r="2" fill="#000" />    {/* Pupil */}
                              <circle cx="2" cy="-2" r="1.5" fill="#fff" opacity="0.8" /> {/* Reflection */}
                            </>
                         )}
                    </g>
                    {/* Right Eye */}
                    <g transform="translate(120, 100)">
                        <path d="M-10 0 Q 0 -6 10 0 Q 0 6 -10 0 Z" fill="#fff" />
                         {blink ? (
                             <path d="M-10 0 Q 0 4 10 0" stroke="#cba588" strokeWidth="3" fill="none" />
                         ) : (
                            <>
                              <circle cx="0" cy="0" r="4.5" fill="#4a3828" />
                              <circle cx="0" cy="0" r="2" fill="#000" />
                              <circle cx="2" cy="-2" r="1.5" fill="#fff" opacity="0.8" />
                            </>
                         )}
                    </g>
                </g>

                {/* Nose (Sculpted with shadow) */}
                <path d="M100 95 L 96 120 Q 100 128 104 120 Z" fill="#cba588" opacity="0.4" />
                <path d="M96 120 Q 100 125 104 120" fill="none" stroke="#b08d74" strokeWidth="1.5" strokeLinecap="round" />

                {/* Mouth - Animated */}
                 <g transform="translate(100, 138)">
                 {isSpeaking ? (
                   // Speaking Mouth
                   <path d="M-10 0 Q 0 12 10 0 Q 0 -5 -10 0" fill="#593030" className="animate-talk" />
                 ) : (
                   // Relaxed Smile
                   <g>
                      <path d="M-12 -2 Q 0 8 12 -2" fill="none" stroke="#593030" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M-12 -2 Q 0 8 12 -2" fill="none" stroke="#a66363" strokeWidth="1" opacity="0.5" />
                   </g>
                 )}
                </g>
            </g>

        </g>
      </svg>

      {/* Status Badge */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg border-2 border-white transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
          isListening ? 'bg-red-500 scale-105' :
          isThinking ? 'bg-indigo-500 scale-105' :
          isSpeaking ? 'bg-green-500 scale-105' : 'bg-slate-800'
        }`}>
          <span className={`w-2 h-2 rounded-full bg-white ${isListening || isThinking || isSpeaking ? 'animate-ping' : ''}`}></span>
          {state === AppState.IDLE ? 'Ready' : 
           state === AppState.RECORDING ? 'Listening...' :
           state === AppState.PROCESSING ? 'Thinking...' : 'Speaking...'}
        </span>
      </div>
    </div>
  );
};