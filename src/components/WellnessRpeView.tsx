import React, { useState } from 'react';
import { Player, RegistroWellnessRPE } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Activity,
  HeartPulse,
  AlertTriangle,
  CheckCircle,
  Plus,
  Flame,
  Moon,
  Smile,
  Shield,
} from 'lucide-react';

interface WellnessRpeViewProps {
  players: Player[];
  registros: RegistroWellnessRPE[];
  onAddRegistro: (nuevo: Omit<RegistroWellnessRPE, 'id'>) => void;
}

export const WellnessRpeView: React.FC<WellnessRpeViewProps> = ({
  players,
  registros,
  onAddRegistro,
}) => {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [jugadorId, setJugadorId] = useState<string | number>(players[0]?.id || 1);
  const [fecha, setFecha] = useState('2026-09-09');
  const [sueno, setSueno] = useState<number>(4);
  const [fatiga, setFatiga] = useState<number>(4);
  const [dolorMuscular, setDolorMuscular] = useState<number>(4);
  const [estres, setEstres] = useState<number>(5);
  const [humor, setHumor] = useState<number>(5);
  const [rpe, setRpe] = useState<number>(7);
  const [minutosSesion, setMinutosSesion] = useState<number>(85);
  const [observacion, setObservacion] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const playerObj = players.find((p) => String(p.id) === String(jugadorId));
    if (!playerObj) return;

    onAddRegistro({
      jugadorId,
      jugadorNombre: playerObj.nombre,
      dorsal: playerObj.dorsal,
      fecha,
      sueno,
      fatiga,
      dolorMuscular,
      estres,
      humor,
      rpe,
      minutosSesion,
      cargaSRPE: rpe * minutosSesion,
      observacion: observacion.trim() || undefined,
    });

    setObservacion('');
    setShowModal(false);
  };

  // Average Calculations
  const mediaWellness =
    registros.length > 0
      ? (
          registros.reduce((acc, r) => acc + (r.sueno + r.fatiga + r.dolorMuscular + r.estres + r.humor) / 5, 0) /
          registros.length
        ).toFixed(1)
      : '4.2';

  const mediaRPE =
    registros.length > 0
      ? (registros.reduce((acc, r) => acc + (r.rpe || 6), 0) / registros.length).toFixed(1)
      : '6.8';

  const cargaTotalUA =
    registros.reduce((acc, r) => acc + (r.cargaSRPE || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div
        className={`p-5 border transition-colors ${
          theme === 'dark' ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight">
              Wellness Matinal & Control de Carga RPE
            </h1>
            <p className="text-xs font-mono text-neutral-400 mt-0.5 uppercase">
              Monitoreo de fatiga, sueño, dolor muscular y cálculo de carga sRPE (Borg x Minutos)
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-white text-black border-white hover:bg-neutral-200'
                : 'bg-black text-white border-black hover:bg-neutral-800 shadow-xs'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Registrar Wellness / RPE</span>
          </button>
        </div>

        {/* Aggregate KPI Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-neutral-800/60 font-mono text-xs">
          <div
            className={`p-3 border text-center ${
              theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'
            }`}
          >
            <span className="text-[10px] text-neutral-400 uppercase block mb-1">Índice Wellness Medio</span>
            <span className="text-xl font-black">{mediaWellness} / 5.0</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">● Estado Físico Óptimo</span>
          </div>

          <div
            className={`p-3 border text-center ${
              theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'
            }`}
          >
            <span className="text-[10px] text-neutral-400 uppercase block mb-1">RPE Medio Sesión</span>
            <span className="text-xl font-black">{mediaRPE} / 10</span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">Escala Borg CR10</span>
          </div>

          <div
            className={`p-3 border text-center ${
              theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'
            }`}
          >
            <span className="text-[10px] text-neutral-400 uppercase block mb-1">Carga Acumulada sRPE</span>
            <span className="text-xl font-black">{cargaTotalUA} UA</span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">Unidades Arbitrarias</span>
          </div>
        </div>
      </div>

      {/* Wellness & RPE Squad Table */}
      <div
        className={`border overflow-hidden ${
          theme === 'dark' ? 'bg-[#0d0d0d] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
        }`}
      >
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-tight">
            Registros Individuales de Plantilla
          </h2>
          <span className="font-mono text-xs text-neutral-400">{registros.length} Registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr
                className={`border-b text-[10px] uppercase tracking-wider ${
                  theme === 'dark'
                    ? 'bg-black text-neutral-400 border-neutral-800'
                    : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                }`}
              >
                <th className="py-2.5 px-3">Dorsal</th>
                <th className="py-2.5 px-3">Futbolista</th>
                <th className="py-2.5 px-3 text-center">Sueño (1-5)</th>
                <th className="py-2.5 px-3 text-center">Fatiga (1-5)</th>
                <th className="py-2.5 px-3 text-center">Dolor Musc. (1-5)</th>
                <th className="py-2.5 px-3 text-center">Estrés (1-5)</th>
                <th className="py-2.5 px-3 text-center">RPE (1-10)</th>
                <th className="py-2.5 px-3 text-center">Carga sRPE</th>
                <th className="py-2.5 px-3">Estado</th>
                <th className="py-2.5 px-3">Observaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {registros.map((r) => {
                const avgScore = (r.sueno + r.fatiga + r.dolorMuscular + r.estres + r.humor) / 5;
                const isWarning = avgScore < 3.5 || (r.dolorMuscular <= 3);

                return (
                  <tr
                    key={r.id}
                    className={`transition-colors ${
                      theme === 'dark' ? 'hover:bg-neutral-900/50' : 'hover:bg-neutral-50'
                    }`}
                  >
                    <td className="py-3 px-3 font-bold">#{r.dorsal}</td>
                    <td className="py-3 px-3 font-semibold uppercase">{r.jugadorNombre}</td>
                    <td className="py-3 px-3 text-center">{r.sueno}</td>
                    <td className="py-3 px-3 text-center">{r.fatiga}</td>
                    <td className="py-3 px-3 text-center">{r.dolorMuscular}</td>
                    <td className="py-3 px-3 text-center">{r.estres}</td>
                    <td className="py-3 px-3 text-center font-bold">{r.rpe || '-'}</td>
                    <td className="py-3 px-3 text-center font-bold">
                      {r.cargaSRPE ? `${r.cargaSRPE} UA` : '-'}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 border uppercase tracking-wider inline-flex items-center gap-1 ${
                          isWarning
                            ? theme === 'dark'
                              ? 'border-neutral-700 bg-neutral-900 text-neutral-300'
                              : 'border-neutral-400 bg-neutral-200 text-neutral-800'
                            : theme === 'dark'
                            ? 'border-white bg-white text-black'
                            : 'border-black bg-black text-white'
                        }`}
                      >
                        {isWarning ? 'Alerta Fatiga' : 'Óptimo ✓'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-neutral-400 max-w-xs truncate">
                      {r.observacion || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className={`w-full max-w-lg border p-6 font-mono text-xs ${
              theme === 'dark' ? 'bg-[#0e0e0e] border-neutral-700 text-white' : 'bg-white border-black text-black shadow-xl'
            }`}
          >
            <h2 className="text-base font-black uppercase tracking-tight mb-4 border-b pb-2">
              Registrar Wellness & RPE de Jugador
            </h2>
            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase font-bold mb-1">Futbolista</label>
                  <select
                    value={jugadorId}
                    onChange={(e) => setJugadorId(e.target.value)}
                    className={`w-full p-2 border focus:outline-none ${
                      theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                    }`}
                  >
                    {players.map((p) => (
                      <option key={p.id} value={p.id}>
                        #{p.dorsal} {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className={`w-full p-2 border focus:outline-none ${
                      theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                    }`}
                  />
                </div>
              </div>

              {/* 5 Wellness Sliders/Inputs */}
              <div className="p-3 border space-y-2">
                <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                  Cuestionario Matinal Wellness (1: Malo - 5: Excelente)
                </span>
                <div className="grid grid-cols-5 gap-2 text-center">
                  <div>
                    <label className="text-[10px] block text-neutral-400">Sueño</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={sueno}
                      onChange={(e) => setSueno(Number(e.target.value))}
                      className={`w-full text-center p-1 border mt-1 ${
                        theme === 'dark' ? 'bg-black border-neutral-700' : 'bg-neutral-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] block text-neutral-400">Fatiga</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={fatiga}
                      onChange={(e) => setFatiga(Number(e.target.value))}
                      className={`w-full text-center p-1 border mt-1 ${
                        theme === 'dark' ? 'bg-black border-neutral-700' : 'bg-neutral-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] block text-neutral-400">Muscular</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={dolorMuscular}
                      onChange={(e) => setDolorMuscular(Number(e.target.value))}
                      className={`w-full text-center p-1 border mt-1 ${
                        theme === 'dark' ? 'bg-black border-neutral-700' : 'bg-neutral-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] block text-neutral-400">Estrés</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={estres}
                      onChange={(e) => setEstres(Number(e.target.value))}
                      className={`w-full text-center p-1 border mt-1 ${
                        theme === 'dark' ? 'bg-black border-neutral-700' : 'bg-neutral-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] block text-neutral-400">Humor</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={humor}
                      onChange={(e) => setHumor(Number(e.target.value))}
                      className={`w-full text-center p-1 border mt-1 ${
                        theme === 'dark' ? 'bg-black border-neutral-700' : 'bg-neutral-50'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* RPE & Minutes */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase font-bold mb-1">
                    RPE Esfuerzo Percibido (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rpe}
                    onChange={(e) => setRpe(Number(e.target.value))}
                    className={`w-full p-2 border focus:outline-none ${
                      theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-bold mb-1">
                    Duración Sesión (Minutos)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={minutosSesion}
                    onChange={(e) => setMinutosSesion(Number(e.target.value))}
                    className={`w-full p-2 border focus:outline-none ${
                      theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold mb-1">Observaciones Fisiológicas</label>
                <input
                  type="text"
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  placeholder="Ej: Sensación de pesadez en isquios derechos"
                  className={`w-full p-2 border focus:outline-none ${
                    theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border uppercase cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 font-bold uppercase border cursor-pointer ${
                    theme === 'dark' ? 'bg-white text-black border-white' : 'bg-black text-white border-black'
                  }`}
                >
                  Guardar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
