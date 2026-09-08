import React from 'react';
import { Player } from '../types';

interface CampogramaProps {
  players: Player[];
  onOpenPlayerModal: (player: Player) => void;
  onEditPlayer?: (player: Player) => void;
  onAddPlayer?: () => void;
}

export const Campograma: React.FC<CampogramaProps> = ({
  players,
  onOpenPlayerModal,
  onEditPlayer,
  onAddPlayer,
}) => {
  return (
    <div id="tab-campo" className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-4">
      {/* Campo Container */}
      <div
        id="campograma"
        className="relative w-full max-w-[420px] h-[580px] sm:h-[620px] mx-auto border-2 border-white rounded-[10px] bg-cover bg-center overflow-hidden shadow-2xl"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000')`,
        }}
      >
        {/* Dark Tactical Overlay */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px]" />

        {/* Tactical Pitch Lines */}
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
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="0.8"
            rx="1"
          />
          <line
            x1="4"
            y1="50"
            x2="96"
            y2="50"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="0.8"
          />
          <circle
            cx="50"
            cy="50"
            r="11"
            fill="none"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="0.8"
          />
          <circle cx="50" cy="50" r="0.9" fill="white" />

          {/* Area Superior */}
          <rect
            x="24"
            y="4"
            width="52"
            height="15"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="0.8"
          />
          <rect
            x="36"
            y="4"
            width="28"
            height="5"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="0.8"
          />

          {/* Area Inferior */}
          <rect
            x="24"
            y="81"
            width="52"
            height="15"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="0.8"
          />
          <rect
            x="36"
            y="91"
            width="28"
            height="5"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="0.8"
          />
          <circle cx="50" cy="88" r="0.9" fill="white" />
        </svg>

        {/* Interactive Player Dots (positioned with left = posicion_x %, top = posicion_y %) */}
        {players.map((j) => {
          // If posicion_x or posicion_y are undefined, fallback safely
          const posX = typeof j.posicion_x === 'number' ? j.posicion_x : 50;
          const posY = typeof j.posicion_y === 'number' ? j.posicion_y : 50;

          return (
            <div
              key={`dot-${j.id || j.dorsal}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer"
              style={{
                left: `${posX}%`,
                top: `${posY}%`,
              }}
              onClick={() => onOpenPlayerModal(j)}
              title={`${j.nombre} (#${j.dorsal})`}
            >
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 bg-black text-white border-2 border-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm font-mono shadow-[0_0_10px_rgba(255,255,255,0.4)] group-hover:bg-white group-hover:text-black group-hover:scale-115 transition-all"
              >
                {j.dorsal}
              </div>

              {/* Name pill on hover */}
              <span className="mt-1 px-1.5 py-0.5 bg-black/90 border border-neutral-700 text-white font-mono text-[10px] rounded whitespace-nowrap opacity-90 group-hover:opacity-100 group-hover:border-white transition-opacity">
                {j.nombre.split(' ').pop()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Helpful legend & bottom action */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-[420px] text-xs font-mono text-neutral-400 pt-1">
        <div>
          Total en campo: <strong className="text-white">{players.length}</strong> futbolistas
        </div>
        {onAddPlayer && (
          <button
            type="button"
            onClick={onAddPlayer}
            className="text-white border border-neutral-700 hover:border-white px-2.5 py-1 text-[11px] font-bold uppercase transition-colors"
          >
            + Añadir a pizarra
          </button>
        )}
      </div>
    </div>
  );
};
