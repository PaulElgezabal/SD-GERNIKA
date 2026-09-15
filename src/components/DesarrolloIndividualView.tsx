import React, { useState } from 'react';
import { Player, PlanDesarrolloIndividual } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  UserCheck,
  Target,
  Plus,
  MessageSquare,
  Award,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface DesarrolloIndividualViewProps {
  players: Player[];
  planes: PlanDesarrolloIndividual[];
  onAddNota: (jugadorId: string | number, nota: string, autor: string) => void;
  onUpdatePlan?: (plan: PlanDesarrolloIndividual) => void;
}

export const DesarrolloIndividualView: React.FC<DesarrolloIndividualViewProps> = ({
  players,
  planes,
  onAddNota,
}) => {
  const { theme } = useTheme();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | number>(
    planes[0]?.jugadorId || players[0]?.id || 1
  );

  const [nuevaNota, setNuevaNota] = useState('');
  const [autorNota, setAutorNota] = useState('Primer Entrenador');

  const selectedPlan = planes.find((p) => String(p.jugadorId) === String(selectedPlayerId));
  const selectedPlayer = players.find((p) => String(p.id) === String(selectedPlayerId));

  const handleAddNotaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaNota.trim()) return;
    onAddNota(selectedPlayerId, nuevaNota.trim(), autorNota);
    setNuevaNota('');
  };

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
              Desarrollo Individual • Planes por Futbolista
            </h1>
            <p className="text-xs font-mono text-neutral-400 mt-0.5 uppercase">
              Objetivos técnicos, tácticos, feedback individual y seguimiento continuo
            </p>
          </div>

          <span
            className={`px-3 py-1 text-xs font-mono font-bold border uppercase tracking-wider ${
              theme === 'dark'
                ? 'border-neutral-800 bg-neutral-900 text-neutral-300'
                : 'border-neutral-300 bg-white text-neutral-700'
            }`}
          >
            {players.length} Futbolistas en Seguimiento
          </span>
        </div>

        {/* Player Quick Selector Ribbon */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-4 pt-3 border-t border-neutral-800/60 no-scrollbar">
          {players.map((p) => {
            const isSelected = String(p.id) === String(selectedPlayerId);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPlayerId(p.id)}
                className={`px-3 py-1.5 border font-mono text-xs uppercase tracking-wider shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? theme === 'dark'
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-black text-white border-black font-bold'
                    : theme === 'dark'
                    ? 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                    : 'bg-neutral-100 border-neutral-300 text-neutral-600 hover:text-black'
                }`}
              >
                <span className="font-bold">#{p.dorsal}</span>
                <span>{p.nombre}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Detail View for Selected Player */}
      {selectedPlayer && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column: Player Identity & 5D Staff Evaluation */}
          <div
            className={`p-5 border flex flex-col justify-between ${
              theme === 'dark' ? 'bg-[#0d0d0d] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-16 h-16 border flex items-center justify-center font-mono font-black text-2xl shrink-0 ${
                    theme === 'dark' ? 'bg-black text-white border-neutral-700' : 'bg-neutral-100 text-black border-neutral-300'
                  }`}
                >
                  {selectedPlayer.dorsal}
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight">{selectedPlayer.nombre}</h2>
                  <p className="text-xs font-mono text-neutral-400 uppercase">
                    {selectedPlayer.posicion || 'Futbolista'} • {selectedPlayer.lateralidad}
                  </p>
                  <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                    Nacimiento: {selectedPlayer.nacimiento}
                  </p>
                </div>
              </div>

              <div className="border-t border-neutral-800 pt-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Evaluación en 5 Dimensiones (1-5)</span>
                </h3>

                <div className="space-y-2.5 font-mono text-xs">
                  {[
                    { label: 'Técnica Individual', val: selectedPlan?.evaluacionStaff.tecnica || selectedPlayer.tecnica || 4 },
                    { label: 'Comprensión Táctica', val: selectedPlan?.evaluacionStaff.tactica || selectedPlayer.tactica || 4 },
                    { label: 'Capacidad Física / Motor', val: selectedPlan?.evaluacionStaff.fisico || selectedPlayer.condicional || 4 },
                    { label: 'Toma de Decisión', val: selectedPlan?.evaluacionStaff.tomaDecision || selectedPlayer.tomaDecision || 4 },
                    { label: 'Mentalidad / Actitud', val: selectedPlan?.evaluacionStaff.mental || selectedPlayer.actitud || 5 },
                  ].map((dim, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span>{dim.label}</span>
                        <span className="font-bold">{dim.val} / 5</span>
                      </div>
                      <div
                        className={`h-2 w-full border ${
                          theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-100 border-neutral-300'
                        }`}
                      >
                        <div
                          className={`h-full ${theme === 'dark' ? 'bg-white' : 'bg-black'}`}
                          style={{ width: `${(dim.val / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Strengths / Weaknesses */}
            <div className="mt-5 pt-3 border-t border-neutral-800 space-y-2 font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Puntos Fuertes:</span>
                <p className="text-neutral-300">
                  {selectedPlan?.puntosFuertes.join(', ') || 'Gran compromiso, disciplina táctica e intensidad en duelos.'}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Áreas de Mejora:</span>
                <p className="text-neutral-400">
                  {selectedPlan?.puntosMejoraClave.join(', ') || 'Orientación en apoyos de espaldas y velocidad de pase.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right 2 Columns: Objectives & Follow-up Notes Timeline */}
          <div className="lg:col-span-2 space-y-4">
            {/* Objectives Cards */}
            <div
              className={`p-5 border ${
                theme === 'dark' ? 'bg-[#0d0d0d] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
              }`}
            >
              <h3 className="text-sm font-black uppercase tracking-tight mb-3">
                Plan Individual de Trabajo & Tareas Específicas
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-mono text-xs">
                <div
                  className={`p-3.5 border ${
                    theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                    Objetivos Técnicos:
                  </span>
                  <ul className="space-y-1 text-neutral-300">
                    {(selectedPlan?.objetivosTecnicos || ['Precisión de golpeo', 'Control orientado con pierna débil']).map(
                      (item, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-neutral-500">•</span>
                          <span>{item}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div
                  className={`p-3.5 border ${
                    theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                    Objetivos Tácticos:
                  </span>
                  <ul className="space-y-1 text-neutral-300">
                    {(selectedPlan?.objetivosTacticos || ['Perfilado defensivo', 'Ajuste de vigilancias']).map(
                      (item, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-neutral-500">•</span>
                          <span>{item}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Follow-up Notes & Coaching Interventions */}
            <div
              className={`p-5 border ${
                theme === 'dark' ? 'bg-[#0d0d0d] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
              }`}
            >
              <h3 className="text-sm font-black uppercase tracking-tight mb-3">
                Historial de Feedback & Intervenciones del Staff
              </h3>

              <div className="space-y-2.5 mb-4">
                {(selectedPlan?.notasSeguimiento || [
                  { fecha: '2026-09-08', nota: 'Buen rendimiento en las sesiones de fuerza y rondos de presión.', autor: 'Staff Técnico' },
                ]).map((n, idx) => (
                  <div
                    key={idx}
                    className={`p-3 border font-mono text-xs ${
                      theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                      <span>{n.fecha}</span>
                      <span className="font-bold">{n.autor}</span>
                    </div>
                    <p className="text-neutral-200">"{n.nota}"</p>
                  </div>
                ))}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNotaSubmit} className="pt-3 border-t border-neutral-800/80 font-mono text-xs">
                <span className="text-[11px] uppercase font-bold text-neutral-400 block mb-2">
                  + Añadir Nueva Nota de Seguimiento
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    required
                    value={nuevaNota}
                    onChange={(e) => setNuevaNota(e.target.value)}
                    placeholder="Escribe la observación técnica o corrección..."
                    className={`flex-1 p-2 border focus:outline-none ${
                      theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                    }`}
                  />
                  <select
                    value={autorNota}
                    onChange={(e) => setAutorNota(e.target.value)}
                    className={`p-2 border focus:outline-none ${
                      theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                    }`}
                  >
                    <option value="Primer Entrenador">Primer Entrenador</option>
                    <option value="Segundo Entrenador">Segundo Entrenador</option>
                    <option value="Preparador Físico">Preparador Físico</option>
                    <option value="Analista Táctico">Analista Táctico</option>
                  </select>
                  <button
                    type="submit"
                    className={`px-4 py-2 font-bold uppercase border cursor-pointer shrink-0 ${
                      theme === 'dark' ? 'bg-white text-black border-white' : 'bg-black text-white border-black'
                    }`}
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
