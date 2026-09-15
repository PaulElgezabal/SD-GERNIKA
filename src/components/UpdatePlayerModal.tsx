import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { X, Check, Trash2, ArrowRight } from 'lucide-react';

interface UpdatePlayerModalProps {
  player: Player | null;
  darkMode: boolean;
  onClose: () => void;
  onSave: (updated: Player) => void;
}

export const UpdatePlayerModal: React.FC<UpdatePlayerModalProps> = ({
  player,
  darkMode,
  onClose,
  onSave,
}) => {
  if (!player) return null;

  const [tecnica, setTecnica] = useState<number | null>(player.tecnica);
  const [tactica, setTactica] = useState<number | null>(player.tactica);
  const [condicional, setCondicional] = useState<number | null>(player.condicional);

  useEffect(() => {
    setTecnica(player.tecnica);
    setTactica(player.tactica);
    setCondicional(player.condicional);
  }, [player]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...player,
      tecnica,
      tactica,
      condicional,
    });
  };

  const handleClearAll = () => {
    setTecnica(null);
    setTactica(null);
    setCondicional(null);
  };

  const commandPreview = `Actualiza a ${player.nombre}: Técnica ${tecnica ?? '—'}, Táctica ${
    tactica ?? '—'
  }, Condicional ${condicional ?? '—'}`;

  const renderRatingSelector = (
    label: string,
    description: string,
    value: number | null,
    onChange: (val: number | null) => void
  ) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-mono">
        <div>
          <span className="font-bold uppercase tracking-wider">{label}</span>
          <span className="text-neutral-500 ml-1.5">({description})</span>
        </div>
        <span
          className={`font-bold px-2 py-0.5 border text-xs ${
            value !== null
              ? darkMode
                ? 'border-white bg-white text-black'
                : 'border-black bg-black text-white'
              : 'border-neutral-700 text-neutral-500'
          }`}
        >
          {value !== null ? `${value} / 5` : '— (Sin evaluar)'}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange(null)}
          className={`px-2.5 py-1.5 text-xs font-mono border transition-all cursor-pointer ${
            value === null
              ? darkMode
                ? 'border-white bg-neutral-800 text-white font-bold'
                : 'border-black bg-neutral-200 text-black font-bold'
              : darkMode
              ? 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
              : 'border-neutral-300 text-neutral-500 hover:text-black'
          }`}
          title="Sin evaluar (—)"
        >
          —
        </button>

        {[1, 2, 3, 4, 5].map((score) => {
          const isSelected = value === score;
          return (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              className={`flex-1 py-1.5 text-xs font-mono font-bold border transition-all cursor-pointer ${
                isSelected
                  ? darkMode
                    ? 'border-white bg-white text-black shadow'
                    : 'border-black bg-black text-white shadow'
                  : darkMode
                  ? 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-600'
                  : 'border-neutral-300 bg-white text-neutral-800 hover:border-black'
              }`}
            >
              {score}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div
        className={`w-full max-w-lg border shadow-2xl transition-colors ${
          darkMode ? 'bg-neutral-950 border-neutral-700 text-white' : 'bg-white border-black text-black'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-3.5 border-b flex items-center justify-between ${
            darkMode ? 'border-neutral-800 bg-black' : 'border-neutral-200 bg-neutral-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>🔳</span>
            <span className="font-mono text-xs sm:text-sm font-bold tracking-wider uppercase">
              ACTUALIZAR NOTAS: {player.nombre}
            </span>
            <span>⬜</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:opacity-70 transition-opacity cursor-pointer text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 font-mono">
          {/* Player brief */}
          <div
            className={`p-3 border text-xs flex items-center justify-between ${
              darkMode ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-neutral-100'
            }`}
          >
            <div>
              <span className="font-bold uppercase text-sm">
                #{player.dorsal} {player.nombre}
              </span>
              <p className="text-neutral-500 text-[11px]">
                {player.posicion} • Nacimiento: {player.nacimiento} • {player.lateralidad}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-500 block uppercase">Escala</span>
              <span className="font-bold text-xs">1 a 5</span>
            </div>
          </div>

          {/* 3 Criteria Selectors */}
          <div className="space-y-4 pt-1">
            {renderRatingSelector(
              '1. Técnica',
              'Control, pase, regate',
              tecnica,
              setTecnica
            )}

            {renderRatingSelector(
              '2. Táctica',
              'Colocación, toma de decisiones',
              tactica,
              setTactica
            )}

            {renderRatingSelector(
              '3. Condicional',
              'Físico, resistencia, velocidad',
              condicional,
              setCondicional
            )}
          </div>

          {/* Equivalent CLI Command indicator */}
          <div
            className={`p-2.5 border text-[11px] font-mono ${
              darkMode
                ? 'border-neutral-800 bg-black text-neutral-400'
                : 'border-neutral-300 bg-neutral-50 text-neutral-700'
            }`}
          >
            <span className="text-neutral-500 block text-[10px] uppercase font-bold">
              Comando CLI equivalente:
            </span>
            <code className="text-neutral-200 dark:text-neutral-200 font-bold block mt-0.5 break-all">
              "{commandPreview}"
            </code>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleClearAll}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all cursor-pointer ${
                darkMode
                  ? 'border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600'
                  : 'border-neutral-300 text-neutral-600 hover:text-black hover:border-neutral-500'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Restablecer («—»)</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  darkMode
                    ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-900'
                    : 'border-neutral-400 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider border flex items-center gap-2 transition-all cursor-pointer ${
                  darkMode
                    ? 'border-white bg-white text-black hover:bg-neutral-200 font-black'
                    : 'border-black bg-black text-white hover:bg-neutral-800 font-black'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Guardar Evaluación</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
