import React from 'react';
import { Player } from '../types';
import { getPlayerAverage } from '../utils/markdownGenerator';
import { Edit3, Activity, Award, CheckCircle } from 'lucide-react';

interface NotasTableProps {
  players: Player[];
  darkMode: boolean;
  onSelectPlayerForEval: (player: Player) => void;
}

export const NotasTable: React.FC<NotasTableProps> = ({
  players,
  darkMode,
  onSelectPlayerForEval,
}) => {
  // Calculate team stats
  const evaluatedPlayers = players.filter(
    (p) => p.tecnica !== null || p.tactica !== null || p.condicional !== null
  );

  const getScoreBadge = (score: number | null) => {
    if (score === null) {
      return (
        <span
          className={`font-mono font-bold text-sm tracking-wider ${
            darkMode ? 'text-neutral-600' : 'text-neutral-400'
          }`}
        >
          —
        </span>
      );
    }

    return (
      <span
        className={`inline-flex items-center justify-center w-7 h-7 font-mono font-bold text-xs border ${
          score >= 4
            ? darkMode
              ? 'border-white bg-white text-black font-black'
              : 'border-black bg-black text-white font-black'
            : darkMode
            ? 'border-neutral-700 bg-neutral-900 text-neutral-200'
            : 'border-neutral-400 bg-neutral-100 text-neutral-900'
        }`}
      >
        {score}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Criteria Legend Header */}
      <div
        className={`p-4 border ${
          darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-black'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🔳</span>
              <h2 className="text-base sm:text-lg font-black tracking-tight uppercase">
                EVALUACIÓN TÉCNICA DE RENDIMIENTO — S.D. GERNIKA CLUB
              </h2>
              <span className="text-sm">⬜</span>
            </div>
            <p
              className={`text-xs font-mono mt-0.5 ${
                darkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              Criterios técnicos evaluados por el cuerpo técnico en escala del 1 al 5. (Si no tiene nota: «—»).
            </p>
          </div>

          <div
            className={`px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider border self-start sm:self-center ${
              darkMode
                ? 'border-neutral-700 bg-neutral-900 text-neutral-300'
                : 'border-black bg-neutral-100 text-black'
            }`}
          >
            Evaluados: {evaluatedPlayers.length} / {players.length}
          </div>
        </div>

        {/* 3 Criteria Explanations */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 border font-mono text-xs ${
            darkMode
              ? 'border-neutral-800 bg-black/60 text-neutral-300'
              : 'border-neutral-200 bg-neutral-50 text-neutral-800'
          }`}
        >
          <div className="flex items-start gap-2">
            <span className="font-black text-neutral-400">1.</span>
            <div>
              <span className="font-bold uppercase tracking-wide text-neutral-900 dark:text-white">
                Técnica (1-5):
              </span>
              <p className="text-[11px] text-neutral-500">Control, pase, regate</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-black text-neutral-400">2.</span>
            <div>
              <span className="font-bold uppercase tracking-wide text-neutral-900 dark:text-white">
                Táctica (1-5):
              </span>
              <p className="text-[11px] text-neutral-500">Colocación, toma de decisiones</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-black text-neutral-400">3.</span>
            <div>
              <span className="font-bold uppercase tracking-wide text-neutral-900 dark:text-white">
                Condicional (1-5):
              </span>
              <p className="text-[11px] text-neutral-500">Físico, resistencia, velocidad</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div
        className={`border overflow-x-auto shadow-sm ${
          darkMode ? 'border-neutral-800 bg-black' : 'border-black bg-white'
        }`}
      >
        <table className="w-full text-left border-collapse text-xs sm:text-sm font-mono">
          <thead>
            <tr
              className={`border-b tracking-wider uppercase text-[11px] sm:text-xs font-bold ${
                darkMode
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-200'
                  : 'bg-black text-white border-black'
              }`}
            >
              <th className="py-3.5 px-4 text-center w-20">Dorsal</th>
              <th className="py-3.5 px-4">Jugador</th>
              <th className="py-3.5 px-3 text-center">
                <span>Técnica</span>
                <span className="block text-[10px] font-normal text-neutral-400 lowercase">
                  (control, pase, regate)
                </span>
              </th>
              <th className="py-3.5 px-3 text-center">
                <span>Táctica</span>
                <span className="block text-[10px] font-normal text-neutral-400 lowercase">
                  (colocación, decisiones)
                </span>
              </th>
              <th className="py-3.5 px-3 text-center">
                <span>Condicional</span>
                <span className="block text-[10px] font-normal text-neutral-400 lowercase">
                  (físico, vel, resist)
                </span>
              </th>
              <th className="py-3.5 px-4 text-center">Media</th>
              <th className="py-3.5 px-4 text-right">Actualizar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 dark:divide-neutral-800">
            {players.map((player, index) => {
              const isEven = index % 2 === 0;
              const avg = getPlayerAverage(player);
              const hasNotes = avg !== '—';

              return (
                <tr
                  key={player.id}
                  id={`eval-row-${player.dorsal}`}
                  className={`transition-colors ${
                    darkMode
                      ? isEven
                        ? 'bg-neutral-950/70 hover:bg-neutral-900'
                        : 'bg-black hover:bg-neutral-900'
                      : isEven
                      ? 'bg-neutral-50/70 hover:bg-neutral-100'
                      : 'bg-white hover:bg-neutral-100'
                  }`}
                >
                  {/* Dorsal */}
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1 font-bold">
                      <span className="text-xs">🔳</span>
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-black border ${
                          darkMode
                            ? 'border-neutral-700 bg-neutral-900 text-white'
                            : 'border-black bg-black text-white'
                        }`}
                      >
                        #{player.dorsal}
                      </span>
                    </div>
                  </td>

                  {/* Jugador */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-sm tracking-tight text-neutral-900 dark:text-white">
                      {player.nombre}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {player.posicion} • {player.lateralidad}
                    </div>
                  </td>

                  {/* Técnica */}
                  <td className="py-3 px-3 text-center">
                    {getScoreBadge(player.tecnica)}
                  </td>

                  {/* Táctica */}
                  <td className="py-3 px-3 text-center">
                    {getScoreBadge(player.tactica)}
                  </td>

                  {/* Condicional */}
                  <td className="py-3 px-3 text-center">
                    {getScoreBadge(player.condicional)}
                  </td>

                  {/* Media */}
                  <td className="py-3 px-4 text-center font-bold">
                    {hasNotes ? (
                      <span
                        className={`px-2 py-1 text-xs border font-black ${
                          Number(avg) >= 4.0
                            ? darkMode
                              ? 'border-white bg-white text-black'
                              : 'border-black bg-black text-white'
                            : darkMode
                            ? 'border-neutral-700 bg-neutral-900 text-neutral-200'
                            : 'border-neutral-300 bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {avg}
                      </span>
                    ) : (
                      <span className="text-neutral-500 font-bold">—</span>
                    )}
                  </td>

                  {/* Actualizar Button */}
                  <td className="py-3 px-4 text-right">
                    <button
                      id={`btn-actualizar-notas-${player.dorsal}`}
                      type="button"
                      onClick={() => onSelectPlayerForEval(player)}
                      className={`px-3 py-1 text-xs font-mono font-bold tracking-wider uppercase border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                        darkMode
                          ? 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-white hover:text-black hover:border-white'
                          : 'border-black bg-white text-black hover:bg-black hover:text-white'
                      }`}
                      title={`Actualizar notas de ${player.nombre}`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div
        className={`p-3 border text-xs font-mono flex flex-col sm:flex-row items-center justify-between gap-2 ${
          darkMode
            ? 'border-neutral-800 bg-neutral-950 text-neutral-400'
            : 'border-neutral-300 bg-neutral-100 text-neutral-700'
        }`}
      >
        <div className="flex items-center gap-2">
          <span>🔳</span>
          <span>Escala Oficial: 1 (Deficiente) a 5 (Sobresaliente) — S.D. Gernika Club</span>
          <span>⬜</span>
        </div>
        <div className="font-bold uppercase tracking-wider text-black dark:text-white">
          «Gernika beti aurrera!»
        </div>
      </div>
    </div>
  );
};
