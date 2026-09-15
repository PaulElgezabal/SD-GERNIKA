import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  OFFICIAL_TACTICAL_POSITIONS,
  TacticalPositionInfo,
  getTacticalPositionByCode,
} from '../data/tacticalPositions';
import { Shield, Sparkles, Check, Info, X } from 'lucide-react';

interface CampoSelectorPosicionesProps {
  // Posición Principal (Rojo Fuerte)
  posicionPrincipalCode?: string;
  onSelectPrincipal: (pos: TacticalPositionInfo) => void;

  // Posición Alternativa (Rojo Más Suave)
  posicionAlternativaCode?: string;
  onSelectAlternativa: (pos: TacticalPositionInfo | null) => void;

  // Opcional: dorsal para mostrar en la bola roja
  dorsal?: number | string;
  nombre?: string;
}

export const CampoSelectorPosiciones: React.FC<CampoSelectorPosicionesProps> = ({
  posicionPrincipalCode = 'MC',
  onSelectPrincipal,
  posicionAlternativaCode,
  onSelectAlternativa,
  dorsal,
  nombre,
}) => {
  const { theme } = useTheme();

  // Modo de asignación activo al hacer clic en el campo: 'principal' (rojo fuerte) o 'alternativa' (rojo suave)
  const [targetMode, setTargetMode] = useState<'principal' | 'alternativa'>('principal');
  const [hoveredPos, setHoveredPos] = useState<TacticalPositionInfo | null>(null);

  // Obtener info exacta de posición principal y alternativa
  const posPrincipal =
    getTacticalPositionByCode(posicionPrincipalCode) ||
    OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === 'MC_DCH') ||
    OFFICIAL_TACTICAL_POSITIONS[7];

  const posAlternativa = posicionAlternativaCode
    ? getTacticalPositionByCode(posicionAlternativaCode)
    : null;

  const handlePositionClick = (pos: TacticalPositionInfo) => {
    if (targetMode === 'principal') {
      onSelectPrincipal(pos);
      // Si la alternativa coincide con la nueva principal, limpiar alternativa
      if (posAlternativa && posAlternativa.code === pos.code) {
        onSelectAlternativa(null);
      }
    } else {
      // Si hace clic en la misma que ya es principal, advertir o no permitir duplicado
      if (posPrincipal && posPrincipal.code === pos.code) {
        return;
      }
      onSelectAlternativa(pos);
    }
  };

  return (
    <div
      id="selector-posiciones-campo"
      className={`rounded-xl border overflow-hidden transition-all ${
        theme === 'dark'
          ? 'bg-neutral-950 border-neutral-800 text-white'
          : 'bg-white border-neutral-200 text-neutral-900 shadow-sm'
      }`}
    >
      {/* 1. Barra de Selección de Modo: Principal (Rojo Fuerte) vs Alternativa (Rojo Suave) */}
      <div
        className={`p-3 border-b flex flex-wrap items-center justify-between gap-2.5 ${
          theme === 'dark' ? 'bg-neutral-900/90 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
        }`}
      >
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
          <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="uppercase tracking-wide">Posiciones en el Campo:</span>
        </div>

        {/* Botones de conmutación de qué posición estamos asignando en el clic */}
        <div className="flex items-center gap-2">
          {/* BOTÓN ROJO FUERTE: POSICIÓN PRINCIPAL */}
          <button
            type="button"
            onClick={() => setTargetMode('principal')}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              targetMode === 'principal'
                ? 'bg-red-600 text-white ring-2 ring-red-400 shadow-md scale-105'
                : theme === 'dark'
                ? 'bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white'
                : 'bg-white border border-neutral-300 text-neutral-700 hover:text-black'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white inline-block shadow-xs" />
            <span>Principal (Rojo Fuerte)</span>
            {targetMode === 'principal' && <Check className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          {/* BOTÓN ROJO MÁS SUAVE: POSICIÓN ALTERNATIVA */}
          <button
            type="button"
            onClick={() => setTargetMode('alternativa')}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              targetMode === 'alternativa'
                ? 'bg-rose-400 text-black font-black ring-2 ring-rose-300 shadow-md scale-105'
                : theme === 'dark'
                ? 'bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white'
                : 'bg-white border border-neutral-300 text-neutral-700 hover:text-black'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 border border-rose-200 inline-block" />
            <span>Alternativa (Rojo Suave)</span>
            {targetMode === 'alternativa' && <Check className="w-3.5 h-3.5 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Indicador de ayuda al usuario */}
      <div
        className={`px-3 py-1.5 text-[11px] font-mono flex items-center justify-between border-b ${
          targetMode === 'principal'
            ? 'bg-red-950/40 border-red-900/40 text-red-200'
            : 'bg-rose-950/40 border-rose-900/40 text-rose-200'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>
            Haz clic en cualquier posición del campo para fijar la{' '}
            <strong>
              {targetMode === 'principal' ? 'Posición Principal' : 'Posición Alternativa'}
            </strong>
            .
          </span>
        </div>
        <span className="text-[10px] opacity-75 hidden sm:inline">
          Posiciones exactas de fútbol (no aleatorias)
        </span>
      </div>

      {/* 2. TERRENO DE JUEGO VERDE REALISTA CON POSICIONES EXACTAS */}
      <div className="p-3 sm:p-4 flex flex-col items-center justify-center bg-black/20">
        <div
          className="relative w-full max-w-[400px] aspect-[1/1.36] rounded-xl overflow-hidden border-2 border-white/70 shadow-2xl select-none"
          style={{
            background: `
              repeating-linear-gradient(
                to bottom,
                #1b6e35,
                #1b6e35 22px,
                #175d2d 22px,
                #175d2d 44px
              )
            `,
          }}
        >
          {/* LÍNEAS TÁCTICAS DEL CAMPO REGLAMENTARIO */}
          {/* Borde exterior */}
          <div className="absolute inset-2 border border-white/60 pointer-events-none" />

          {/* Línea de medio campo */}
          <div className="absolute top-1/2 left-2 right-2 h-[1px] bg-white/60 -translate-y-1/2 pointer-events-none" />

          {/* Círculo central */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-white/60 pointer-events-none flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
          </div>

          {/* Área Norte (Ataque / Portería rival) */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-44 h-16 border-b border-x border-white/60 pointer-events-none" />
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 border-b border-x border-white/60 pointer-events-none" />
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/70 pointer-events-none" />

          {/* Área Sur (Defensa / Portería propia) */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-44 h-16 border-t border-x border-white/60 pointer-events-none" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-7 border-t border-x border-white/60 pointer-events-none" />
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/70 pointer-events-none" />

          {/* Porterías */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-2 border-b border-x border-white/80 bg-white/10 pointer-events-none" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-2 border-t border-x border-white/80 bg-white/10 pointer-events-none" />

          {/* ======================================================================= */}
          {/* TODAS LAS POSICIONES EXACTAS DEL CAMPO DE FÚTBOL */}
          {/* ======================================================================= */}
          {OFFICIAL_TACTICAL_POSITIONS.map((pos) => {
            const isPrincipal = posPrincipal && posPrincipal.code === pos.code;
            const isAlternativa = posAlternativa && posAlternativa.code === pos.code;
            const isHovered = hoveredPos?.code === pos.code;

            return (
              <div
                key={`pos-${pos.code}`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onMouseEnter={() => setHoveredPos(pos)}
                onMouseLeave={() => setHoveredPos(null)}
                onClick={() => handlePositionClick(pos)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform active:scale-95 group"
                title={`${pos.label} (${pos.labelEuskera}) - Clic para fijar como ${targetMode}`}
              >
                {/* 1. SI ES POSICIÓN PRINCIPAL: BOLA ROJA FUERTE (#dc2626) */}
                {isPrincipal && (
                  <div className="relative flex flex-col items-center justify-center">
                    {/* Ripple / Pulso rojo fuerte */}
                    <div className="absolute -inset-1.5 rounded-full bg-red-500/50 animate-ping pointer-events-none" />
                    <div className="absolute -inset-2.5 rounded-full border-2 border-red-400/80 animate-pulse pointer-events-none" />

                    {/* Botón Rojo Fuerte */}
                    <div className="relative w-8 h-8 rounded-full bg-red-600 text-white font-black flex flex-col items-center justify-center shadow-2xl border-2 border-white ring-2 ring-red-500 transition-transform hover:scale-110">
                      <span className="text-[11px] font-black leading-none drop-shadow-xs">
                        {dorsal ? `#${dorsal}` : pos.code.substring(0, 3)}
                      </span>
                      <span className="text-[7px] font-mono uppercase tracking-tighter opacity-90 leading-none">
                        {pos.code.substring(0, 3)}
                      </span>
                    </div>

                    {/* Etiqueta flotante */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded bg-red-600 border border-white/80 text-white text-[9px] font-black font-mono whitespace-nowrap shadow-xl z-30">
                      PRINCIPAL
                    </div>
                  </div>
                )}

                {/* 2. SI ES POSICIÓN ALTERNATIVA: BOLA ROJO MÁS SUAVE (#f87171 / bg-rose-400) */}
                {isAlternativa && !isPrincipal && (
                  <div className="relative flex flex-col items-center justify-center">
                    {/* Borde discontinuo suave */}
                    <div className="absolute -inset-1.5 rounded-full border border-rose-300/70 pointer-events-none" />

                    {/* Botón Rojo Suave */}
                    <div className="relative w-7 h-7 rounded-full bg-rose-400 text-black font-black flex flex-col items-center justify-center shadow-lg border-2 border-dashed border-white ring-2 ring-rose-300/80 transition-transform hover:scale-110">
                      <span className="text-[10px] font-black leading-none text-black">
                        {pos.code.substring(0, 3)}
                      </span>
                      <span className="text-[6px] font-mono uppercase tracking-tighter font-bold text-neutral-900 leading-none">
                        ALT
                      </span>
                    </div>

                    {/* Etiqueta flotante */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded bg-rose-400 border border-black/30 text-black text-[9px] font-black font-mono whitespace-nowrap shadow-md z-30">
                      ALTERNATIVA
                    </div>
                  </div>
                )}

                {/* 3. POSICIÓN NORMAL NO SELECCIONADA */}
                {!isPrincipal && !isAlternativa && (
                  <div className="flex flex-col items-center justify-center">
                    <div
                      className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center text-[9px] font-mono font-black ${
                        isHovered
                          ? targetMode === 'principal'
                            ? 'border-red-400 bg-red-600/80 text-white scale-125 shadow-lg'
                            : 'border-rose-300 bg-rose-400/80 text-black scale-125 shadow-lg'
                          : 'border-white/40 bg-black/40 text-white/70 hover:border-white hover:text-white'
                      }`}
                    >
                      {pos.code.substring(0, 3)}
                    </div>

                    {/* Tooltip con nombre de posición en hover */}
                    {isHovered && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded bg-black/95 text-white border border-neutral-600 text-[10px] font-mono whitespace-nowrap shadow-xl z-40 pointer-events-none">
                        {pos.label} ({pos.code})
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. RESUMEN VISUAL DE LAS DOS POSICIONES + SELECTORES DESPLEGABLES */}
      <div
        className={`p-3.5 border-t space-y-3 font-mono text-xs ${
          theme === 'dark' ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* TARJETA 1: POSICIÓN PRINCIPAL (ROJO FUERTE) */}
          <div
            onClick={() => setTargetMode('principal')}
            className={`p-2.5 rounded-lg border-2 transition-all cursor-pointer ${
              targetMode === 'principal'
                ? 'border-red-600 bg-red-950/30 ring-1 ring-red-500'
                : theme === 'dark'
                ? 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                : 'border-neutral-200 bg-white hover:border-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-600 border border-white shadow-xs inline-block shrink-0" />
                <span className="font-black uppercase text-[11px] text-red-400">
                  Posición Principal (Rojo Fuerte)
                </span>
              </div>
              {targetMode === 'principal' && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-600 text-white font-black">
                  Activa
                </span>
              )}
            </div>

            <select
              value={posPrincipal?.code || 'MC_DCH'}
              onChange={(e) => {
                const found = OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === e.target.value);
                if (found) onSelectPrincipal(found);
              }}
              className={`w-full px-2.5 py-1.5 rounded border text-xs font-bold ${
                theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-700 text-white'
                  : 'bg-white border-neutral-300 text-neutral-900'
              }`}
            >
              {OFFICIAL_TACTICAL_POSITIONS.map((p) => (
                <option key={`sel-pr-${p.code}`} value={p.code}>
                  {p.code} - {p.label} ({p.labelEuskera})
                </option>
              ))}
            </select>
            <p className="mt-1 text-[10px] text-neutral-400">
              Coordenadas campo: X: {posPrincipal?.x}%, Y: {posPrincipal?.y}%
            </p>
          </div>

          {/* TARJETA 2: POSICIÓN ALTERNATIVA (ROJO MÁS SUAVE) */}
          <div
            onClick={() => setTargetMode('alternativa')}
            className={`p-2.5 rounded-lg border-2 transition-all cursor-pointer ${
              targetMode === 'alternativa'
                ? 'border-rose-400 bg-rose-950/30 ring-1 ring-rose-300'
                : theme === 'dark'
                ? 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                : 'border-neutral-200 bg-white hover:border-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400 border border-rose-200 shadow-xs inline-block shrink-0" />
                <span className="font-black uppercase text-[11px] text-rose-300">
                  Posición Alternativa (Rojo Suave)
                </span>
              </div>
              {posAlternativa && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAlternativa(null);
                  }}
                  className="text-[9px] px-1.5 py-0.2 rounded border border-neutral-700 text-neutral-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
                  title="Quitar posición alternativa"
                >
                  <X className="w-3 h-3" />
                  <span>Quitar</span>
                </button>
              )}
            </div>

            <select
              value={posAlternativa?.code || ''}
              onChange={(e) => {
                if (!e.target.value) {
                  onSelectAlternativa(null);
                } else {
                  const found = OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === e.target.value);
                  if (found) onSelectAlternativa(found);
                }
              }}
              className={`w-full px-2.5 py-1.5 rounded border text-xs font-bold ${
                theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-700 text-white'
                  : 'bg-white border-neutral-300 text-neutral-900'
              }`}
            >
              <option value="">-- Sin posición alternativa --</option>
              {OFFICIAL_TACTICAL_POSITIONS.filter(
                (p) => !posPrincipal || p.code !== posPrincipal.code
              ).map((p) => (
                <option key={`sel-alt-${p.code}`} value={p.code}>
                  {p.code} - {p.label} ({p.labelEuskera})
                </option>
              ))}
            </select>
            <p className="mt-1 text-[10px] text-neutral-400">
              {posAlternativa
                ? `Coordenadas campo: X: ${posAlternativa.x}%, Y: ${posAlternativa.y}%`
                : 'Opcional: Asigna una 2ª demarcación táctica'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
