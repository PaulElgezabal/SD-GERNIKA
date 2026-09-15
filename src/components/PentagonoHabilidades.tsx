import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Sliders, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

export interface PentagonoItem {
  key: string;
  label: string;
  sublabel?: string;
  value: number; // 1 to 5
}

interface PentagonoHabilidadesProps {
  tipo: 'con_balon' | 'sin_balon';
  titulo?: string;
  items: PentagonoItem[];
  onChange: (items: PentagonoItem[]) => void;
  readOnly?: boolean;
}

const SVG_WIDTH = 340;
const SVG_HEIGHT = 300;
const CENTER_X = SVG_WIDTH / 2; // 170
const CENTER_Y = 145;
const MAX_RADIUS = 90;
const MIN_RADIUS = 18; // radius for value = 1 (or 0)

// 5 angles starting from top (-90 degrees)
const ANGLES = [
  -Math.PI / 2, // 0: Top
  -Math.PI / 2 + (2 * Math.PI) / 5, // 1: Top Right
  -Math.PI / 2 + (4 * Math.PI) / 5, // 2: Bottom Right
  -Math.PI / 2 + (6 * Math.PI) / 5, // 3: Bottom Left
  -Math.PI / 2 + (8 * Math.PI) / 5, // 4: Top Left
];

