// src/components/data-viz/DistributionCurve.tsx
import React from 'react';
import { normalCDF } from '@/lib/calculations/percentiles';

interface DistributionCurveProps {
  percentile: number; // 0–100
  label?: string;
  className?: string;
}

export const DistributionCurve: React.FC<DistributionCurveProps> = ({
  percentile,
  label = 'Strength Distribution',
  className = '',
}) => {
  const p = Math.max(0.001, Math.min(0.999, percentile / 100));
  
  // Standard normal distribution math
  // We want to map z from -3 to +3
  const zMin = -3.2;
  const zMax = 3.2;
  
  // Find the z-score for this percentile
  // (Using simple binary search for inverse normal CDF)
  const findZ = (pVal: number) => {
    let low = zMin;
    let high = zMax;
    for (let i = 0; i < 20; i++) {
      const mid = (low + high) / 2;
      if (normalCDF(mid) < pVal) {
        low = mid;
      } else {
        high = mid;
      }
    }
    return (low + high) / 2;
  };
  
  const userZ = findZ(p);
  
  // SVG Dimensions
  const width = 300;
  const height = 100;
  const padding = 10;
  
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  // Normal PDF formula
  const pdf = (z: number) => {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
  };
  
  // Max value of PDF is at z=0, which is 1/sqrt(2*pi) ≈ 0.3989
  const maxPdf = 0.3989;
  
  // Map z-score to SVG X coordinate
  const zToX = (z: number) => {
    const ratio = (z - zMin) / (zMax - zMin);
    return padding + ratio * chartWidth;
  };
  
  // Map PDF value to SVG Y coordinate
  const pdfToY = (yVal: number) => {
    const ratio = yVal / maxPdf;
    return height - padding - ratio * chartHeight;
  };
  
  // Generate curve path points (100 divisions)
  const numDivisions = 80;
  const curvePoints = [];
  for (let i = 0; i <= numDivisions; i++) {
    const z = zMin + (i / numDivisions) * (zMax - zMin);
    const x = zToX(z);
    const y = pdfToY(pdf(z));
    curvePoints.push({ x, y, z });
  }
  
  // Build the SVG path for the line
  const dPath = curvePoints
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(' ');
  
  // Build the SVG path for the filled shaded area (up to the user's z-score)
  const shadedPoints = curvePoints.filter((pt) => pt.z <= userZ);
  
  // If the user's z-score falls in between points, add an exact end point
  const userX = zToX(userZ);
  const userY = pdfToY(pdf(userZ));
  shadedPoints.push({ x: userX, y: userY, z: userZ });
  
  let dShaded = '';
  if (shadedPoints.length > 0) {
    const firstX = shadedPoints[0].x;
    const lastX = shadedPoints[shadedPoints.length - 1].x;
    dShaded = [
      `M ${firstX.toFixed(1)} ${(height - padding).toFixed(1)}`,
      ...shadedPoints.map((pt) => `L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`),
      `L ${lastX.toFixed(1)} ${(height - padding).toFixed(1)}`,
      'Z',
    ].join(' ');
  }

  return (
    <div className={`w-full p-4 border border-border rounded-xl bg-card shadow-sm ${className}`}>
      <div className="flex items-center justify-between text-sm mb-4">
        <span className="font-semibold text-muted-foreground">{label}</span>
        <span className="font-mono text-xs text-primary font-bold">
          Z-Score: {userZ.toFixed(2)}
        </span>
      </div>

      <div className="relative w-full">
        <svg className="w-full h-auto" viewBox={`0 0 ${width} ${height}`}>
          {/* Gradients */}
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Reference baseline */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="var(--border)"
            strokeWidth="1.5"
          />

          {/* Shaded Area */}
          {dShaded && (
            <path
              d={dShaded}
              fill="url(#curveGradient)"
              className="transition-all duration-1000 ease-out"
            />
          )}

          {/* Full distribution line */}
          <path
            d={dPath}
            fill="none"
            stroke="var(--muted-foreground)"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />

          {/* Shaded boundary line */}
          {dShaded && (
            <path
              d={curvePoints
                .filter((pt) => pt.z <= userZ)
                .concat([{ x: userX, y: userY, z: userZ }])
                .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
                .join(' ')}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2"
              className="transition-all duration-1000 ease-out"
            />
          )}

          {/* User Marker Dot */}
          <circle
            cx={userX}
            cy={userY}
            r="4.5"
            className="fill-background stroke-primary stroke-[2.5]"
          />

          {/* Vertical marker line to baseline */}
          <line
            x1={userX}
            y1={userY + 4}
            x2={userX}
            y2={height - padding}
            stroke="var(--primary)"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
        </svg>
      </div>

      <div className="flex justify-between text-[9px] font-mono text-muted-foreground mt-2 px-1">
        <span>-3σ (Weaker)</span>
        <span>Average (0σ)</span>
        <span>+3σ (Stronger)</span>
      </div>
    </div>
  );
};
