import React from 'react';
import { Player } from '../types';
import { useTheme } from '../context/ThemeContext';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  player,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { theme } = useTheme();

  if (!isOpen || !player) return null;

  return (
    <div
      id="modal-eliminar-jugador"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`border-2 w-full max-w-sm p-6 shadow-2xl relative font-sans transition-colors ${
          theme === 'dark'
            ? 'bg-[#111111] border-white text-white'
            : 'bg-white border-black text-neutral-900 shadow-neutral-500/30'
        }`}
        role="dialog"
      >
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 right-4 transition-colors cursor-pointer ${
            theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-black'
          }`}
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${
              theme === 'dark' ? 'border-white bg-black text-white' : 'border-black bg-white text-black'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tight text-base">¿Eliminar Jugador?</h3>
            <p className="text-xs font-mono text-neutral-400">Acción permanente</p>
          </div>
        </div>

        <div
          className={`p-3 border mb-5 font-mono text-xs space-y-1.5 ${
            theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase">Futbolista:</span>
            <span className="font-black text-sm">#{player.dorsal} {player.nombre}</span>
          </div>
          <div className="flex items-center justify-between text-neutral-400">
            <span>Posición:</span>
            <span>{player.posicion || 'Futbolista'}</span>
          </div>
        </div>

        <p className="text-xs text-neutral-400 mb-6 font-mono leading-relaxed">
          ¿Confirmas que deseas retirar a <strong>{player.nombre}</strong> de la plantilla oficial de la SD Gernika? Se actualizará la base de datos inmediatamente.
        </p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full py-2.5 font-mono text-xs font-black uppercase tracking-wider border-2 bg-black text-white border-white hover:bg-neutral-900 cursor-pointer flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Confirmar y Eliminar</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`w-full py-2 font-mono text-xs uppercase tracking-wider font-bold border transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'border-neutral-800 hover:border-white text-neutral-300 hover:text-white'
                : 'border-neutral-300 hover:border-black text-neutral-700 hover:text-black'
            }`}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
