// src/components/data-viz/StrengthCard.tsx
import React, { useState } from 'react';
import { type StrengthIndexResult } from '@/lib/calculations/strength-index';
import { getLevelLabel } from '@/lib/calculations/percentiles';

interface StrengthCardProps {
  result: StrengthIndexResult;
  gender: 'male' | 'female';
  bodyweight: number;
  unit: 'kg' | 'lb';
}

export const StrengthCard: React.FC<StrengthCardProps> = ({
  result,
  gender,
  bodyweight,
  unit
}) => {
  const { score, level, breakdown, archetype } = result;
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const textSummary = `🏆 My Strength Index is ${score} (${getLevelLabel(level)})!\n🧠 Athlete Archetype: ${archetype}\n💪 Lifts:\n${breakdown
      .map((b) => `• ${b.exerciseName}: ${Math.round(b.oneRepMax)}${unit}`)
      .join('\n')}\n\nCheck your strength standards at:`;
    
    const shareUrl = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Strength Index Profile',
          text: textSummary,
          url: shareUrl
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${textSummary} ${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  };

  // Get level theme color class
  const getLevelColorClass = (lvl: string) => {
    switch (lvl) {
      case 'beginner': return 'from-blue-400 to-cyan-500 text-cyan-400';
      case 'novice': return 'from-emerald-400 to-teal-500 text-teal-400';
      case 'intermediate': return 'from-amber-400 to-orange-500 text-amber-400';
      case 'advanced': return 'from-rose-400 to-pink-500 text-rose-400';
      case 'elite': return 'from-violet-500 to-fuchsia-600 text-fuchsia-400';
      default: return 'from-primary to-purple-500 text-primary';
    }
  };

  return (
    <div className="space-y-4">
      {/* Visual Share Card */}
      <div 
        id="strength-share-card"
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-6 md:p-8 shadow-2xl text-white select-none transition-transform duration-300 hover:scale-[1.01]"
      >
        {/* Dynamic ambient background glow matching classification */}
        <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-full blur-[80px] opacity-25 bg-gradient-to-br ${getLevelColorClass(level)}`} />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full blur-[80px] opacity-10 bg-primary" />

        {/* Diagonal mesh line texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Card Header */}
        <div className="relative flex justify-between items-start border-b border-white/10 pb-5">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Lifting Certificate</span>
            <h3 className="text-sm font-extrabold tracking-tight mt-0.5 text-white/95">STRENGTH STANDARDS</h3>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-wider block">ID PATTERN</span>
            <span className="text-[10px] font-mono font-extrabold text-white/70">#{Math.abs(score * 10).toString(16).toUpperCase()}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="relative py-6 flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-0">
          
          {/* Large score representation */}
          <div className="w-full md:w-auto md:min-w-[135px] flex-shrink-0 flex flex-col items-center md:items-start justify-center space-y-2 md:pr-4">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Strength Index</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl md:text-5xl font-black font-mono tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-white/60">
                {score.toFixed(1)}
              </span>
              <span className="text-xs font-black text-primary font-mono opacity-85">PTS</span>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-extrabold capitalize mt-1">
              <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${getLevelColorClass(level)}`} />
              {getLevelLabel(level)}
            </div>
          </div>

          {/* Archetype & Core Lifts list */}
          <div className="flex-1 w-full space-y-4 border-t md:border-t-0 md:border-l border-white/10 pt-5 md:pt-0 md:pl-4 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider block">Athlete Archetype</span>
              <h4 className="text-sm md:text-base font-extrabold text-white/95 leading-tight mt-0.5">{archetype || 'Hybrid Lifter'}</h4>
              <p className="text-[10px] text-white/60 leading-relaxed mt-1">
                Certified {gender} athlete at {bodyweight}{unit} bodyweight.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider block">Recorded Lifts (1RM)</span>
              <div className="space-y-1.5 text-xs font-mono">
                {breakdown.slice(0, 4).map((b) => (
                  <div key={b.exerciseId} className="flex justify-between items-center border-b border-white/[0.04] pb-1">
                    <span className="text-white/60 font-sans font-medium text-[10px] flex items-center gap-1.5 min-w-0">
                      <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${getLevelColorClass(b.exerciseLevel)} opacity-60 shrink-0`} />
                      <span className="truncate tracking-tight" title={b.exerciseName}>{b.exerciseName}</span>
                    </span>
                    <span className="font-extrabold text-white/95 font-mono shrink-0 ml-2">
                      {Math.round(b.oneRepMax)} {unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Card Footer */}
        <div className="relative flex justify-between items-center border-t border-white/10 pt-5 text-[10px] text-white/40 font-semibold uppercase tracking-wider">
          <span>Verifiable Standards</span>
          <span className="font-sans font-black text-white/30 tracking-tight">STRENGTHCHECKER.COM</span>
        </div>
      </div>

      {/* Share / Copy Action Button */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 text-xs font-bold transition-all shadow-md hover:shadow-primary/20 active:scale-[0.98] cursor-pointer"
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l5.064-2.532m0 5.606l-5.064-2.532m6.517-3.722a3 3 0 11-6 0 3 3 0 016 0zm-8.86 5.61a3 3 0 11-6 0 3 3 0 016 0zm8.86 5.61a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{copied ? 'Copied to Clipboard!' : 'Share Lifting Card'}</span>
        </button>
      </div>
    </div>
  );
};
