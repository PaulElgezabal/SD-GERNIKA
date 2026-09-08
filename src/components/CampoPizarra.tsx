import React, { useState, useRef } from 'react';
import { Player } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Shield,
  Users,
  Move,
  RotateCcw,
  Save,
  Check,
  Search,
  Plus,
  Minus,
  Sparkles,
  Info,
} from 'lucide-react';

interface CampoPizarraProps {
  players: Player[];
  onUpdatePlayerPosition: (id: string | number, posX: number, posY: number) => void;
  onOpenPlayerModal: (player: Player) => void;
  onSaveFormation?: (players: Player[]) => void;
}

export const CampoPizarra: React.FC<CampoPizarraProps> = ({
  players,
  onUpdatePlayerPosition,
  onOpenPlayerModal,
  onSaveFormation,
}) => {
  const { theme } = useTheme();
  const pitchRef = useRef<HTMLDivElement | null>(null);

  // Player selected from the list to place onto the pitch
  const [selectedToPlace, setSelectedToPlace] = useState<Player | null>(null);

  // Player being dragged on the pitch
  const [draggingPlayerId, setDraggingPlayerId] = useState<string | number | null>(null);

  // Search filter for the player sidebar list
  const [searchTerm, setSearchTerm] = useState('');
  const [listFilter, setListFilter] = useState<'all' | 'campo' | 'banquillo'>('all');

  // Status message
  const [tacticalMessage, setTacticalMessage] = useState<string | null>(null);

  // Determine players currently on the pitch (either marked as titular or within the 11 in pitch)
  const playersOnPitch = players.filter((p) => {
    if (typeof p.enCampo === 'boolean') return p.enCampo;
    return p.esTitular ?? false;
  });

  const playersOnBench = players.filter((p) => {
    if (typeof p.enCampo === 'boolean') return !p.enCampo;
    return !p.esTitular;
  });

  const filteredList = players.filter((p) => {
    const isEnCampo = playersOnPitch.some((op) => op.id === p.id);
    if (listFilter === 'campo' && !isEnCampo) return false;
    if (listFilter === 'banquillo' && isEnCampo) return false;

    const q = searchTerm.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(q) ||
      String(p.dorsal).includes(q) ||
      (p.posicion && p.posicion.toLowerCase().includes(q))
    );
  });

  const showNotification = (msg: string) => {
    setTacticalMessage(msg);
    setTimeout(() => setTacticalMessage(null), 3000);
  };

  // Click on pitch to place the currently selected player
  const handlePitchClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pitchRef.current) return;
    const rect = pitchRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(5, Math.min(95, Math.round(x)));
    const clampedY = Math.max(5, Math.min(95, Math.round(y)));

    if (selectedToPlace) {
      onUpdatePlayerPosition(selectedToPlace.id, clampedX, clampedY);
      showNotification(`${selectedToPlace.nombre} situado en (${clampedX}%, ${clampedY}%)`);
      setSelectedToPlace(null);
    }
  };

  // Dragging handlers for fine-tuning player positions on the pitch
  const handleDragStart = (playerId: string | number) => {
    setDraggingPlayerId(playerId);
  };

  const handlePitchMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingPlayerId || !pitchRef.current) return;
    const rect = pitchRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(5, Math.min(95, Math.round(x)));
    const clampedY = Math.max(5, Math.min(95, Math.round(y)));

    onUpdatePlayerPosition(draggingPlayerId, clampedX, clampedY);
  };

  const handlePitchMouseUp = () => {
    if (draggingPlayerId) {
      setDraggingPlayerId(null);
      showNotification('Posición táctica actualizada');
    }
  };

  // Toggle player on/off pitch
  const handleToggleOnPitch = (player: Player) => {
    const isCurrentlyOnPitch = playersOnPitch.some((p) => p.id === player.id);
    if (isCurrentlyOnPitch) {
      // Move to bench by setting off-pitch
      onUpdatePlayerPosition(player.id, -1, -1);
      showNotification(`${player.nombre} enviado al banquillo`);
    } else {
      // Put on pitch at default tactical location
      const defaultY = player.posicion_y && player.posicion_y > 0 ? player.posicion_y : 50;
      const defaultX = player.posicion_x && player.posicion_x > 0 ? player.posicion_x : 50;
      onUpdatePlayerPosition(player.id, defaultX, defaultY);
      showNotification(`${player.nombre} situado en el terreno`);
    }
  };

  // Preset Formations
  const applyFormation = (formationName: '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1') => {
    // Take the 11 players currently on pitch or the first 11
    const targetPlayers = playersOnPitch.length >= 11 ? playersOnPitch.slice(0, 11) : players.slice(0, 11);

    const formations: Record<string, Array<{ x: number; y: number }>> = {
      '4-3-3': [
        { x: 50, y: 90 }, // Portero
        { x: 80, y: 72 }, // LD
        { x: 60, y: 76 }, // DFC
        { x: 40, y: 76 }, // DFC
        { x: 20, y: 72 }, // LI
        { x: 50, y: 55 }, // MCD
        { x: 68, y: 44 }, // MC
        { x: 32, y: 44 }, // MC
        { x: 80, y: 22 }, // ED
        { x: 50, y: 16 }, // DC
        { x: 20, y: 22 }, // EI
      ],
      '4-4-2': [
        { x: 50, y: 90 }, // Portero
        { x: 80, y: 72 }, // LD
        { x: 60, y: 76 }, // DFC
        { x: 40, y: 76 }, // DFC
        { x: 20, y: 72 }, // LI
        { x: 80, y: 46 }, // MD
        { x: 60, y: 50 }, // MC
        { x: 40, y: 50 }, // MC
        { x: 20, y: 46 }, // MI
        { x: 60, y: 20 }, // DC
        { x: 40, y: 20 }, // DC
      ],
      '3-5-2': [
        { x: 50, y: 90 }, // Portero
        { x: 70, y: 75 }, // DFC
        { x: 50, y: 77 }, // DFC
        { x: 30, y: 75 }, // DFC
        { x: 86, y: 48 }, // Carrilero Der
        { x: 62, y: 54 }, // MC
        { x: 50, y: 42 }, // MP
        { x: 38, y: 54 }, // MC
        { x: 14, y: 48 }, // Carrilero Izq
        { x: 60, y: 18 }, // DC
        { x: 40, y: 18 }, // DC
      ],
      '4-2-3-1': [
        { x: 50, y: 90 }, // Portero
        { x: 80, y: 72 }, // LD
        { x: 60, y: 76 }, // DFC
        { x: 40, y: 76 }, // DFC
        { x: 20, y: 72 }, // LI
        { x: 62, y: 58 }, // MCD
        { x: 38, y: 58 }, // MCD
        { x: 80, y: 35 }, // ED
        { x: 50, y: 32 }, // MP
        { x: 20, y: 35 }, // EI
        { x: 50, y: 16 }, // DC
      ],
    };

    const coords = formations[formationName];
    targetPlayers.forEach((p, idx) => {
      if (coords[idx]) {
        onUpdatePlayerPosition(p.id, coords[idx].x, coords[idx].y);
      }
    });

    showNotification(`Formación ${formationName} aplicada a los titulares`);
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Banner & Quick Formations */}
      <div
        className={`p-4 border transition-colors flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${
          theme === 'dark' ? 'bg-[#111111] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-md flex items-center justify-center font-bold ${
              theme === 'dark' ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-black'
            }`}
          >
            <Shield className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h2
              className={`font-black text-sm uppercase tracking-wider ${
                theme === 'dark' ? 'text-white' : 'text-neutral-900'
              }`}
            >
              Pizarra Táctica • SD Gernika Club
            </h2>
            <p
              className={`text-xs font-mono ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              Haz clic en un jugador del listado para situarlo o arrástralo sobre el césped.
            </p>
          </div>
        </div>

        {/* Formation Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <span
            className={`text-[11px] font-bold uppercase mr-1 ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
            }`}
          >
            Sistemas:
          </span>
          {(['4-3-3', '4-4-2', '3-5-2', '4-2-3-1'] as const).map((form) => (
            <button
              key={form}
              type="button"
              onClick={() => applyFormation(form)}
              className={`px-2.5 py-1 rounded border text-xs font-bold transition-all ${
                theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-700 text-neutral-200 hover:border-white hover:text-white'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:border-black hover:text-black'
              }`}
            >
              {form}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tactical Workspace: Pitch (Left/Center) + Player List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Pitch Container */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center">
          {/* Pitch Status Indicator */}
          <div className="w-full flex items-center justify-between mb-2 px-1 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded font-bold uppercase ${
                  playersOnPitch.length === 11
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {playersOnPitch.length}/11 en campo
              </span>
              {selectedToPlace && (
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded animate-pulse">
                  👉 Haz clic en el césped para colocar a #{selectedToPlace.dorsal} {selectedToPlace.nombre.split(' ').pop()}
                </span>
              )}
            </div>

            {tacticalMessage && (
              <span className="text-emerald-400 text-[11px] font-semibold">
                ✓ {tacticalMessage}
              </span>
            )}
          </div>

          {/* Interactive Tactical Pitch */}
          <div
            ref={pitchRef}
            id="campo-pizarra"
            onClick={handlePitchClick}
            onMouseMove={handlePitchMouseMove}
            onMouseUp={handlePitchMouseUp}
            className={`relative w-full max-w-[500px] h-[640px] sm:h-[680px] mx-auto border-2 rounded-[14px] bg-cover bg-center overflow-hidden shadow-2xl select-none cursor-crosshair transition-colors ${
              theme === 'dark' ? 'border-white' : 'border-neutral-900 shadow-neutral-400/50'
            } ${selectedToPlace ? 'ring-4 ring-blue-500/60' : ''}`}
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000')`,
            }}
          >
            {/* Pitch Dark Overlay */}
            <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px] pointer-events-none" />

            {/* Tactical Lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <rect
                x="4"
                y="4"
                width="92"
                height="92"
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="0.8"
                rx="1"
              />
              <line
                x1="4"
                y1="50"
                x2="96"
                y2="50"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="0.8"
              />
              <circle
                cx="50"
                cy="50"
                r="11"
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="0.8"
              />
              <circle cx="50" cy="50" r="0.9" fill="white" />

              {/* Area Rival (Arriba) */}
              <rect
                x="24"
                y="4"
                width="52"
                height="15"
                fill="none"
                stroke="rgba(255,255,255,0.65)"
                strokeWidth="0.8"
              />
              <rect
                x="36"
                y="4"
                width="28"
                height="5"
                fill="none"
                stroke="rgba(255,255,255,0.65)"
                strokeWidth="0.8"
              />

              {/* Area Propia (Abajo) */}
              <rect
                x="24"
                y="81"
                width="52"
                height="15"
                fill="none"
                stroke="rgba(255,255,255,0.65)"
                strokeWidth="0.8"
              />
              <rect
                x="36"
                y="91"
                width="28"
                height="5"
                fill="none"
                stroke="rgba(255,255,255,0.65)"
                strokeWidth="0.8"
              />
              <circle cx="50" cy="88" r="0.9" fill="white" />
            </svg>

            {/* Interactive Player Pins on the Pitch */}
            {playersOnPitch.map((p) => {
              const posX = typeof p.posicion_x === 'number' && p.posicion_x > 0 ? p.posicion_x : 50;
              const posY = typeof p.posicion_y === 'number' && p.posicion_y > 0 ? p.posicion_y : 50;

              return (
                <div
                  key={`pitch-player-${p.id}`}
                  style={{ left: `${posX}%`, top: `${posY}%` }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleDragStart(p.id);
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group cursor-grab active:cursor-grabbing select-none"
                  title={`${p.nombre} (#${p.dorsal}) - Arrastra para mover o doble clic para ver ficha`}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onOpenPlayerModal(p);
                  }}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs font-mono shadow-xl transition-transform group-hover:scale-115 ${
                      theme === 'dark'
                        ? 'bg-black text-white border-2 border-white shadow-[0_0_12px_rgba(255,255,255,0.6)]'
                        : 'bg-white text-black border-2 border-black font-black shadow-md'
                    }`}
                  >
                    {p.dorsal}
                  </div>

                  {/* Name Tag */}
                  <span
                    className={`mt-1 px-1.5 py-0.5 font-mono text-[10px] rounded whitespace-nowrap shadow-md transition-opacity ${
                      theme === 'dark'
                        ? 'bg-black/90 border border-neutral-700 text-white group-hover:border-white'
                        : 'bg-white/95 border border-neutral-400 text-black font-semibold group-hover:border-black'
                    }`}
                  >
                    {p.nombre.split(' ').pop()}
                  </span>
                </div>
              );
            })}
          </div>

          <div
            className={`mt-2 text-center text-xs font-mono ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            Arrastra los dorsales para calibrar posiciones • Doble clic para abrir ficha técnica
          </div>
        </div>

        {/* Right Sidebar: Player List to Place & Manage */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-3">
          <div
            className={`p-4 border transition-colors ${
              theme === 'dark' ? 'bg-[#111111] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3
                className={`font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 ${
                  theme === 'dark' ? 'text-white' : 'text-neutral-900'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-500" />
                Plantilla para Situar
              </h3>
              <span
                className={`text-[11px] font-mono ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                {players.length} jugadores
              </span>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search
                className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                  theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                }`}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por dorsal, nombre..."
                className={`w-full pl-8 pr-3 py-1.5 text-xs font-mono border transition-colors focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-black border-neutral-700 text-white focus:border-white'
                    : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
                }`}
              />
            </div>

            {/* Filter Tabs: Todos / En campo / Banquillo */}
            <div className="flex items-center gap-1 mb-3 text-[11px] font-mono border-b pb-2 border-neutral-800">
              <button
                type="button"
                onClick={() => setListFilter('all')}
                className={`px-2 py-1 rounded transition-colors ${
                  listFilter === 'all'
                    ? theme === 'dark'
                      ? 'bg-white text-black font-bold'
                      : 'bg-black text-white font-bold'
                    : theme === 'dark'
                    ? 'text-neutral-400 hover:text-white'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                Todos ({players.length})
              </button>
              <button
                type="button"
                onClick={() => setListFilter('campo')}
                className={`px-2 py-1 rounded transition-colors ${
                  listFilter === 'campo'
                    ? 'bg-emerald-600 text-white font-bold'
                    : theme === 'dark'
                    ? 'text-neutral-400 hover:text-emerald-400'
                    : 'text-neutral-600 hover:text-emerald-600'
                }`}
              >
                En Campo ({playersOnPitch.length})
              </button>
              <button
                type="button"
                onClick={() => setListFilter('banquillo')}
                className={`px-2 py-1 rounded transition-colors ${
                  listFilter === 'banquillo'
                    ? theme === 'dark'
                      ? 'bg-neutral-700 text-white font-bold'
                      : 'bg-neutral-800 text-white font-bold'
                    : theme === 'dark'
                    ? 'text-neutral-400 hover:text-white'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                Banquillo ({playersOnBench.length})
              </button>
            </div>

            {/* Instruction Tip */}
            <div
              className={`p-2.5 rounded border text-[11px] font-mono mb-3 flex items-start gap-2 ${
                theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-300'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700'
              }`}
            >
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Haz clic en <strong>"Situar"</strong> en cualquier jugador y luego pulsa en el campo donde deseas colocarlo.
              </span>
            </div>

            {/* Player Cards Scrollable List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredList.map((j) => {
                const isEnCampo = playersOnPitch.some((p) => p.id === j.id);
                const isSelected = selectedToPlace?.id === j.id;

                return (
                  <div
                    key={`list-item-${j.id}`}
                    className={`p-2.5 border rounded flex items-center justify-between gap-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950/30'
                        : isEnCampo
                        ? theme === 'dark'
                          ? 'border-emerald-800/60 bg-emerald-950/20'
                          : 'border-emerald-300 bg-emerald-50/50'
                        : theme === 'dark'
                        ? 'border-neutral-800 bg-black hover:border-neutral-700'
                        : 'border-neutral-200 bg-white hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                          isEnCampo
                            ? 'bg-emerald-600 text-white'
                            : theme === 'dark'
                            ? 'bg-neutral-800 text-neutral-300'
                            : 'bg-neutral-200 text-neutral-800'
                        }`}
                      >
                        {j.dorsal}
                      </div>

                      <div className="min-w-0">
                        <div
                          className={`font-bold text-xs truncate ${
                            theme === 'dark' ? 'text-white' : 'text-neutral-900'
                          }`}
                        >
                          {j.nombre}
                        </div>
                        <div
                          className={`text-[10px] font-mono flex items-center gap-1.5 ${
                            theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                          }`}
                        >
                          <span>{j.posicion || 'Futbolista'}</span>
                          {isEnCampo && (
                            <span className="text-emerald-400 font-bold">• En Campo</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedToPlace(null);
                          } else {
                            setSelectedToPlace(j);
                            showNotification(`Seleccionado #${j.dorsal} ${j.nombre}. Haz clic en el campo.`);
                          }
                        }}
                        className={`px-2 py-1 text-[10px] font-mono font-bold uppercase rounded border transition-colors ${
                          isSelected
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : theme === 'dark'
                            ? 'bg-neutral-900 border-neutral-700 text-neutral-200 hover:border-white'
                            : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:border-black'
                        }`}
                        title="Situar en posición exacta"
                      >
                        {isSelected ? 'Colocando...' : 'Situar'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleOnPitch(j)}
                        className={`p-1 text-[10px] rounded border transition-colors ${
                          isEnCampo
                            ? 'text-amber-400 border-amber-800/60 hover:bg-amber-950/40'
                            : 'text-emerald-400 border-emerald-800/60 hover:bg-emerald-950/40'
                        }`}
                        title={isEnCampo ? 'Quitar del campo' : 'Añadir al campo'}
                      >
                        {isEnCampo ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
