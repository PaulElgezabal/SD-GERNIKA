import React, { useState } from 'react';
import { PlanPartidoSemanal } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  ClipboardList,
  ShieldAlert,
  Target,
  ArrowRight,
  Clock,
  MapPin,
  CheckSquare,
  Plus,
  FileText,
  Swords,
} from 'lucide-react';

interface PlanPartidoViewProps {
  plan: PlanPartidoSemanal;
  onUpdatePlan?: (updated: PlanPartidoSemanal) => void;
}

export const PlanPartidoView: React.FC<PlanPartidoViewProps> = ({ plan }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'rival' | 'ofensivo' | 'defensivo' | 'abp' | 'microciclo'>('rival');

  return (
    <div className="space-y-5 animate-in fade-in duration-200 font-sans">
      {/* Header Match Overview */}
      <div
        className={`p-6 border transition-colors ${
          theme === 'dark' ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 border uppercase tracking-wider ${
                  theme === 'dark'
                    ? 'border-neutral-700 bg-neutral-900 text-neutral-300'
                    : 'border-neutral-300 bg-neutral-100 text-neutral-800'
                }`}
              >
                Plan Táctico Oficial • Jornada {plan.jornada}
              </span>
              <span className="text-xs font-mono text-neutral-400 font-semibold">
                {plan.fechaPartido} a las {plan.horaPartido}h
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              SD GERNIKA JUVENIL <span className="text-neutral-500 font-normal">vs</span> {plan.rival}
            </h1>
            <p className="text-xs font-mono text-neutral-400 mt-1 uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {plan.estadio} ({plan.esLocal ? 'Local' : 'Visitante'}) • Liga Nacional Juvenil Grupo IV • 2026-2027
            </p>
          </div>

          <div
            className={`p-3 border font-mono text-xs text-center shrink-0 ${
              theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'
            }`}
          >
            <span className="text-[10px] text-neutral-400 uppercase block mb-0.5">Sistema Rival Previsto</span>
            <span className="font-black text-sm text-emerald-400">
              {plan.analisisRival.sistemaPrincipal}
            </span>
          </div>
        </div>

        {/* Tactical Sub-navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-neutral-800/80 font-mono text-xs">
          {[
            { id: 'rival', label: '1. Análisis del Rival', icon: Swords },
            { id: 'ofensivo', label: '2. Plan Ofensivo', icon: Target },
            { id: 'defensivo', label: '3. Plan Defensivo', icon: ShieldAlert },
            { id: 'abp', label: '4. ABP & Estrategia', icon: FileText },
            { id: 'microciclo', label: '5. Microciclo Semanal', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 border font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-white text-black border-white shadow-xs'
                      : 'bg-black text-white border-black shadow-xs'
                    : theme === 'dark'
                    ? 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                    : 'bg-neutral-100 border-neutral-300 text-neutral-600 hover:text-black'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Análisis del Rival */}
      {activeTab === 'rival' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`p-5 border ${
              theme === 'dark' ? 'bg-[#0c0c0c] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-neutral-400 mb-3">
              <ShieldAlert className="w-4 h-4" />
              <span>Puntos Fuertes del Rival</span>
            </div>
            <ul className="space-y-2.5 font-mono text-xs">
              {plan.analisisRival.puntosFuertes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`p-5 border ${
              theme === 'dark' ? 'bg-[#0c0c0c] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-neutral-400 mb-3">
              <Target className="w-4 h-4" />
              <span>Puntos Débiles a Explotar</span>
            </div>
            <ul className="space-y-2.5 font-mono text-xs">
              {plan.analisisRival.puntosDebiles.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 border border-neutral-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`p-5 border ${
              theme === 'dark' ? 'bg-[#0c0c0c] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-neutral-400 mb-3">
              <Swords className="w-4 h-4" />
              <span>Jugadores Clave a Vigilar</span>
            </div>
            <ul className="space-y-2.5 font-mono text-xs">
              {plan.analisisRival.jugadoresClave.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-neutral-400">#</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: Plan Ofensivo */}
      {activeTab === 'ofensivo' && (
        <div
          className={`p-6 border space-y-4 ${
            theme === 'dark' ? 'bg-[#0c0c0c] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
          }`}
        >
          <div className="border-b border-neutral-800 pb-3">
            <h2 className="text-base font-black uppercase tracking-tight">
              Directrices para el Ataque Organizado
            </h2>
            <p className="text-xs font-mono text-neutral-400">
              Pautas colectivas de finalización, amplitud y ritmo de pase
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plan.objetivosOfensivos.map((obj, i) => (
              <div
                key={i}
                className={`p-4 border font-mono text-xs ${
                  theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'
                }`}
              >
                <span className="text-[10px] text-neutral-500 font-bold block mb-1">
                  CONSIGNA {i + 1}
                </span>
                <p className="font-semibold leading-relaxed">{obj}</p>
              </div>
            ))}
          </div>

          <div
            className={`p-4 border font-mono text-xs mt-4 ${
              theme === 'dark' ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-300'
            }`}
          >
            <span className="text-[11px] font-bold uppercase block mb-1">Transición Ofensiva Rápida:</span>
            <p className="text-neutral-400">{plan.planTransiciones[0]}</p>
          </div>
        </div>
      )}

      {/* Tab 3: Plan Defensivo */}
      {activeTab === 'defensivo' && (
        <div
          className={`p-6 border space-y-4 ${
            theme === 'dark' ? 'bg-[#0c0c0c] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
          }`}
        >
          <div className="border-b border-neutral-800 pb-3">
            <h2 className="text-base font-black uppercase tracking-tight">
              Estructura Defensiva y Presión
            </h2>
            <p className="text-xs font-mono text-neutral-400">
              Bloque medio, achiques de línea y vigilancias ofensivas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plan.objetivosDefensivos.map((obj, i) => (
              <div
                key={i}
                className={`p-4 border font-mono text-xs ${
                  theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'
                }`}
              >
                <span className="text-[10px] text-neutral-500 font-bold block mb-1">
                  BLOQUE DEFENSIVO {i + 1}
                </span>
                <p className="font-semibold leading-relaxed">{obj}</p>
              </div>
            ))}
          </div>

          <div
            className={`p-4 border font-mono text-xs mt-4 ${
              theme === 'dark' ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-300'
            }`}
          >
            <span className="text-[11px] font-bold uppercase block mb-1">Transición Defensiva Inmediata:</span>
            <p className="text-neutral-400">{plan.planTransiciones[1]}</p>
          </div>
        </div>
      )}

      {/* Tab 4: ABP & Estrategia */}
      {activeTab === 'abp' && (
        <div
          className={`p-6 border space-y-4 ${
            theme === 'dark' ? 'bg-[#0c0c0c] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
          }`}
        >
          <div className="border-b border-neutral-800 pb-3">
            <h2 className="text-base font-black uppercase tracking-tight">
              Estrategia a Balón Parado para el Partido
            </h2>
            <p className="text-xs font-mono text-neutral-400">
              Asignación específica de jugadas del Repositorio ABP
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.estrategiaABP.map((abp, i) => (
              <div
                key={i}
                className={`p-4 border font-mono text-xs ${
                  theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'
                }`}
              >
                <span className="text-[10px] text-neutral-500 font-bold block mb-1">
                  JUGADA PRIORITARIA {i + 1}
                </span>
                <p className="font-semibold leading-relaxed">{abp}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Microciclo Semanal */}
      {activeTab === 'microciclo' && (
        <div
          className={`p-6 border space-y-4 ${
            theme === 'dark' ? 'bg-[#0c0c0c] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
          }`}
        >
          <div className="border-b border-neutral-800 pb-3">
            <h2 className="text-base font-black uppercase tracking-tight">
              Microciclo Estructurado de Preparación
            </h2>
            <p className="text-xs font-mono text-neutral-400">
              Distribución de cargas, contenidos tácticos y tiempo de sesión
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {plan.microciclo.map((m, idx) => (
              <div
                key={idx}
                className={`p-4 border font-mono text-xs flex flex-col justify-between ${
                  theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 mb-1">
                    <span>{m.dia}</span>
                    <span>{m.duracionMin} min</span>
                  </div>
                  <h3 className="font-black text-sm uppercase mb-2">{m.foco}</h3>
                  <p className="text-xs text-neutral-400">{m.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