export const PentagonoHabilidades: React.FC<PentagonoHabilidadesProps> = ({
  tipo,
  titulo,
  items,
  onChange,
  readOnly = false,
}) => {
  const { theme } = useTheme();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [activeDraggingIdx, setActiveDraggingIdx] = useState<number | null>(null);
  const [showSliders, setShowSliders] = useState(false);

  const isConBalon = tipo === 'con_balon';
  const defaultTitle = isConBalon ? 'CON BALÓN (Técnica)' : 'SIN BALÓN (Táctica)';
  const displayTitle = titulo || defaultTitle;

  // Colors based on type and theme
  const strokeColor = isConBalon ? '#10b981' : '#f43f5e'; // emerald vs rose
  const fillColor = isConBalon
    ? theme === 'dark'
      ? 'rgba(16, 185, 129, 0.35)'
      : 'rgba(16, 185, 129, 0.25)'
    : theme === 'dark'
    ? 'rgba(244, 63, 94, 0.35)'
    : 'rgba(244, 63, 94, 0.25)';
  const handleColor = isConBalon ? '#34d399' : '#fb7185';
  const badgeBg = isConBalon
    ? theme === 'dark'
      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
      : 'bg-emerald-50 text-emerald-900 border-emerald-300'
    : theme === 'dark'
    ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
    : 'bg-rose-50 text-rose-900 border-rose-300';

  // Calculate average score
  const totalScore = items.reduce((acc, it) => acc + it.value, 0);
  const avgScore = items.length > 0 ? totalScore / items.length : 0;
  const avgFormatted = avgScore.toFixed(1);

  // Convert a score (1 to 5) to a radial distance
  const getRadiusForScore = (score: number) => {
    const clamped = Math.max(1, Math.min(5, score));
    // Linear interpolation from MIN_RADIUS at 1 to MAX_RADIUS at 5
    return MIN_RADIUS + ((clamped - 1) / 4) * (MAX_RADIUS - MIN_RADIUS);
  };

  // Convert radial distance back to score
  const getScoreForRadius = (dist: number) => {
    const ratio = (dist - MIN_RADIUS) / (MAX_RADIUS - MIN_RADIUS);
    const raw = 1 + ratio * 4;
    // Step by 0.5 for crisp precision: 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0
    const rounded = Math.round(raw * 2) / 2;
    return Math.max(1, Math.min(5, rounded));
  };

  // Compute vertices for a specific level (1 to 5) for background grid
  const getGridPolygonPoints = (level: number) => {
    const r = getRadiusForScore(level);
    return ANGLES.map((angle) => {
      const x = CENTER_X + r * Math.cos(angle);
      const y = CENTER_Y + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  };

  // Compute vertices for current player attributes
  const currentPolygonPoints = items
    .slice(0, 5)
    .map((item, idx) => {
      const angle = ANGLES[idx] ?? 0;
      const r = getRadiusForScore(item.value);
      const x = CENTER_X + r * Math.cos(angle);
      const y = CENTER_Y + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  // Pointer interaction: drag vertex inward or outward
  const handlePointerDown = (idx: number, e: React.PointerEvent) => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    setActiveDraggingIdx(idx);
  };

  const handlePointerMove = useCallback(
    (idx: number, e: React.PointerEvent) => {
      if (readOnly || activeDraggingIdx !== idx || !svgRef.current) return;
      e.preventDefault();
      e.stopPropagation();

      const rect = svgRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      // Scale to SVG coordinates
      const svgX = ((clientX - rect.left) / rect.width) * SVG_WIDTH;
      const svgY = ((clientY - rect.top) / rect.height) * SVG_HEIGHT;

      const dx = svgX - CENTER_X;
      const dy = svgY - CENTER_Y;
      const angle = ANGLES[idx];

      // Project the cursor displacement vector onto the axis vector
      const projDist = dx * Math.cos(angle) + dy * Math.sin(angle);
      const newScore = getScoreForRadius(projDist);

      const updated = items.map((it, i) => (i === idx ? { ...it, value: newScore } : it));
      onChange(updated);
    },
    [activeDraggingIdx, items, onChange, readOnly]
  );

  const handlePointerUp = (e: React.PointerEvent) => {
    if (readOnly) return;
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setActiveDraggingIdx(null);
  };

  // Quick preset buttons (e.g. Set all to 3, 4, or 5)
  const handleSetAll = (val: number) => {
    if (readOnly) return;
    const updated = items.map((it) => ({ ...it, value: val }));
    onChange(updated);
  };

  // Update specific item by key
  const handleItemChange = (key: string, val: number) => {
    if (readOnly) return;
    const updated = items.map((it) => (it.key === key ? { ...it, value: Math.max(1, Math.min(5, val)) } : it));
    onChange(updated);
  };

  return (
    <div
      className={`p-3.5 rounded-xl border transition-all ${
        theme === 'dark'
          ? 'bg-[#141414] border-neutral-800'
          : 'bg-white border-neutral-200 shadow-xs'
      }`}
    >
      {/* Header with Title and Average Score */}
      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-neutral-800/40">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{isConBalon ? '⚽' : '🛡️'}</span>
            <h4
              className={`font-black text-xs uppercase tracking-wider ${
                theme === 'dark' ? 'text-white' : 'text-neutral-900'
              }`}
            >
              {displayTitle}
            </h4>
          </div>
          <p className="text-[10px] font-mono text-neutral-400">
            {readOnly ? 'Valoración táctica' : 'Desliza los puntos hacia dentro o fuera'}
          </p>
        </div>

        {/* Average Pill */}
        <div className="flex items-center gap-2">
          <div
            className={`px-2.5 py-1 rounded-lg border font-mono text-xs font-black flex items-center gap-1.5 ${badgeBg}`}
            title="Puntuación media global de este pentágono"
          >
            <span>Media:</span>
            <span className="text-sm font-black underline">{avgFormatted}</span>
            <span className="text-[10px] opacity-75">/ 5</span>
          </div>

          {!readOnly && (
            <button
              type="button"
              onClick={() => setShowSliders(!showSliders)}
              className={`p-1.5 rounded border text-xs transition-colors cursor-pointer ${
                showSliders
                  ? theme === 'dark'
                    ? 'bg-neutral-700 text-white border-white'
                    : 'bg-neutral-200 text-black border-black'
                  : theme === 'dark'
                  ? 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white'
                  : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:text-black'
              }`}
              title={showSliders ? 'Ocultar deslizadores numéricos' : 'Mostrar deslizadores numéricos'}
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* SVG PENTAGON RADAR */}
      <div className="relative flex justify-center items-center select-none touch-none py-1">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full max-w-[340px] h-auto overflow-visible select-none"
        >
          <defs>
            {/* Gradient for fill */}
            <radialGradient id={`pentagon-grad-${tipo}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={theme === 'dark' ? 0.45 : 0.35} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={theme === 'dark' ? 0.15 : 0.1} />
            </radialGradient>
            <filter id={`glow-${tipo}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={strokeColor} floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Concentric Grid Pentagons (Levels 1 to 5) */}
          {[1, 2, 3, 4, 5].map((level) => (
            <polygon
              key={`grid-poly-${level}`}
              points={getGridPolygonPoints(level)}
              fill={level === 5 ? (theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)') : 'none'}
              stroke={
                level === 5
                  ? theme === 'dark'
                    ? 'rgba(255,255,255,0.3)'
                    : 'rgba(0,0,0,0.25)'
                  : theme === 'dark'
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(0,0,0,0.08)'
              }
              strokeWidth={level === 5 ? 1.5 : 1}
              strokeDasharray={level < 5 && level % 2 === 1 ? '3 3' : undefined}
            />
          ))}

          {/* Spoke lines from center to outer vertices */}
          {ANGLES.map((angle, idx) => {
            const xOuter = CENTER_X + MAX_RADIUS * Math.cos(angle);
            const yOuter = CENTER_Y + MAX_RADIUS * Math.sin(angle);
            return (
              <line
                key={`spoke-${idx}`}
                x1={CENTER_X}
                y1={CENTER_Y}
                x2={xOuter}
                y2={yOuter}
                stroke={theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}
                strokeWidth="1"
              />
            );
          })}

          {/* Level Numbers along top axis (1, 2, 3, 4, 5) */}
          {[1, 2, 3, 4, 5].map((lvl) => {
            const r = getRadiusForScore(lvl);
            const y = CENTER_Y - r;
            return (
              <text
                key={`lvl-label-${lvl}`}
                x={CENTER_X + 4}
                y={y + 3}
                fontSize="8"
                fontWeight="bold"
                fontFamily="monospace"
                fill={theme === 'dark' ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'}
              >
                {lvl}
              </text>
            );
          })}

          {/* ACTIVE SHADED POLYGON */}
          <polygon
            points={currentPolygonPoints}
            fill={`url(#pentagon-grad-${tipo})`}
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
            filter={`url(#glow-${tipo})`}
            className="transition-all duration-75"
          />

          {/* Central Point */}
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r="2.5"
            fill={theme === 'dark' ? '#666666' : '#999999'}
          />

          {/* DRAGGABLE VERTEX HANDLES & LABELS */}
          {items.slice(0, 5).map((item, idx) => {
            const angle = ANGLES[idx] ?? 0;
            const r = getRadiusForScore(item.value);
            const x = CENTER_X + r * Math.cos(angle);
            const y = CENTER_Y + r * Math.sin(angle);

            // Calculate label position outside the pentagon
            const labelDist = MAX_RADIUS + 22;
            const lx = CENTER_X + labelDist * Math.cos(angle);
            const ly = CENTER_Y + labelDist * Math.sin(angle);

            // Alignment based on position
            let textAnchor: 'middle' | 'start' | 'end' = 'middle';
            let dxOffset = 0;
            let dyOffset = 4;

            if (idx === 0) {
              // Top
              textAnchor = 'middle';
              dyOffset = -8;
            } else if (idx === 1) {
              // Top Right
              textAnchor = 'start';
              dxOffset = 6;
              dyOffset = -2;
            } else if (idx === 2) {
              // Bottom Right
              textAnchor = 'start';
              dxOffset = 6;
              dyOffset = 10;
            } else if (idx === 3) {
              // Bottom Left
              textAnchor = 'end';
              dxOffset = -6;
              dyOffset = 10;
            } else if (idx === 4) {
              // Top Left
              textAnchor = 'end';
              dxOffset = -6;
              dyOffset = -2;
            }

            const isDraggingThis = activeDraggingIdx === idx;

            return (
              <g key={`vertex-group-${item.key}`}>
                {/* Visual guideline when dragging */}
                {isDraggingThis && (
                  <circle
                    cx={CENTER_X}
                    cy={CENTER_Y}
                    r={r}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Extended invisible touch/drag area */}
                <circle
                  cx={x}
                  cy={y}
                  r="24"
                  fill="transparent"
                  className={readOnly ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
                  onPointerDown={(e) => handlePointerDown(idx, e)}
                  onPointerMove={(e) => handlePointerMove(idx, e)}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                />

                {/* Outer pulsing ring if dragging */}
                {isDraggingThis && (
                  <circle
                    cx={x}
                    cy={y}
                    r="14"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2"
                    className="animate-ping"
                  />
                )}

                {/* Visible handle circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={isDraggingThis ? '7.5' : '5.5'}
                  fill={handleColor}
                  stroke={theme === 'dark' ? '#000000' : '#ffffff'}
                  strokeWidth="2"
                  className={`transition-transform duration-75 ${
                    readOnly ? '' : 'cursor-grab active:cursor-grabbing hover:scale-125'
                  }`}
                  onPointerDown={(e) => handlePointerDown(idx, e)}
                  onPointerMove={(e) => handlePointerMove(idx, e)}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                />

                {/* Floating tooltip during drag */}
                {isDraggingThis && (
                  <g transform={`translate(${x}, ${y - 18})`}>
                    <rect
                      x="-18"
                      y="-14"
                      width="36"
                      height="16"
                      rx="4"
                      fill={theme === 'dark' ? '#000000' : '#ffffff'}
                      stroke={strokeColor}
                      strokeWidth="1.5"
                    />
                    <text
                      x="0"
                      y="-3"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      fill={theme === 'dark' ? '#ffffff' : '#000000'}
                    >
                      {item.value.toFixed(1)}
                    </text>
                  </g>
                )}

                {/* Label and current value badge */}
                <text
                  x={lx + dxOffset}
                  y={ly + dyOffset}
                  textAnchor={textAnchor}
                  className="select-none pointer-events-none"
                >
                  <tspan
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                    fill={
                      isDraggingThis
                        ? strokeColor
                        : theme === 'dark'
                        ? '#e5e5e5'
                        : '#171717'
                    }
                  >
                    {item.label}
                  </tspan>
                  <tspan
                    dx="4"
                    fontSize="9.5"
                    fontWeight="black"
                    fontFamily="monospace"
                    fill={strokeColor}
                  >
                    [{item.value.toFixed(1)}]
                  </tspan>
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Quick Helper Info & Fast Level Presets */}
      {!readOnly && (
        <div className="flex items-center justify-between gap-1 pt-1 font-mono text-[10px] text-neutral-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Arrastra los puntos o pulsa preajustes:</span>
            <span className="sm:hidden">Preajustes:</span>
          </span>
          <div className="flex items-center gap-1">
            {[2, 3, 4, 5].map((val) => (
              <button
                key={`preset-${val}`}
                type="button"
                onClick={() => handleSetAll(val)}
                className={`px-1.5 py-0.5 rounded border transition-colors cursor-pointer font-bold ${
                  theme === 'dark'
                    ? 'bg-neutral-900 border-neutral-700 hover:border-white text-neutral-300'
                    : 'bg-neutral-100 border-neutral-300 hover:border-black text-neutral-700'
                }`}
                title={`Fijar todas las cualidades en ${val}`}
              >
                {val}★
              </button>
            ))}
          </div>
        </div>
      )}

      {/* EXPANDABLE FINE-TUNING SLIDERS */}
      {showSliders && !readOnly && (
        <div
          className={`mt-3 pt-3 border-t space-y-2 font-mono ${
            theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
            Ajuste fino de cualidades (1 a 5):
          </div>

          <div className="grid grid-cols-1 gap-2">
            {items.map((item) => (
              <div
                key={`slider-row-${item.key}`}
                className={`p-2 rounded border flex flex-col gap-1 ${
                  theme === 'dark'
                    ? 'bg-black/50 border-neutral-800'
                    : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`font-bold uppercase ${
                      theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'
                    }`}
                  >
                    {item.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {/* Decrement Button */}
                    <button
                      type="button"
                      onClick={() => handleItemChange(item.key, item.value - 0.5)}
                      disabled={item.value <= 1}
                      className="w-5 h-5 rounded flex items-center justify-center border font-bold text-xs hover:bg-neutral-700 disabled:opacity-30 cursor-pointer"
                    >
                      -
                    </button>
                    {/* Score display */}
                    <span className="font-black w-8 text-center" style={{ color: strokeColor }}>
                      {item.value.toFixed(1)}
                    </span>
                    {/* Increment Button */}
                    <button
                      type="button"
                      onClick={() => handleItemChange(item.key, item.value + 0.5)}
                      disabled={item.value >= 5}
                      className="w-5 h-5 rounded flex items-center justify-center border font-bold text-xs hover:bg-neutral-700 disabled:opacity-30 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Slider Input */}
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={item.value}
                  onChange={(e) => handleItemChange(item.key, parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-neutral-700 rounded-lg cursor-pointer"
                  style={{
                    accentColor: strokeColor,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
