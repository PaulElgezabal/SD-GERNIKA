import React, { useRef, useState, useMemo } from 'react';
import { Player } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Shield, Move, Sparkles, Check, Info, ArrowRight, UserCheck, Users, Eye } from 'lucide-react';
import {
  OFFICIAL_TACTICAL_POSITIONS,
  TacticalPositionInfo,
  getTacticalPositionByCode,
} from '../data/tacticalPositions';

export type { TacticalPositionInfo };
export const TACTICAL_POSITIONS: TacticalPositionInfo[] = OFFICIAL_TACTICAL_POSITIONS;

/**
 * Determina la posición primaria (rojo fuerte) y las posiciones alternativas (rojo suave) para un jugador
 */
export function getPlayablePositionsForPlayer(player: Player | null): {
  primary: { x: number; y: number; code: string; label: string };
  secondaries: Array<{ x: number; y: number; code: string; label: string; isExplicitAlt?: boolean }>;
} {
  if (!player) {
    return {
      primary: { x: 50, y: 50, code: 'MC', label: 'Mediocentro' },
      secondaries: [],
    };
  }

  const tactCode = (player.posicionTactico || '').toUpperCase().trim();

  // Buscar coincidencia exacta en las posiciones oficiales
  let foundPrimary =
    getTacticalPositionByCode(tactCode) ||
    getTacticalPositionByCode(player.posicion) ||
    OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === 'MC_DCH') ||
    OFFICIAL_TACTICAL_POSITIONS[7];

  const primary = {
    x: player.posicion_x !== undefined && player.posicion_x !== 50 ? player.posicion_x : foundPrimary.x,
    y: player.posicion_y !== undefined && player.posicion_y !== 50 ? player.posicion_y : foundPrimary.y,
    code: foundPrimary.code,
    label: player.posicion || foundPrimary.label,
  };

  const secondaries: Array<{ x: number; y: number; code: string; label: string; isExplicitAlt?: boolean }> = [];

  // 1. Posición alternativa explícita asignada por el usuario (ROJO MÁS SUAVE)
  if (player.posicionAlternativa) {
    const explicitAlt = getTacticalPositionByCode(player.posicionAlternativa);
    if (explicitAlt && explicitAlt.code !== primary.code) {
      secondaries.push({
        x: player.posicion_alt_x !== undefined ? player.posicion_alt_x : explicitAlt.x,
        y: player.posicion_alt_y !== undefined ? player.posicion_alt_y : explicitAlt.y,
        code: explicitAlt.code,
        label: explicitAlt.label,
        isExplicitAlt: true,
      });
    } else if (player.posicion_alt_x !== undefined && player.posicion_alt_y !== undefined) {
      secondaries.push({
        x: player.posicion_alt_x,
        y: player.posicion_alt_y,
        code: 'ALT',
        label: player.posicionAlternativa,
        isExplicitAlt: true,
      });
    }
  }

  // 2. Posiciones alternativas sugeridas tácticas
  if (foundPrimary && foundPrimary.alternativasSugeridas) {
    for (const altCode of foundPrimary.alternativasSugeridas) {
      const match = OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === altCode);
      if (match && match.code !== primary.code && !secondaries.some((s) => s.code === match.code)) {
        secondaries.push({
          x: match.x,
          y: match.y,
          code: match.code,
          label: match.label,
          isExplicitAlt: false,
        });
      }
    }
  }

  return { primary, secondaries };
}

interface CampoTacticoVerdeProps {
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player) => void;
  onUpdatePlayerPosition: (
    playerId: string | number,
    newTacticalCode: string,
    x: number,
    y: number,
    positionLabel?: string,
    positionEuskera?: string
  ) => void;
  players: Player[];
  draggedPlayer: Player | null;
  setDraggedPlayer: (player: Player | null) => void;
  onOpenPlayerModal?: (player: Player) => void;
}

