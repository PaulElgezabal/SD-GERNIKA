import React from 'react';
import { Player } from '../types';
import { useTheme } from '../context/ThemeContext';
import { X, Edit3, Award, Phone, Mail } from 'lucide-react';

interface FichaModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (player: Player) => void;
}

export const FichaModal: React.FC<FichaModalProps> = ({
  player,
  isOpen,
  onClose,
  onEdit,
}) => {
  const { theme } = useTheme();
  if (!isOpen || !player) return null;

  const photo =
    player.foto_url ||
    player.fotoUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';

  const tec = player.tecnica ?? 0;
  const tac = player.tactica ?? 0;
  const con = player.condicional ?? 0;

  return (
    <div
      id="overlay-ficha"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="modal-ficha"
        className={`border-2 w-full max-w-sm p-6 shadow-2xl relative font-sans transition-colors ${
          theme === 'dark'
            ? 'bg-[#111111] border-white text-white'
            : 'bg-white border-black text-neutral-900 shadow-neutral-500/30'
        }`}
        role="dialog"
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 transition-colors ${
            theme === 'dark'
              ? 'text-neutral-400 hover:text-white'
              : 'text-neutral-500 hover:text-black'
          }`}
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Circular Player Photo */}
        <div className="flex justify-center mb-4">
          <img
            id="f-foto"
            src={player.foto_url || player.fotoUrl || ''}
            alt={player.nombre}
            className={`w-24 h-24 rounded-full object-cover border-2 block ${
              theme === 'dark' ? 'border-white bg-black' : 'border-black bg-neutral-100'
            }`}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://via.placeholder.com/100?text=SDG';
            }}
          />
        </div>

        {/* Player Name and Info */}
        <h2
          id="f-nombre"
          className={`text-xl font-black text-center mb-1 uppercase tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-neutral-900'
          }`}
        >
          {player.nombre}
        </h2>
        <div className="flex items-center justify-center gap-2 mb-2">
          {player.esTitular ? (
            <span
              className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded ${
                theme === 'dark'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              ★ 11 Titular 25-26
            </span>
          ) : (
            <span
              className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded ${
                theme === 'dark'
                  ? 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                  : 'bg-neutral-100 text-neutral-600 border border-neutral-300'
              }`}
            >
              Banquillo
            </span>
          )}
          <span
            className={`text-xs font-mono font-semibold ${
              theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
            }`}
          >
            {player.posicion || 'Futbolista'}
          </span>
        </div>
        <p
          id="f-info"
          className={`text-xs font-mono text-center mb-4 ${
            theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
          }`}
        >
          Dorsal {player.dorsal} | {player.lateralidad} | {player.nacimiento}
        </p>

        {/* Contact Info (Teléfono & Correo) */}
        <div
          className={`mb-5 p-3 rounded space-y-2 font-mono text-xs border transition-colors ${
            theme === 'dark'
              ? 'bg-black border-neutral-800 text-neutral-300'
              : 'bg-neutral-50 border-neutral-200 text-neutral-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`flex items-center gap-1.5 ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              <Phone
                className={`w-3.5 h-3.5 shrink-0 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}
              />
              <span>Teléfono:</span>
            </span>
            {player.telefono ? (
              <a
                href={`tel:${player.telefono}`}
                className={`font-bold hover:underline ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}
              >
                {player.telefono}
              </a>
            ) : (
              <span
                className={`italic ${
                  theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                }`}
              >
                No asignado
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span
              className={`flex items-center gap-1.5 ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              <Mail
                className={`w-3.5 h-3.5 shrink-0 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}
              />
              <span>Correo:</span>
            </span>
            {player.email || player.correo ? (
              <a
                href={`mailto:${player.email || player.correo}`}
                className={`truncate max-w-[190px] font-bold hover:underline ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}
                title={player.email || player.correo}
              >
                {player.email || player.correo}
              </a>
            ) : (
              <span
                className={`italic ${
                  theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                }`}
              >
                No asignado
              </span>
            )}
          </div>
        </div>

        {/* Performance Stats Bars */}
        <div className="space-y-4 font-mono text-xs">
          <div>
            <div
              className={`flex justify-between mb-1 ${
                theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
              }`}
            >
              <label className="font-bold uppercase">Técnica</label>
              <span>{tec} / 5 ({tec * 20}%)</span>
            </div>
            <div
              className={`h-2.5 w-full rounded-full overflow-hidden ${
                theme === 'dark' ? 'bg-[#333333]' : 'bg-neutral-200'
              }`}
            >
              <div
                id="bar-tecnica"
                className={`h-full rounded-full transition-all duration-300 ${
                  theme === 'dark' ? 'bg-white' : 'bg-black'
                }`}
                style={{ width: `${tec * 20}%` }}
              />
            </div>
          </div>

          <div>
            <div
              className={`flex justify-between mb-1 ${
                theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
              }`}
            >
              <label className="font-bold uppercase">Táctica</label>
              <span>{tac} / 5 ({tac * 20}%)</span>
            </div>
            <div
              className={`h-2.5 w-full rounded-full overflow-hidden ${
                theme === 'dark' ? 'bg-[#333333]' : 'bg-neutral-200'
              }`}
            >
              <div
                id="bar-tactica"
                className={`h-full rounded-full transition-all duration-300 ${
                  theme === 'dark' ? 'bg-white' : 'bg-black'
                }`}
                style={{ width: `${tac * 20}%` }}
              />
            </div>
          </div>

          <div>
            <div
              className={`flex justify-between mb-1 ${
                theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
              }`}
            >
              <label className="font-bold uppercase">Condicional</label>
              <span>{con} / 5 ({con * 20}%)</span>
            </div>
            <div
              className={`h-2.5 w-full rounded-full overflow-hidden ${
                theme === 'dark' ? 'bg-[#333333]' : 'bg-neutral-200'
              }`}
            >
              <div
                id="bar-condicional"
                className={`h-full rounded-full transition-all duration-300 ${
                  theme === 'dark' ? 'bg-white' : 'bg-black'
                }`}
                style={{ width: `${con * 20}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-2">
          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(player);
              }}
              className={`w-full py-2 font-mono text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-1.5 border cursor-pointer ${
                theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-700 hover:border-white text-white'
                  : 'bg-neutral-100 border-neutral-300 hover:border-black text-black'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editar Datos y Notas
            </button>
          )}

          <button
            type="button"
            className={`w-full py-2.5 font-black uppercase tracking-wider font-mono text-xs border-2 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-white text-black border-white hover:bg-black hover:text-white'
                : 'bg-black text-white border-black hover:bg-white hover:text-black shadow-md'
            }`}
            onClick={onClose}
          >
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
};
