import React from 'react';
import { Player } from '../types';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="modal-ficha"
        className="bg-[#111111] border-2 border-white text-white w-full max-w-sm p-6 shadow-2xl relative font-sans"
        role="dialog"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
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
            className="w-24 h-24 rounded-full object-cover border-2 border-white bg-black block"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://via.placeholder.com/100?text=SDG';
            }}
          />
        </div>

        {/* Player Name and Info */}
        <h2 id="f-nombre" className="text-xl font-black text-center text-white mb-1 uppercase tracking-tight">
          {player.nombre}
        </h2>
        <p id="f-info" className="text-xs font-mono text-center text-neutral-400 mb-4">
          Dorsal {player.dorsal} | {player.lateralidad} | {player.nacimiento}
        </p>

        {/* Contact Info (Teléfono & Correo) */}
        <div className="mb-5 p-3 bg-black border border-neutral-800 rounded space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-neutral-300">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <Phone className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Teléfono:</span>
            </span>
            {player.telefono ? (
              <a
                href={`tel:${player.telefono}`}
                className="text-white hover:underline font-bold"
              >
                {player.telefono}
              </a>
            ) : (
              <span className="text-neutral-500 italic">No asignado</span>
            )}
          </div>

          <div className="flex items-center justify-between text-neutral-300">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <Mail className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Correo:</span>
            </span>
            {player.email || player.correo ? (
              <a
                href={`mailto:${player.email || player.correo}`}
                className="text-white hover:underline truncate max-w-[190px]"
                title={player.email || player.correo}
              >
                {player.email || player.correo}
              </a>
            ) : (
              <span className="text-neutral-500 italic">No asignado</span>
            )}
          </div>
        </div>

        {/* Performance Stats Bars */}
        <div className="space-y-4 font-mono text-xs">
          <div>
            <div className="flex justify-between text-neutral-300 mb-1">
              <label className="font-bold uppercase">Técnica</label>
              <span>{tec} / 5 ({tec * 20}%)</span>
            </div>
            <div className="bg-[#333333] h-2.5 w-full rounded-full overflow-hidden">
              <div
                id="bar-tecnica"
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${tec * 20}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-neutral-300 mb-1">
              <label className="font-bold uppercase">Táctica</label>
              <span>{tac} / 5 ({tac * 20}%)</span>
            </div>
            <div className="bg-[#333333] h-2.5 w-full rounded-full overflow-hidden">
              <div
                id="bar-tactica"
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${tac * 20}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-neutral-300 mb-1">
              <label className="font-bold uppercase">Condicional</label>
              <span>{con} / 5 ({con * 20}%)</span>
            </div>
            <div className="bg-[#333333] h-2.5 w-full rounded-full overflow-hidden">
              <div
                id="bar-condicional"
                className="bg-white h-full rounded-full transition-all duration-300"
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
              className="w-full py-2 bg-neutral-900 border border-neutral-700 hover:border-white text-white font-mono text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editar Datos y Notas
            </button>
          )}

          <button
            type="button"
            className="w-full py-2.5 bg-white text-black font-black uppercase tracking-wider font-mono text-xs border-2 border-white hover:bg-black hover:text-white transition-all cursor-pointer"
            onClick={onClose}
          >
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
};
