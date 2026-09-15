import React, { useState } from 'react';
import { Player } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Users, Shield, ArrowRightLeft } from 'lucide-react';

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
  const { theme } = useTheme();
  const [selectedSub, setSelectedSub] = useState<Player | null>(null);

  // Filter the Starting Eleven (Último Once Titular 25-26)
  // If no player has esTitular, fall back to first 11
  const startingEleven = React.useMemo(() => {
    const titulares = players.filter((p) => p.esTitular);
    if (titulares.length === 11) return titulares;
    if (titulares.length > 0 && titulares.length <= 11) return titulares;
    return players.slice(0, 11);
  }, [players]);

  // Substitutes / Bench
  const substitutes = React.useMemo(() => {
    const titularIds = new Set(startingEleven.map((p) => p.id || p.dorsal));
    return players.filter((p) => !titularIds.has(p.id || p.dorsal));
  }, [players, startingEleven]);

  return (
    <div id="tab-campo" className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-4">
      {/* Tactical Header Badge */}
      <div className="w-full max-w-[440px] flex items-center justify-between px-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              theme === 'dark'
                ? 'bg-neutral-900 border border-neutral-700 text-white'
                : 'bg-neutral-200 border border-neutral-300 text-black'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            4-3-3 • Último Once 25-26
          </span>
          <span
            className={`text-[11px] font-semibold ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            {startingEleven.length} titulares
          </span>
        </div>

        <span
          className={`text-[11px] font-semibold ${
            theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
          }`}
        >
          {substitutes.length} en banquillo
        </span>
      </div>

      {/* Campo Container */}
      <div
        id="campograma"
        className={`relative w-full max-w-[430px] h-[580px] sm:h-[620px] mx-auto border-2 rounded-[12px] bg-cover bg-center overflow-hidden shadow-2xl transition-colors ${
          theme === 'dark' ? 'border-white' : 'border-neutral-900 shadow-neutral-400/50'
        }`}
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000')`,
        }}
      >
        {/* Tactical Dark Pitch Overlay */}
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

        {/* Interactive Player Dots (Starting Eleven on the pitch) */}
        {startingEleven.map((j) => {
          const posX = typeof j.posicion_x === 'number' ? j.posicion_x : 50;
          const posY = typeof j.posicion_y === 'number' ? j.posicion_y : 50;

          return (
            <div
              key={`dot-${j.id || j.dorsal}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer select-none"
              style={{
                left: `${posX}%`,
                top: `${posY}%`,
              }}
              onClick={() => onOpenPlayerModal(j)}
              title={`${j.nombre} (#${j.dorsal}) - ${j.posicion || ''}`}
            >
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm font-mono transition-all group-hover:scale-115 shadow-lg ${
                  theme === 'dark'
                    ? 'bg-black text-white border-2 border-white shadow-[0_0_12px_rgba(255,255,255,0.5)] group-hover:bg-white group-hover:text-black'
                    : 'bg-white text-black border-2 border-black font-black shadow-md group-hover:bg-black group-hover:text-white'
                }`}
              >
                {j.dorsal}
              </div>

              {/* Name pill */}
              <span
                className={`mt-1 px-1.5 py-0.5 font-mono text-[10px] rounded whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity ${
                  theme === 'dark'
                    ? 'bg-black/90 border border-neutral-700 text-white group-hover:border-white'
                    : 'bg-white/95 border border-neutral-400 text-black shadow-xs font-semibold group-hover:border-black'
                }`}
              >
                {j.nombre.split(' ').pop()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bench / Substitutes Section */}
      {substitutes.length > 0 && (
        <div
          className={`w-full max-w-[430px] p-3 rounded-lg border text-xs transition-colors ${
            theme === 'dark'
              ? 'bg-neutral-950 border-neutral-800'
              : 'bg-neutral-50 border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`font-mono font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 ${
                theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Banquillo • SD Gernika 25-26 ({substitutes.length})
            </span>
            <span
              className={`text-[10px] ${
                theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'
              }`}
            >
              Haz clic para ver ficha
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {substitutes.map((sub) => (
              <button
                key={`sub-${sub.id || sub.dorsal}`}
                type="button"
                onClick={() => onOpenPlayerModal(sub)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded border font-mono text-[11px] transition-all hover:scale-102 ${
                  theme === 'dark'
                    ? 'bg-neutral-900 border-neutral-700 text-neutral-200 hover:border-white hover:text-white'
                    : 'bg-white border-neutral-300 text-neutral-800 hover:border-black hover:text-black shadow-2xs'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] ${
                    theme === 'dark' ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-black'
                  }`}
                >
                  {sub.dorsal}
                </span>
                <span className="truncate max-w-[100px]">{sub.nombre.split(' ').pop()}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Helpful bottom actions */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 w-full max-w-[430px] text-xs font-mono pt-1 transition-colors ${
          theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
        }`}
      >
        <div>
          Total plantilla 25-26:{' '}
          <strong className={theme === 'dark' ? 'text-white' : 'text-black'}>
            {players.length}
          </strong>{' '}
          futbolistas
        </div>
        {onAddPlayer && (
          <button
            type="button"
            onClick={onAddPlayer}
            className={`px-2.5 py-1 text-[11px] font-bold uppercase transition-colors border ${
              theme === 'dark'
                ? 'text-white border-neutral-700 hover:border-white hover:bg-neutral-900'
                : 'text-black border-neutral-400 hover:border-black bg-white hover:bg-neutral-100 shadow-xs'
            }`}
          >
            + Añadir futbolista
          </button>
        )}
      </div>
    </div>
  );
};