export const CampoTacticoVerde: React.FC<CampoTacticoVerdeProps> = ({
  selectedPlayer,
  onSelectPlayer,
  onUpdatePlayerPosition,
  players,
  draggedPlayer,
  setDraggedPlayer,
  onOpenPlayerModal,
}) => {
  const { theme } = useTheme();
  const pitchRef = useRef<HTMLDivElement | null>(null);
  const [hoveredPos, setHoveredPos] = useState<TacticalPositionInfo | null>(null);
  const [justAssignedMsg, setJustAssignedMsg] = useState<string | null>(null);
  const [isDragOverPitch, setIsDragOverPitch] = useState(false);
  const [viewScope, setViewScope] = useState<'all' | 'focused'>('all');

  // Calcular las posiciones donde puede jugar el jugador seleccionado
  const { primary, secondaries } = getPlayablePositionsForPlayer(selectedPlayer);

  // Mapeo de todos los futbolistas de la plantilla a cada casilla táctica
  const playersBySlot = useMemo(() => {
    const map: Record<string, Player[]> = {};
    for (const p of players) {
      const code = (p.posicionTactico || '').toUpperCase().trim();
      const match = getTacticalPositionByCode(code) || getTacticalPositionByCode(p.posicion);
      const slotCode = match ? match.code : 'MC_DCH';
      if (!map[slotCode]) {
        map[slotCode] = [];
      }
      map[slotCode].push(p);
    }
    return map;
  }, [players]);

  const notifyChange = (text: string) => {
    setJustAssignedMsg(text);
    setTimeout(() => setJustAssignedMsg(null), 3200);
  };

  // Asignar posición al hacer clic en un punto del campo
  const handleAssignPosition = (pos: TacticalPositionInfo) => {
    const targetPlayer = draggedPlayer || selectedPlayer;
    if (!targetPlayer) return;

    onUpdatePlayerPosition(
      targetPlayer.id,
      pos.code,
      pos.x,
      pos.y,
      pos.label,
      pos.labelEuskera
    );

    notifyChange(`¡${targetPlayer.nombre} (#${targetPlayer.dorsal}) asignado a ${pos.label}!`);
  };

  // Manejador de Drop directo sobre el campo
  const handlePitchDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOverPitch(false);

    if (!pitchRef.current) return;
    const rect = pitchRef.current.getBoundingClientRect();
    const dropX = ((e.clientX - rect.left) / rect.width) * 100;
    const dropY = ((e.clientY - rect.top) / rect.height) * 100;

    const playerId = e.dataTransfer.getData('text/plain');
    const targetPlayer =
      draggedPlayer ||
      players.find((p) => String(p.id) === String(playerId)) ||
      selectedPlayer;

    if (!targetPlayer) return;

    // Buscar la posición táctica más cercana al punto de soltado
    let closestPos = TACTICAL_POSITIONS[0];
    let minDistance = 9999;

    for (const pos of TACTICAL_POSITIONS) {
      const dist = Math.hypot(pos.x - dropX, pos.y - dropY);
      if (dist < minDistance) {
        minDistance = dist;
        closestPos = pos;
      }
    }

    // Si está cerca de una posición táctica predefinida (< 18% distancia), asignar esa posición oficial
    if (minDistance < 18) {
      onUpdatePlayerPosition(
        targetPlayer.id,
        closestPos.code,
        closestPos.x,
        closestPos.y,
        closestPos.label,
        closestPos.labelEuskera
      );
      notifyChange(`¡${targetPlayer.nombre} situado en ${closestPos.label}!`);
    } else {
      // Asignar coordenadas precisas en el campo
      const clampedX = Math.round(Math.max(8, Math.min(92, dropX)));
      const clampedY = Math.round(Math.max(8, Math.min(92, dropY)));

      onUpdatePlayerPosition(
        targetPlayer.id,
        closestPos.code,
        clampedX,
        clampedY,
        closestPos.label,
        closestPos.labelEuskera
      );
      notifyChange(`¡${targetPlayer.nombre} reubicado en (${clampedX}%, ${clampedY}%)!`);
    }

    onSelectPlayer(targetPlayer);
    setDraggedPlayer(null);
  };

  return (
    <div
      id="campo-tactico-verde"
      className={`rounded-xl border overflow-hidden transition-all flex flex-col ${
        theme === 'dark'
          ? 'bg-neutral-900/90 border-neutral-800 shadow-xl'
          : 'bg-white border-neutral-300 shadow-lg'
      }`}
    >
      {/* Cabecera del Campo */}
      <div
        className={`px-4 py-3 border-b flex flex-wrap items-center justify-between gap-2.5 ${
          theme === 'dark' ? 'bg-neutral-950/80 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3
              className={`text-xs sm:text-sm font-black uppercase tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-neutral-900'
              }`}
            >
              Campo Táctico de Posiciones
            </h3>
            <p className="text-[10px] font-mono text-neutral-400">
              {players.length} futbolistas ubicados en el campo
            </p>
          </div>
        </div>

        {/* Selector de Modo: Toda la Plantilla vs Foco en Seleccionado */}
        <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-lg border border-neutral-700/60">
          <button
            type="button"
            onClick={() => setViewScope('all')}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
              viewScope === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Mostrar a todos los jugadores en sus posiciones en el campo"
          >
            <Users className="w-3 h-3" />
            <span>Toda la Plantilla</span>
          </button>
          <button
            type="button"
            onClick={() => setViewScope('focused')}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
              viewScope === 'focused'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Ver únicamente al jugador seleccionado y sus alternativas"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" />
            <span>Solo Seleccionado</span>
          </button>
        </div>
      </div>

      {/* Leyenda de Posiciones: Rojo Fuerte y Rojo Suave */}
      <div
        className={`px-3.5 py-2 border-b text-[10px] font-mono flex flex-wrap items-center justify-between gap-2 ${
          theme === 'dark' ? 'bg-neutral-950/60 border-neutral-800 text-neutral-300' : 'bg-neutral-100 border-neutral-200 text-neutral-700'
        }`}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white shadow-xs animate-pulse" />
            <span className="text-red-400 font-black">Principal (Rojo Fuerte)</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 border border-black/40 shadow-xs" />
            <span className="text-rose-400 font-black">Secundaria / Alt (Rojo Suave)</span>
          </div>
          {viewScope === 'all' && (
            <div className="flex items-center gap-1.5 font-bold text-neutral-400">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-neutral-500 shadow-xs" />
              <span>Resto de la Plantilla</span>
            </div>
          )}
        </div>

        {selectedPlayer && onOpenPlayerModal && (
          <button
            type="button"
            onClick={() => onOpenPlayerModal(selectedPlayer)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/50 text-[10px] font-bold uppercase transition-colors cursor-pointer"
            title="Abrir ficha técnica y editar posiciones"
          >
            <Eye className="w-3 h-3" />
            <span>Ver Ficha #{selectedPlayer.dorsal}</span>
          </button>
        )}
      </div>

      {/* Barra de Notificación / Feedback instantáneo */}
      {justAssignedMsg && (
        <div className="bg-emerald-500 text-white px-3 py-1.5 text-xs font-mono font-bold flex items-center justify-center gap-1.5 animate-fadeIn">
          <Check className="w-3.5 h-3.5" />
          {justAssignedMsg}
        </div>
      )}

      {/* Tarjeta del Jugador Seleccionado */}
      <div
        className={`px-3.5 py-2.5 border-b text-xs font-mono flex flex-wrap items-center justify-between gap-2 ${
          theme === 'dark' ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-100/70 border-neutral-200'
        }`}
      >
        {selectedPlayer ? (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-red-600 text-white font-black flex items-center justify-center text-xs shadow-md shrink-0 border border-white">
              #{selectedPlayer.dorsal}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-black uppercase text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {selectedPlayer.nombre}
                </span>
                <span className="text-[10px] text-neutral-400">
                  ({selectedPlayer.posicion || 'Futbolista'})
                </span>
              </div>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <UserCheck className="w-3 h-3" />
                Desliza la ficha o haz clic en el campo para reubicarlo
              </p>
            </div>
          </div>
        ) : (
          <div className="text-neutral-400 flex items-center gap-1.5 italic text-xs">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            Haz clic en la ficha de un jugador para ver su bola roja en el campo.
          </div>
        )}

        {selectedPlayer && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] px-2.5 py-0.5 rounded bg-red-600 text-white border border-red-500 font-bold uppercase shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {primary.code} ({primary.label})
            </span>
            {selectedPlayer.posicionAlternativa ? (
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-rose-400 text-black border border-rose-300 font-black uppercase shadow-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-black/60" />
                Alt: {selectedPlayer.posicionAlternativa}
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700 font-mono italic">
                Sin posición alternativa
              </span>
            )}
          </div>
        )}
      </div>

      {/* TERRENO DE JUEGO VERDE (CAMPO DE FÚTBOL) */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col items-center justify-center">
        <div
          ref={pitchRef}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOverPitch(true);
          }}
          onDragLeave={() => setIsDragOverPitch(false)}
          onDrop={handlePitchDrop}
          className={`relative w-full max-w-[420px] aspect-[1/1.38] rounded-lg overflow-hidden border-2 transition-all select-none shadow-2xl ${
            isDragOverPitch
              ? 'ring-4 ring-emerald-400 border-white scale-[1.01]'
              : 'border-white/70'
          }`}
          style={{
            background: `
              repeating-linear-gradient(
                180deg,
                #1e7e34 0px,
                #1e7e34 32px,
                #19692c 32px,
                #19692c 64px
              )
            `,
          }}
        >
          {/* LÍNEAS DEL CAMPO DE FÚTBOL (Blanco nítido) */}
          {/* 1. Línea Perimetral interna */}
          <div className="absolute inset-2 sm:inset-2.5 border-2 border-white/85 rounded pointer-events-none" />

          {/* 2. Línea de Medio Campo */}
          <div className="absolute top-1/2 left-2 right-2 sm:left-2.5 sm:right-2.5 h-[2px] bg-white/85 pointer-events-none -translate-y-1/2" />

          {/* 3. Círculo Central */}
          <div className="absolute top-1/2 left-1/2 w-24 h-24 sm:w-28 sm:h-28 -translate-x-1/2 -translate-y-1/2 border-2 border-white/85 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full pointer-events-none" />

          {/* 4. Área Grande Superior (Equipo rival o ataque) */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[60%] h-[16%] border-b-2 border-x-2 border-white/85 pointer-events-none" />
          {/* Área Pequeña Superior */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[32%] h-[6%] border-b-2 border-x-2 border-white/85 pointer-events-none" />
          {/* Punto de penalti superior */}
          <div className="absolute top-[11%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full pointer-events-none" />
          {/* Portería Superior */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[24%] h-2 border-b-2 border-x-2 border-white/90 bg-white/15 pointer-events-none" />

          {/* 5. Área Grande Inferior (Nuestra portería) */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[60%] h-[16%] border-t-2 border-x-2 border-white/85 pointer-events-none" />
          {/* Área Pequeña Inferior */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[32%] h-[6%] border-t-2 border-x-2 border-white/85 pointer-events-none" />
          {/* Punto de penalti inferior */}
          <div className="absolute bottom-[11%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full pointer-events-none" />
          {/* Portería Inferior */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[24%] h-2 border-t-2 border-x-2 border-white/90 bg-white/15 pointer-events-none" />

          {/* Indicadores de Córner */}
          <div className="absolute top-2 left-2 w-3 h-3 border-b-2 border-r-2 border-white/85 rounded-br-full pointer-events-none" />
          <div className="absolute top-2 right-2 w-3 h-3 border-b-2 border-l-2 border-white/85 rounded-bl-full pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-t-2 border-r-2 border-white/85 rounded-tr-full pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-t-2 border-l-2 border-white/85 rounded-tl-full pointer-events-none" />

          {/* TEXTO ORIENTATIVO DEL CAMPO */}
          <div className="absolute top-3 left-4 text-[9px] font-mono text-white/40 uppercase tracking-widest pointer-events-none">
            Ataque ▲
          </div>
          <div className="absolute bottom-3 left-4 text-[9px] font-mono text-white/40 uppercase tracking-widest pointer-events-none">
            Defensa ▼
          </div>

          {/* PUNTOS TÁCTICOS Y JUGADORES EN EL CAMPO */}
          {TACTICAL_POSITIONS.map((pos) => {
            const isHovered = hoveredPos?.code === pos.code;
            const isPrimary = primary.code === pos.code;
            const isSecondary = secondaries.some((s) => s.code === pos.code);
            const slotPlayers = playersBySlot[pos.code] || [];
            const nonSelectedInSlot = slotPlayers.filter(
              (p) => String(p.id) !== String(selectedPlayer?.id)
            );

            return (
              <div
                key={`tact-slot-${pos.code}`}
                onClick={() => handleAssignPosition(pos)}
                onMouseEnter={() => setHoveredPos(pos)}
                onMouseLeave={() => setHoveredPos(null)}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
              >
                {/* Indicador táctico base del slot */}
                <div className="relative flex flex-col items-center justify-center">
                  {!isPrimary && (
                    <div
                      className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center text-[9px] font-mono font-black ${
                        isSecondary
                          ? 'border-rose-300 bg-rose-400/90 text-black shadow-md scale-110'
                          : isHovered
                          ? 'border-white bg-white/30 text-white scale-110 shadow-lg'
                          : slotPlayers.length > 0 && viewScope === 'all'
                          ? 'border-emerald-300/80 bg-neutral-900/90 text-white shadow-sm'
                          : 'border-white/30 bg-black/25 text-white/60 hover:border-white/60 hover:text-white'
                      }`}
                      title={`${pos.label} (${pos.code}) - Clic para asignar`}
                    >
                      {pos.code.substring(0, 3)}
                    </div>
                  )}

                  {/* VISTA DE TODA LA PLANTILLA: MOSTRAR OTROS JUGADORES EN ESTE SLOT */}
                  {viewScope === 'all' && nonSelectedInSlot.length > 0 && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 flex flex-col items-center gap-0.5 z-20 pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {nonSelectedInSlot.slice(0, 2).map((other) => (
                        <button
                          key={`other-${other.id}`}
                          type="button"
                          onClick={() => onSelectPlayer(other)}
                          className="px-1.5 py-0.2 rounded bg-black/85 hover:bg-red-700 text-white border border-white/40 text-[8px] font-mono font-black whitespace-nowrap shadow-md transition-colors cursor-pointer flex items-center gap-0.5"
                          title={`#${other.dorsal} ${other.nombre} - Clic para seleccionar`}
                        >
                          <span className="text-emerald-400">#{other.dorsal}</span>
                          <span>{other.nombre.split(' ')[0]}</span>
                        </button>
                      ))}
                      {nonSelectedInSlot.length > 2 && (
                        <span className="text-[7px] font-mono font-bold bg-neutral-800 text-neutral-300 px-1 rounded">
                          +{nonSelectedInSlot.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Etiqueta tooltip al hacer hover */}
                {isHovered && !isPrimary && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded bg-black/90 text-white text-[10px] font-mono whitespace-nowrap shadow-lg z-30 pointer-events-none">
                    {pos.label}
                    {isSecondary && ' (Alternativa)'}
                    {slotPlayers.length > 0 && ` • ${slotPlayers.length} jugador(es)`}
                  </div>
                )}
              </div>
            );
          })}

          {/* ========================================================================= */}
          {/* BOLA ROJA EN LA POSICIÓN DEL JUGADOR SELECCIONADO (REQUISITO EXPRESO DEL USUARIO - ROJO FUERTE) */}
          {/* ========================================================================= */}
          {selectedPlayer && (
            <div
              style={{ left: `${primary.x}%`, top: `${primary.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-25 cursor-grab active:cursor-grabbing group"
              title={`${selectedPlayer.nombre} (#${selectedPlayer.dorsal}) - ${primary.label}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenPlayerModal) onOpenPlayerModal(selectedPlayer);
              }}
            >
              {/* Efecto de Pulso / Ripple animado alrededor de la bola roja fuerte */}
              <div className="absolute -inset-2 rounded-full bg-red-500/50 animate-ping pointer-events-none" />
              <div className="absolute -inset-3 rounded-full border-2 border-red-400/70 animate-pulse pointer-events-none" />

              {/* LA BOLA ROJA PRINCIPAL */}
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-800 text-white font-black flex flex-col items-center justify-center shadow-2xl border-2 border-white ring-2 ring-red-500/90 transition-transform transform hover:scale-115 cursor-pointer">
                <span className="text-xs sm:text-sm font-black leading-none drop-shadow-md">
                  #{selectedPlayer.dorsal}
                </span>
                <span className="text-[7px] font-mono uppercase tracking-tighter opacity-90 leading-none">
                  {primary.code.substring(0, 3)}
                </span>
              </div>

              {/* Etiqueta con el nombre del jugador debajo de la bola roja */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded bg-red-950/95 border border-red-500/60 text-white text-[10px] font-bold font-mono whitespace-nowrap shadow-xl flex items-center gap-1 z-30">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-ping" />
                {selectedPlayer.nombre.split(' ')[0]}
              </div>
            </div>
          )}

          {/* BOLAS ROJAS SECUNDARIAS / ALTERNATIVAS (ROJO MÁS SUAVE) */}
          {selectedPlayer &&
            secondaries.map((sec) => (
              <div
                key={`alt-marker-${sec.code}`}
                onClick={() => {
                  const match = TACTICAL_POSITIONS.find((p) => p.code === sec.code);
                  if (match) handleAssignPosition(match);
                }}
                style={{ left: `${sec.x}%`, top: `${sec.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                title={`${sec.label} (${sec.isExplicitAlt ? 'Posición alternativa' : 'Alternativa viable'}) - Clic para cambiar aquí`}
              >
                {sec.isExplicitAlt ? (
                  <div className="relative flex flex-col items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-rose-400 text-black text-[10px] font-mono font-black flex items-center justify-center shadow-xl border-2 border-dashed border-white ring-2 ring-rose-300 hover:scale-115 transition-transform">
                      {sec.code.substring(0, 3)}
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 px-1.5 py-0.2 rounded bg-rose-400 border border-black/40 text-black text-[8px] font-black font-mono whitespace-nowrap shadow-md pointer-events-none">
                      ALTERNATIVA
                    </div>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-rose-900/70 border border-dashed border-rose-300/70 text-rose-200 text-[9px] font-mono font-bold flex items-center justify-center shadow-md hover:scale-115 transition-transform hover:bg-rose-500/80 hover:text-white">
                    {sec.code.substring(0, 3)}
                  </div>
                )}

                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded bg-neutral-900 text-rose-200 border border-rose-400/50 text-[9px] font-mono whitespace-nowrap shadow-md z-30 pointer-events-none">
                  {sec.isExplicitAlt ? 'Posición Alternativa: ' : 'Alternativa: '}{sec.label}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Botones de Asignación Rápida de Posición */}
      <div
        className={`px-3 py-2.5 border-t text-xs ${
          theme === 'dark' ? 'bg-neutral-950/80 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold flex items-center gap-1">
            <Move className="w-3 h-3 text-red-400" />
            Cambio Rápido de Posición:
          </span>
          <span className="text-[9px] font-mono text-neutral-400">
            {selectedPlayer ? `#${selectedPlayer.dorsal} ${selectedPlayer.nombre}` : 'Selecciona un jugador'}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1">
          {[
            { code: 'POR', label: 'POR', desc: 'Portero' },
            { code: 'LD', label: 'LD', desc: 'Lateral Der.' },
            { code: 'DFC1', label: 'DFC', desc: 'Central' },
            { code: 'LI', label: 'LI', desc: 'Lateral Izq.' },
            { code: 'MCD', label: 'MCD', desc: 'Pivote' },
            { code: 'MC_DCH', label: 'MC', desc: 'Interior' },
            { code: 'MCO', label: 'MCO', desc: 'Mediapunta' },
            { code: 'ED', label: 'ED', desc: 'Extremo Der.' },
            { code: 'DC', label: 'DC', desc: 'Delantero' },
            { code: 'EI', label: 'EI', desc: 'Extremo Izq.' },
          ].map((item) => {
            const isCurrent = primary.code === item.code || (primary.code.startsWith('MC') && item.code.startsWith('MC'));
            return (
              <button
                key={`btn-pos-${item.code}`}
                type="button"
                onClick={() => {
                  const targetPos = TACTICAL_POSITIONS.find((p) => p.code === item.code);
                  if (targetPos) handleAssignPosition(targetPos);
                }}
                disabled={!selectedPlayer}
                className={`px-1.5 py-1 rounded text-[10px] font-mono font-black transition-all cursor-pointer text-center ${
                  isCurrent
                    ? 'bg-red-600 text-white shadow-md ring-1 ring-white'
                    : selectedPlayer
                    ? theme === 'dark'
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700'
                      : 'bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300'
                    : 'opacity-40 cursor-not-allowed bg-neutral-800/30 text-neutral-500'
                }`}
                title={item.desc}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
