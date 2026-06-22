// src/components/data-viz/RadarChart.tsx
import React, { useState } from 'react';
import { scoreToLevel, getLevelLabel } from '@/lib/calculations/percentiles';

interface RadarChartAxis {
  axis: string; // exercise name
  value: number; // 0-100 score
}

interface RadarChartProps {
  data: RadarChartAxis[];
  className?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, className = '' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // We need at least 3 axes to draw a valid polygon radar chart
  if (data.length < 3) {
    return (
      <div className="flex items-center justify-center h-48 border border-dashed border-border rounded-xl text-xs text-muted-foreground p-6">
        Enter at least 3 lifts to view your strength balance chart.
      </div>
    );
  }

  const cx = 130;
  const cy = 130;
  const r = 65; // max radius for score 100
  const numAxes = data.length;

  // Compute angles for each axis
  const getCoordinatesForValue = (index: number, scoreValue: number) => {
    const angle = (index * 2 * Math.PI) / numAxes - Math.PI / 2;
    const currentRadius = (scoreValue / 100) * r;
    const x = cx + currentRadius * Math.cos(angle);
    const y = cy + currentRadius * Math.sin(angle);
    return { x, y, angle };
  };

  // 1. Grid Rings (concentric reference shapes)
  const gridLevels = [20, 40, 60, 80, 100];
  const gridPolygons = gridLevels.map((level) => {
    const points = [];
    for (let i = 0; i < numAxes; i++) {
      const { x, y } = getCoordinatesForValue(i, level);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  });

  // 2. User Data Polygon
  const userDataPoints = data
    .map((d, i) => {
      const { x, y } = getCoordinatesForValue(i, d.value);
      return `${x},${y}`;
    })
    .join(' ');

  // 3. Axis Lines and Text Labels
  const axisLines = [];
  const labels = [];
  for (let i = 0; i < numAxes; i++) {
    const outerCoord = getCoordinatesForValue(i, 100);
    axisLines.push(outerCoord);

    // Position labels slightly further out than max radius
    const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
    const labelRadius = r + 18; // Spacious padding to prevent clipping
    const lx = cx + labelRadius * Math.cos(angle);
    const ly = cy + labelRadius * Math.sin(angle);
    
    // Adjust text alignment based on position
    let textAnchor: 'start' | 'end' | 'middle' = 'middle';
    if (Math.cos(angle) > 0.1) textAnchor = 'start';
    if (Math.cos(angle) < -0.1) textAnchor = 'end';

    // Lift label vertical offset
    let dy = '0.35em';
    if (Math.sin(angle) > 0.8) dy = '0.9em';
    if (Math.sin(angle) < -0.8) dy = '-0.2em';

    labels.push({
      name: data[i].axis,
      val: data[i].value,
      lx,
      ly,
      textAnchor,
      dy
    });
  }

  return (
    <div className={`relative w-full max-w-[340px] mx-auto p-2 flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-full aspect-square">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 260 260">
          {/* Grid Rings */}
          {gridPolygons.map((points, idx) => (
            <polygon
              key={idx}
              points={points}
              fill="none"
              stroke="var(--border)"
              strokeWidth="0.75"
              strokeDasharray={idx < 4 ? '2 2' : undefined}
              className="opacity-50"
            />
          ))}

          {/* Grid concentric numeric indicators */}
          {gridLevels.map((level, idx) => {
            const { x, y } = getCoordinatesForValue(0, level);
            return (
              <text
                key={idx}
                x={x - 4}
                y={y + 3}
                fill="var(--muted-foreground)"
                fontSize="8"
                fontFamily="var(--font-mono)"
                textAnchor="end"
                className="opacity-60 select-none pointer-events-none"
              >
                {level}
              </text>
            );
          })}

          {/* Axis Lines */}
          {axisLines.map((coord, idx) => {
            const isActive = hoveredIndex === idx;
            return (
              <line
                key={idx}
                x1={cx}
                y1={cy}
                x2={coord.x}
                y2={coord.y}
                stroke={isActive ? 'var(--primary)' : 'var(--border)'}
                strokeWidth={isActive ? '1.5' : '1'}
                className="transition-all duration-300"
              />
            );
          })}

          {/* User Data Polygon */}
          <polygon
            points={userDataPoints}
            fill="oklch(from var(--primary) l c h / 12%)"
            stroke="var(--primary)"
            strokeWidth="2"
            className="transition-all duration-500 ease-out"
          />

          {/* Data Vertex Markers */}
          {data.map((d, i) => {
            const { x, y } = getCoordinatesForValue(i, d.value);
            const isActive = hoveredIndex === i;
            return (
              <g key={i}>
                {isActive && (
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    className="fill-primary/20 stroke-primary/30 animate-ping pointer-events-none"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? '6' : '4.5'}
                  className="fill-background stroke-primary stroke-2 transition-all duration-300 shadow-sm pointer-events-none"
                />
              </g>
            );
          })}

          {/* Outer Labels */}
          {labels.map((lbl, i) => {
            const isActive = hoveredIndex === i;
            return (
              <g
                key={i}
                className="cursor-pointer select-none"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <text
                  x={lbl.lx}
                  y={lbl.ly}
                  dy={lbl.dy}
                  textAnchor={lbl.textAnchor}
                  className="font-sans tracking-tight"
                >
                  <tspan
                    x={lbl.lx}
                    fill={isActive ? 'var(--primary)' : 'var(--foreground)'}
                    fontSize="9.5"
                    fontWeight="700"
                    className="transition-colors duration-200"
                  >
                    {lbl.name}
                  </tspan>
                  <tspan
                    x={lbl.lx}
                    dy="11"
                    fill="var(--primary)"
                    fontSize="9"
                    fontWeight="800"
                    className="font-mono"
                  >
                    {lbl.val.toFixed(0)}
                  </tspan>
                </text>
              </g>
            );
          })}

          {/* Invisible Interactive Hover Targets (rendered last to overlay on top) */}
          {data.map((d, i) => {
            const { x, y } = getCoordinatesForValue(i, d.value);
            return (
              <circle
                key={`hover-${i}`}
                cx={x}
                cy={y}
                r="18"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Floating Tooltip Component */}
        {hoveredIndex !== null && (() => {
          const activeData = data[hoveredIndex];
          const { x, y } = getCoordinatesForValue(hoveredIndex, activeData.value);
          const leftPercent = (x / 260) * 100;
          const topPercent = (y / 260) * 100;
          const level = scoreToLevel(activeData.value);
          const levelLabel = getLevelLabel(level);

          return (
            <div
              className="absolute z-30 pointer-events-none bg-popover/95 backdrop-blur-md border border-border/80 px-3 py-2 rounded-xl shadow-xl text-xs space-y-1 transition-all duration-200 ease-out min-w-[130px] text-center"
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                transform: 'translate(-50%, -100%) translateY(-12px)',
              }}
            >
              {/* Arrow */}
              <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-popover border-r border-b border-border/80 rotate-45" />
              
              <div className="font-bold text-foreground font-sans truncate">{activeData.axis}</div>
              <div className="flex justify-between items-center gap-2 pt-1 border-t border-border/40">
                <span className="text-[10px] text-muted-foreground uppercase font-mono">Score</span>
                <span className="font-bold text-primary font-mono">{activeData.value.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[10px] text-muted-foreground uppercase font-mono">Level</span>
                <span 
                  className="text-[10px] font-extrabold uppercase font-sans tracking-wide"
                  style={{ color: `var(--level-${level})` }}
                >
                  {levelLabel}
                </span>
              </div>
            </div>
          );
        })()}
      </div>
      <p className="text-[10px] text-center text-muted-foreground mt-4 italic max-w-xs select-none">
        Hover over exercises or markers to see pattern score details and gym classification.
      </p>
    </div>
  );
};
