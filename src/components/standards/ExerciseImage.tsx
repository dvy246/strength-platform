// src/components/standards/ExerciseImage.tsx
import React from 'react';

interface ExerciseImageProps {
  exerciseId: string;
  className?: string;
}

export const ExerciseImage: React.FC<ExerciseImageProps> = ({ exerciseId, className = '' }) => {
  // Common definitions to render inside the SVG
  const renderDefs = (id: string) => (
    <defs>
      {/* Grid Pattern Background */}
      <pattern id={`grid-${id}`} width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.08" />
      </pattern>
      {/* Primary Glow Filter */}
      <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      {/* Linear Gradient for weights/glowing lines */}
      <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--primary)" />
        <stop offset="100%" stopColor="oklch(0.65 0.24 330)" />
      </linearGradient>
      {/* Directional Arrow Marker */}
      <marker
        id={`arrow-${id}`}
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="4"
        markerHeight="4"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--primary)" />
      </marker>
    </defs>
  );

  switch (exerciseId) {
    case 'bench-press':
      return (
        <svg className={`w-full h-full text-foreground ${className}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          {renderDefs('bench-press')}
          {/* Tech Grid Backdrop */}
          <rect x="5" y="5" width="90" height="90" rx="10" fill="url(#grid-bench-press)" stroke="var(--border)" strokeWidth="1" />
          
          {/* Ambient Glow */}
          <circle cx="50" cy="50" r="22" fill="var(--primary)" opacity="0.04" filter="url(#glow-bench-press)" />

          {/* Bench Frame & Pad */}
          <path d="M 24 85 L 24 74 M 76 85 L 76 74" stroke="#929ca6" strokeWidth="3" strokeLinecap="round" />
          <path d="M 40 85 L 40 50 M 60 85 L 60 50" stroke="#788591" strokeWidth="3" />
          <path d="M 38 52 L 42 52 M 58 52 L 62 52" stroke="#232f3e" strokeWidth="2.5" strokeLinecap="round" /> {/* J-cups */}
          <rect x="18" y="70" width="64" height="4.5" rx="1.5" fill="#ef4444" stroke="#232f3e" strokeWidth="2" /> {/* Red Pad */}

          {/* Lifter Body Silhouette */}
          {/* Head & Hair */}
          <circle cx="71" cy="64.5" r="4.5" fill="#ebb075" stroke="#232f3e" strokeWidth="2" />
          <path d="M 68 61 C 70 60, 74 60, 75 62 L 72 65 Z" fill="#78350f" stroke="#232f3e" strokeWidth="1" />
          {/* Shorts (Grey) */}
          <path d="M 36 70 L 46 70 C 46 70, 46 64, 46 64 C 46 64, 36 64, 36 64 Z" fill="#929ca6" stroke="#232f3e" strokeWidth="2" />
          {/* Torso (Blue Shirt) */}
          <path d="M 46 70 L 66 70 C 66 70, 66 64, 66 64 C 66 64, 46 64, 46 64 Z" fill="#3b82f6" stroke="#232f3e" strokeWidth="2" />
          {/* Legs (Skin & Blue Shoes) */}
          <path d="M 36 70 C 31 72, 29 76, 29 83" fill="none" stroke="#ebb075" strokeWidth="5" strokeLinecap="round" />
          <path d="M 36 70 C 31 72, 29 76, 29 83" fill="none" stroke="#232f3e" strokeWidth="2" strokeLinecap="round" />
          <rect x="25" y="81.5" width="6" height="3.5" rx="1" fill="#3b82f6" stroke="#232f3e" strokeWidth="1.5" />
          <line x1="25" y1="85" x2="31" y2="85" stroke="#ffffff" strokeWidth="1" />
          {/* Arms holding the barbell */}
          <path d="M 61 65 L 53 58 L 53 48" fill="none" stroke="#ebb075" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 61 65 L 53 58 L 53 48" fill="none" stroke="#232f3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Target Muscles Glowing Overlay */}
          <path d="M 58 64 C 60 63, 62 63, 64 64" stroke="url(#grad-bench-press)" strokeWidth="6" strokeLinecap="round" fill="none" filter="url(#glow-bench-press)" />
          <line x1="60" y1="67" x2="50" y2="58" stroke="url(#grad-bench-press)" strokeWidth="5.5" strokeLinecap="round" filter="url(#glow-bench-press)" />

          {/* Barbell & Plates */}
          <line x1="15" y1="48" x2="85" y2="48" stroke="#232f3e" strokeWidth="3" strokeLinecap="round" />
          {/* Concentric Bumper Plates */}
          <circle cx="23" cy="48" r="11" fill="#929ca6" stroke="#232f3e" strokeWidth="2" />
          <circle cx="23" cy="48" r="7" fill="#788591" stroke="#232f3e" strokeWidth="1.5" />
          <circle cx="23" cy="48" r="3" fill="#232f3e" />

          <circle cx="77" cy="48" r="11" fill="#929ca6" stroke="#232f3e" strokeWidth="2" />
          <circle cx="77" cy="48" r="7" fill="#788591" stroke="#232f3e" strokeWidth="1.5" />
          <circle cx="77" cy="48" r="3" fill="#232f3e" />

          {/* Biomechanical Analysis Overlays */}
          <line x1="50" y1="20" x2="50" y2="50" stroke="var(--primary)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
          <line x1="50" y1="44" x2="50" y2="34" stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#arrow-bench-press)" />
          
          {/* Joint Markers */}
          <circle cx="61" cy="65" r="1.5" fill="var(--background)" stroke="currentColor" strokeWidth="1" />
          <circle cx="53" cy="58" r="1.5" fill="var(--background)" stroke="currentColor" strokeWidth="1" />
        </svg>
      );

    case 'squat':
      return (
        <svg className={`w-full h-full text-foreground ${className}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          {renderDefs('squat')}
          {/* Tech Grid Backdrop */}
          <rect x="5" y="5" width="90" height="90" rx="10" fill="url(#grid-squat)" stroke="var(--border)" strokeWidth="1" />
          
          {/* Ambient Glow */}
          <circle cx="50" cy="50" r="22" fill="var(--primary)" opacity="0.04" filter="url(#glow-squat)" />

          {/* Barbell Bar (bent slightly under load) */}
          <path d="M 10 32 Q 50 35 90 32" stroke="#232f3e" strokeWidth="3" strokeLinecap="round" />

          {/* Left Plates (slanted grey blocks) */}
          <g transform="rotate(-5 20 33.5)" stroke="#232f3e" strokeWidth="2" strokeLinejoin="round">
            <rect x="20" y="17.5" width="4.5" height="32" fill="#929ca6" rx="1" />
            <rect x="14" y="20.5" width="4.5" height="26" fill="#929ca6" rx="1" />
            <rect x="24.5" y="31.5" width="2" height="4" fill="#232f3e" rx="0.5" />
          </g>

          {/* Right Plates (slanted grey blocks) */}
          <g transform="rotate(5 80 33.5)" stroke="#232f3e" strokeWidth="2" strokeLinejoin="round">
            <rect x="75.5" y="17.5" width="4.5" height="32" fill="#929ca6" rx="1" />
            <rect x="81.5" y="20.5" width="4.5" height="26" fill="#929ca6" rx="1" />
            <rect x="73.5" y="31.5" width="2" height="4" fill="#232f3e" rx="0.5" />
          </g>

          {/* Lifter Body */}
          {/* Head */}
          <circle cx="50" cy="22" r="5" fill="#ebb075" stroke="#232f3e" strokeWidth="2" />

          {/* Muscular Torso */}
          <path d="M 44 29 C 44 29, 56 29, 56 29 C 61 32, 65 34, 65 36 C 64 42, 62 48, 61 53 L 39 53 C 38 48, 36 42, 35 36 C 35 34, 39 32, 44 29 Z" fill="#ebb075" stroke="#232f3e" strokeWidth="2" strokeLinejoin="round" />

          {/* Arms holding the bar */}
          <path d="M 35 36 L 26 43 L 29 32" fill="none" stroke="#ebb075" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 35 36 L 26 43 L 29 32" fill="none" stroke="#232f3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          
          <path d="M 65 36 L 74 43 L 71 32" fill="none" stroke="#ebb075" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 65 36 L 74 43 L 71 32" fill="none" stroke="#232f3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Blue Shorts */}
          <path d="M 39 53 L 61 53 L 64 61 L 53 62 L 50 58 L 47 62 L 36 61 Z" fill="#5fb3ff" stroke="#232f3e" strokeWidth="2.5" strokeLinejoin="round" />

          {/* Legs splayed wide in deep squat */}
          <path d="M 41 58 L 28 67 L 34 79" fill="none" stroke="#ebb075" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 41 58 L 28 67 L 34 79" fill="none" stroke="#232f3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          <path d="M 59 58 L 72 67 L 66 79" fill="none" stroke="#ebb075" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 59 58 L 72 67 L 66 79" fill="none" stroke="#232f3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Shoes (pink/red) */}
          <path d="M 34 79 L 27 82 L 30 85 L 36 84 Z" fill="#ff6980" stroke="#232f3e" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 66 79 L 73 82 L 70 85 L 64 84 Z" fill="#ff6980" stroke="#232f3e" strokeWidth="2" strokeLinejoin="round" />

          {/* Target Muscles Glowing Overlay (Quads) */}
          <path d="M 41 58 L 28 67" stroke="url(#grad-squat)" strokeWidth="6.5" strokeLinecap="round" filter="url(#glow-squat)" />
          <path d="M 59 58 L 72 67" stroke="url(#grad-squat)" strokeWidth="6.5" strokeLinecap="round" filter="url(#glow-squat)" />

          {/* Biomechanical Analysis Overlays */}
          <line x1="50" y1="12" x2="50" y2="85" stroke="var(--primary)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
          <line x1="18" y1="67" x2="82" y2="67" stroke="var(--primary)" strokeWidth="0.8" strokeDasharray="5 5" opacity="0.4" />
          <line x1="50" y1="48" x2="50" y2="39" stroke="oklch(0.65 0.24 330)" strokeWidth="1.5" markerEnd="url(#arrow-squat)" />

          {/* Joint Markers */}
          <circle cx="28" cy="67" r="1.5" fill="var(--background)" stroke="currentColor" strokeWidth="1" />
          <circle cx="72" cy="67" r="1.5" fill="var(--background)" stroke="currentColor" strokeWidth="1" />
        </svg>
      );

    case 'deadlift':
      return (
        <svg className={`w-full h-full text-foreground ${className}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          {renderDefs('deadlift')}
          {/* Tech Grid Backdrop */}
          <rect x="5" y="5" width="90" height="90" rx="10" fill="url(#grid-deadlift)" stroke="var(--border)" strokeWidth="1" />
          
          {/* Ambient Glow */}
          <circle cx="50" cy="55" r="22" fill="var(--primary)" opacity="0.04" filter="url(#glow-deadlift)" />

          {/* Floor Line */}
          <line x1="10" y1="83.5" x2="90" y2="83.5" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" />

          {/* Lifter Body Silhouette (Solid Charcoal Silhouette matching logo) */}
          <circle cx="56" cy="27" r="4.5" fill="#232f3e" />
          <path d="M 53 34 L 34 52" stroke="#232f3e" strokeWidth="8.5" strokeLinecap="round" />
          <path d="M 34 52 L 44 70" stroke="#232f3e" strokeWidth="8.5" strokeLinecap="round" />
          <path d="M 44 70 L 42 82" stroke="#232f3e" strokeWidth="7.5" strokeLinecap="round" />
          <path d="M 42 82 L 52 82" stroke="#232f3e" strokeWidth="6" strokeLinecap="round" />
          <path d="M 53 34 L 53 70" stroke="#232f3e" strokeWidth="6" strokeLinecap="round" />

          {/* Target Muscles Glowing Overlay */}
          <path d="M 44 70 C 36 66, 33 58, 34 52" stroke="url(#grad-deadlift)" strokeWidth="8.5" strokeLinecap="round" fill="none" filter="url(#glow-deadlift)" />
          <line x1="34" y1="52" x2="53" y2="34" stroke="url(#grad-deadlift)" strokeWidth="8.5" strokeLinecap="round" filter="url(#glow-deadlift)" />

          {/* Barbell & Plates */}
          <line x1="15" y1="70" x2="85" y2="70" stroke="#232f3e" strokeWidth="3.5" strokeLinecap="round" />
          {/* Large Concentric Bumper Plate centered at x=53, y=70 */}
          <circle cx="53" cy="70" r="13" fill="#929ca6" stroke="#232f3e" strokeWidth="2" />
          <circle cx="53" cy="70" r="8" fill="#788591" stroke="#232f3e" strokeWidth="1.5" />
          <circle cx="53" cy="70" r="3" fill="#232f3e" />

          {/* Biomechanical Analysis Overlays */}
          <line x1="34" y1="52" x2="53" y2="34" stroke="oklch(0.65 0.24 330)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
          <line x1="53" y1="70" x2="53" y2="54" stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#arrow-deadlift)" />

          {/* Joint Markers */}
          <circle cx="42" cy="82" r="1.5" fill="var(--background)" stroke="currentColor" strokeWidth="1" />
          <circle cx="44" cy="70" r="1.5" fill="var(--background)" stroke="currentColor" strokeWidth="1" />
          <circle cx="34" cy="52" r="1.5" fill="var(--background)" stroke="currentColor" strokeWidth="1" />
          <circle cx="53" cy="34" r="1.5" fill="var(--background)" stroke="currentColor" strokeWidth="1" />
        </svg>
      );

    case 'overhead-press':
      return (
        <svg className={`w-full h-full text-foreground ${className}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          {renderDefs('overhead-press')}
          {/* Tech Grid Backdrop */}
          <rect x="5" y="5" width="90" height="90" rx="10" fill="url(#grid-overhead-press)" stroke="var(--border)" strokeWidth="1" />
          
          {/* Ambient Glow */}
          <circle cx="50" cy="35" r="22" fill="var(--primary)" opacity="0.04" filter="url(#glow-overhead-press)" />

          {/* Floor */}
          <line x1="10" y1="85" x2="90" y2="85" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" />

          {/* Standing Lifter (Symmetrical standing front-view lockout) */}
          <circle cx="50" cy="27" r="4.5" fill="#ebb075" stroke="#232f3e" strokeWidth="2" />
          <path d="M 43 35 L 57 35 L 55 52 L 45 52 Z" fill="#f97316" stroke="#232f3e" strokeWidth="2.5" />
          <path d="M 45 52 L 55 52 L 56 61 L 44 61 Z" fill="#929ca6" stroke="#232f3e" strokeWidth="2" />
          {/* Legs standing straight */}
          <path d="M 47 61 L 47 82" fill="none" stroke="#ebb075" strokeWidth="6" strokeLinecap="round" />
          <path d="M 47 61 L 47 82" fill="none" stroke="#232f3e" strokeWidth="2" strokeLinecap="round" />
          <path d="M 53 61 L 53 82" fill="none" stroke="#ebb075" strokeWidth="6" strokeLinecap="round" />
          <path d="M 53 61 L 53 82" fill="none" stroke="#232f3e" strokeWidth="2" strokeLinecap="round" />
          {/* Shoes */}
          <rect x="43.5" y="81.5" width="7" height="3.5" rx="1" fill="#3b82f6" stroke="#232f3e" strokeWidth="1.5" />
          <rect x="49.5" y="81.5" width="7" height="3.5" rx="1" fill="#3b82f6" stroke="#232f3e" strokeWidth="1.5" />
          {/* Arms locked overhead */}
          <path d="M 43 37 L 38 20" fill="none" stroke="#ebb075" strokeWidth="5" strokeLinecap="round" />
          <path d="M 43 37 L 38 20" fill="none" stroke="#232f3e" strokeWidth="2" strokeLinecap="round" />
          <path d="M 57 37 L 62 20" fill="none" stroke="#ebb075" strokeWidth="5" strokeLinecap="round" />
          <path d="M 57 37 L 62 20" fill="none" stroke="#232f3e" strokeWidth="2" strokeLinecap="round" />

          {/* Target Muscles Glowing Overlay (Shoulders) */}
          <circle cx="38" cy="37" r="4.5" fill="none" stroke="url(#grad-overhead-press)" strokeWidth="4" filter="url(#glow-overhead-press)" />
          <circle cx="62" cy="37" r="4.5" fill="none" stroke="url(#grad-overhead-press)" strokeWidth="4" filter="url(#glow-overhead-press)" />

          {/* Barbell & Plates overhead */}
          <line x1="15" y1="20" x2="85" y2="20" stroke="#232f3e" strokeWidth="3.5" strokeLinecap="round" />
          {/* Plates */}
          <rect x="22" y="8" width="4.5" height="24" rx="1" fill="#929ca6" stroke="#232f3e" strokeWidth="2" />
          <rect x="16" y="11" width="4.5" height="18" rx="1" fill="#929ca6" stroke="#232f3e" strokeWidth="2" />
          <rect x="73.5" y="8" width="4.5" height="24" rx="1" fill="#929ca6" stroke="#232f3e" strokeWidth="2" />
          <rect x="79.5" y="11" width="4.5" height="18" rx="1" fill="#929ca6" stroke="#232f3e" strokeWidth="2" />

          {/* Biomechanical Analysis Overlays */}
          <line x1="50" y1="10" x2="50" y2="85" stroke="var(--primary)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
          <line x1="50" y1="17" x2="50" y2="9" stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#arrow-overhead-press)" />

          {/* Joint Markers */}
          <circle cx="43" cy="37" r="1.5" fill="var(--background)" stroke="currentColor" strokeWidth="1" />
          <circle cx="57" cy="37" r="1.5" fill="var(--background)" stroke="currentColor" strokeWidth="1" />
        </svg>
      );

    case 'pull-up':
      return (
        <svg className={`w-full h-full text-foreground ${className}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          {renderDefs('pull-up')}
          {/* Tech Grid Backdrop */}
          <rect x="5" y="5" width="90" height="90" rx="10" fill="url(#grid-pull-up)" stroke="var(--border)" strokeWidth="1" />
          
          {/* Ambient Glow */}
          <circle cx="50" cy="35" r="22" fill="var(--primary)" opacity="0.04" filter="url(#glow-pull-up)" />

          {/* Pull Up Rig */}
          <path d="M 20 85 L 20 28 M 80 85 L 80 28" stroke="#232f3e" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="12" y1="28" x2="88" y2="28" stroke="#232f3e" strokeWidth="4" strokeLinecap="round" />

          {/* Lifter Body Silhouette */}
          {/* Head */}
          <circle cx="50" cy="22" r="4.5" fill="#ebb075" stroke="#232f3e" strokeWidth="2" />
          {/* Torso (Orange Shirt / V-Taper) */}
          <path d="M 43 32 C 43 32, 57 32, 57 32 C 55 42, 53 48, 52 50 L 48 50 C 47 48, 45 42, 43 32 Z" fill="#f97316" stroke="#232f3e" strokeWidth="2" strokeLinejoin="round" />
          {/* Shorts (Grey) */}
          <path d="M 47 50 L 53 50 L 54 59 L 46 59 Z" fill="#929ca6" stroke="#232f3e" strokeWidth="2" />
          {/* Arms holding bar */}
          <path d="M 43 32 L 34 38 L 38 28" fill="none" stroke="#ebb075" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 43 32 L 34 38 L 38 28" fill="none" stroke="#232f3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 57 32 L 66 38 L 62 28" fill="none" stroke="#ebb075" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 57 32 L 66 38 L 62 28" fill="none" stroke="#232f3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Legs hanging, knees bent */}
          <path d="M 47 59 L 45 73 L 48 81" fill="none" stroke="#ebb075" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 47 59 L 45 73 L 48 81" fill="none" stroke="#232f3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 53 59 L 55 73 L 52 81" fill="none" stroke="#ebb075" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 53 59 L 55 73 L 52 81" fill="none" stroke="#232f3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Target Muscles Glowing Overlay (Lats) */}
          <path d="M 43 32 C 44 38, 46 44, 47 50" stroke="url(#grad-pull-up)" strokeWidth="6.5" strokeLinecap="round" fill="none" filter="url(#glow-pull-up)" />
          <path d="M 57 32 C 56 38, 54 44, 53 50" stroke="url(#grad-pull-up)" strokeWidth="6.5" strokeLinecap="round" fill="none" filter="url(#glow-pull-up)" />

          {/* Biomechanical Analysis Overlays */}
          <line x1="25" y1="28" x2="75" y2="28" stroke="oklch(0.65 0.24 330)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
          <line x1="50" y1="28" x2="50" y2="22.5" stroke="var(--primary)" strokeWidth="1.2" markerEnd="url(#arrow-pull-up)" />

          {/* Joint Markers */}
          <circle cx="34" cy="38" r="1.5" fill="var(--background)" stroke="currentColor" strokeWidth="1" />
          <circle cx="66" cy="38" r="1.5" fill="var(--background)" stroke="currentColor" strokeWidth="1" />
        </svg>
      );

    case 'dips':
      return (
        <svg className={`w-full h-full text-foreground ${className}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          {renderDefs('dips')}
          {/* Tech Grid Backdrop */}
          <rect x="5" y="5" width="90" height="90" rx="10" fill="url(#grid-dips)" stroke="var(--border)" strokeWidth="1" />
          
          {/* Ambient Glow */}
          <circle cx="50" cy="50" r="22" fill="var(--primary)" opacity="0.04" filter="url(#glow-dips)" />

          {/* Dip Station Frame */}
          <path d="M 25 85 L 25 54 L 40 54 M 75 85 L 75 54 L 60 54" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="35" y1="54" x2="65" y2="54" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />

          {/* Lifter Body Silhouette */}
          {/* Head */}
          <circle cx="37" cy="32" r="4.5" fill="#ebb075" stroke="#232f3e" strokeWidth="2" />
          {/* Torso (Teal shirt, leaning forward) */}
          <path d="M 37 38 L 47 54 L 53 50 L 43 34 Z" fill="#10b981" stroke="#232f3e" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Legs (Blue pants, bent backwards) */}
          <path d="M 47 54 L 53 50 L 45 66 L 39 63 Z" fill="#3b82f6" stroke="#232f3e" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 42 64 L 52 72" fill="none" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
          <path d="M 42 64 L 52 72" fill="none" stroke="#232f3e" strokeWidth="2" strokeLinecap="round" />
          {/* Red Shoes */}
          <path d="M 52 72 L 56 75 L 53 77 Z" fill="#ef4444" stroke="#232f3e" strokeWidth="2" strokeLinejoin="round" />
          {/* Arms holding parallel bars */}
          <path d="M 40 36 L 48 44 L 48 54" fill="none" stroke="#ebb075" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 40 36 L 48 44 L 48 54" fill="none" stroke="#232f3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Target Muscles Glowing Overlay (Chest/Triceps) */}
          <path d="M 37 38 C 40 43, 44 47, 47 50" stroke="url(#grad-dips)" strokeWidth="7" strokeLinecap="round" fill="none" filter="url(#glow-dips)" />
          <line x1="40" y1="36" x2="48" y2="44" stroke="url(#grad-dips)" strokeWidth="7" strokeLinecap="round" filter="url(#glow-dips)" />

          {/* Biomechanical Analysis Overlays */}
          <line x1="48" y1="54" x2="48" y2="42" stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#arrow-dips)" />

          {/* Joint Markers */}
          <circle cx="48" cy="44" r="1.5" fill="var(--background)" stroke="currentColor" strokeWidth="1" />
          <circle cx="40" cy="36" r="1.5" fill="var(--background)" stroke="currentColor" strokeWidth="1" />
        </svg>
      );

    case 'dumbbell-bench-press':
      return (
        <svg className={`w-full h-full text-foreground ${className}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          {renderDefs('dumbbell-bench-press')}
          <rect x="5" y="5" width="90" height="90" rx="10" fill="url(#grid-dumbbell-bench-press)" stroke="var(--border)" strokeWidth="1" />
          <circle cx="50" cy="50" r="22" fill="var(--primary)" opacity="0.04" filter="url(#glow-dumbbell-bench-press)" />
          {/* Bench Frame & Pad */}
          <path d="M 24 85 L 24 74 M 76 85 L 76 74" stroke="#929ca6" strokeWidth="3" strokeLinecap="round" />
          <rect x="18" y="70" width="64" height="4.5" rx="1.5" fill="#10b981" stroke="#232f3e" strokeWidth="2" /> {/* Pad */}
          {/* Dumbbell 1 */}
          <line x1="22" y1="46" x2="38" y2="46" stroke="#232f3e" strokeWidth="3" strokeLinecap="round" />
          <rect x="18" y="38" width="4" height="16" rx="1" fill="#929ca6" stroke="#232f3e" strokeWidth="1.5" />
          <rect x="38" y="38" width="4" height="16" rx="1" fill="#929ca6" stroke="#232f3e" strokeWidth="1.5" />
          {/* Dumbbell 2 */}
          <line x1="62" y1="46" x2="78" y2="46" stroke="#232f3e" strokeWidth="3" strokeLinecap="round" />
          <rect x="58" y="38" width="4" height="16" rx="1" fill="#929ca6" stroke="#232f3e" strokeWidth="1.5" />
          <rect x="78" y="38" width="4" height="16" rx="1" fill="#929ca6" stroke="#232f3e" strokeWidth="1.5" />
          {/* Target Muscles Glowing Overlay */}
          <path d="M 45 64 C 47 62, 53 62, 55 64" stroke="url(#grad-dumbbell-bench-press)" strokeWidth="6" strokeLinecap="round" fill="none" filter="url(#glow-dumbbell-bench-press)" />
        </svg>
      );

    case 'incline-bench-press':
      return (
        <svg className={`w-full h-full text-foreground ${className}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          {renderDefs('incline-bench-press')}
          <rect x="5" y="5" width="90" height="90" rx="10" fill="url(#grid-incline-bench-press)" stroke="var(--border)" strokeWidth="1" />
          <circle cx="50" cy="50" r="22" fill="var(--primary)" opacity="0.04" filter="url(#glow-incline-bench-press)" />
          {/* Incline Bench Pad (30 degrees) */}
          <path d="M 28 85 L 28 75 M 50 85 L 50 60" stroke="#788591" strokeWidth="3" />
          <line x1="20" y1="78" x2="75" y2="46" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" /> {/* Red Incline Pad */}
          {/* Barbell & Plates */}
          <line x1="25" y1="36" x2="75" y2="36" stroke="#232f3e" strokeWidth="3" strokeLinecap="round" />
          <circle cx="31" cy="36" r="10" fill="#929ca6" stroke="#232f3e" strokeWidth="1.5" />
          <circle cx="69" cy="36" r="10" fill="#929ca6" stroke="#232f3e" strokeWidth="1.5" />
          {/* Target Muscles Glowing Overlay */}
          <path d="M 40 50 C 44 46, 50 46, 54 50" stroke="url(#grad-incline-bench-press)" strokeWidth="6" strokeLinecap="round" fill="none" filter="url(#glow-incline-bench-press)" />
        </svg>
      );

    case 'incline-dumbbell-press':
      return (
        <svg className={`w-full h-full text-foreground ${className}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          {renderDefs('incline-dumbbell-press')}
          <rect x="5" y="5" width="90" height="90" rx="10" fill="url(#grid-incline-dumbbell-press)" stroke="var(--border)" strokeWidth="1" />
          <circle cx="50" cy="50" r="22" fill="var(--primary)" opacity="0.04" filter="url(#glow-incline-dumbbell-press)" />
          {/* Incline Bench Pad (30 degrees) */}
          <path d="M 28 85 L 28 75 M 50 85 L 50 60" stroke="#788591" strokeWidth="3" />
          <line x1="20" y1="78" x2="75" y2="46" stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" /> {/* Incline Pad */}
          {/* Dumbbell 1 */}
          <line x1="22" y1="38" x2="38" y2="38" stroke="#232f3e" strokeWidth="3" strokeLinecap="round" />
          <rect x="18" y="30" width="4" height="16" rx="1" fill="#929ca6" stroke="#232f3e" strokeWidth="1.5" />
          <rect x="38" y="30" width="4" height="16" rx="1" fill="#929ca6" stroke="#232f3e" strokeWidth="1.5" />
          {/* Dumbbell 2 */}
          <line x1="62" y1="38" x2="78" y2="38" stroke="#232f3e" strokeWidth="3" strokeLinecap="round" />
          <rect x="58" y="30" width="4" height="16" rx="1" fill="#929ca6" stroke="#232f3e" strokeWidth="1.5" />
          <rect x="78" y="30" width="4" height="16" rx="1" fill="#929ca6" stroke="#232f3e" strokeWidth="1.5" />
          {/* Target Muscles Glowing Overlay */}
          <path d="M 40 50 C 44 46, 50 46, 54 50" stroke="url(#grad-incline-dumbbell-press)" strokeWidth="6" strokeLinecap="round" fill="none" filter="url(#glow-incline-dumbbell-press)" />
        </svg>
      );

    default:
      return null;
  }
};
