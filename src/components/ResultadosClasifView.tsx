import React, { useState } from 'react';
import { EquipoClasificacion, Partido } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Trophy,
  Calendar,
  Shield,
  ChevronRight,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

interface ResultadosClasifViewProps {
  clasificacion: EquipoClasificacion[];
  partidos: Partido[];
}

export const ResultadosClasifView: React.FC<ResultadosClasifViewProps> = ({
  clasificacion,
  partidos,
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'clasificacion' | 'resultados'>('clasificacion');

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
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 border uppercase tracking-wider ${
                  theme === 'dark'
                    ? 'border-neutral-700 bg-neutral-900 text-neutral-300'
                    : 'border-neutral-300 bg-neutral-100 text-neutral-800'
                }`}
              >
                Liga Nacional Juvenil • Grupo IV
              </span>
              <span className="text-xs font-mono text-neutral-400 font-semibold">
                Temporada 2026-27
              </span>
            </div>
            <h1 className="text-xl font-black uppercase tracking-tight">
              Resultados y Clasificación Oficial
            </h1>
          </div>

          <div className="flex items-center gap-1 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('clasificacion')}
              className={`px-3.5 py-2 border font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'clasificacion'
                  ? theme === 'dark'
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-black'
                  : theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-600'
              }`}
            >
              Tabla Clasificación
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('resultados')}
              className={`px-3.5 py-2 border font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'resultados'
                  ? theme === 'dark'
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-black'
                  : theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-600'
              }`}
            >
              Resultados y Jornadas
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Clasificación Oficial */}
      {activeTab === 'clasificacion' && (
        <div
          className={`border overflow-hidden ${
            theme === 'dark' ? 'bg-[#0d0d0d] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
          }`}
        >
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-tight">
              Clasificación Grupo 2 (Segunda Federación)
            </h2>
            <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-white inline-block border border-neutral-500" />
                1º Ascenso Directo
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-neutral-400 inline-block" />
                2º-5º Play-off Ascenso
              </span>
            </div>
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
                  <th className="py-2.5 px-3 text-center">Pos</th>
                  <th className="py-2.5 px-3">Equipo</th>
                  <th className="py-2.5 px-3 text-center font-bold">PTS</th>
                  <th className="py-2.5 px-3 text-center">PJ</th>
                  <th className="py-2.5 px-3 text-center">PG</th>
                  <th className="py-2.5 px-3 text-center">PE</th>
                  <th className="py-2.5 px-3 text-center">PP</th>
                  <th className="py-2.5 px-3 text-center">GF</th>
                  <th className="py-2.5 px-3 text-center">GC</th>
                  <th className="py-2.5 px-3 text-center">DG</th>
                  <th className="py-2.5 px-3 text-center">Racha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {clasificacion.map((eq) => {
                  const isGernika = eq.esGernika || eq.nombre.includes('GERNIKA');
                  const isPlayoff = eq.posicion >= 2 && eq.posicion <= 5;
                  const isDirectPromotion = eq.posicion === 1;

                  return (
                    <tr
                      key={eq.posicion}
                      className={`transition-colors ${
                        isGernika
                          ? theme === 'dark'
                            ? 'bg-neutral-900/90 font-bold text-white border-y border-white'
                            : 'bg-neutral-200/90 font-bold text-black border-y border-black'
                          : theme === 'dark'
                          ? 'hover:bg-neutral-900/40'
                          : 'hover:bg-neutral-50'
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`w-5 h-5 inline-flex items-center justify-center font-bold text-[10px] ${
                            isDirectPromotion
                              ? 'bg-white text-black font-black'
                              : isPlayoff
                              ? 'border border-neutral-400'
                              : ''
                          }`}
                        >
                          {eq.posicion}
                        </span>
                      </td>
                      <td className="py-3 px-3 uppercase">
                        <div className="flex items-center gap-2">
                          <span>{eq.nombre}</span>
                          {isGernika && (
                            <span className="text-[9px] px-1.5 py-0.5 border uppercase bg-black text-white border-white">
                              Nuestro Club
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-black text-sm">{eq.puntos}</td>
                      <td className="py-3 px-3 text-center">{eq.partidosJugados}</td>
                      <td className="py-3 px-3 text-center">{eq.partidosGanados}</td>
                      <td className="py-3 px-3 text-center">{eq.partidosEmpatados}</td>
                      <td className="py-3 px-3 text-center">{eq.partidosPerdidos}</td>
                      <td className="py-3 px-3 text-center">{eq.golesFavor}</td>
                      <td className="py-3 px-3 text-center">{eq.golesContra}</td>
                      <td className="py-3 px-3 text-center">
                        {eq.diferenciaGoles > 0 ? `+${eq.diferenciaGoles}` : eq.diferenciaGoles}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {eq.racha.map((r, i) => (
                            <span
                              key={i}
                              className={`w-4 h-4 text-[9px] font-bold flex items-center justify-center border uppercase ${
                                r === 'V'
                                  ? theme === 'dark'
                                    ? 'bg-white text-black border-white'
                                    : 'bg-black text-white border-black'
                                  : r === 'E'
                                  ? 'bg-neutral-700 text-white border-neutral-600'
                                  : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                              }`}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Resultados y Calendario de Jornadas */}
      {activeTab === 'resultados' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partidos.map((partido) => (
              <div
                key={partido.id}
                className={`p-5 border flex flex-col justify-between ${
                  theme === 'dark' ? 'bg-[#0d0d0d] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-neutral-400 mb-3 border-b border-neutral-800 pb-2">
                    <span className="font-bold uppercase">Jornada {partido.jornada}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 border uppercase ${
                        partido.estado === 'Finalizado'
                          ? theme === 'dark'
                            ? 'bg-neutral-900 border-neutral-700 text-white'
                            : 'bg-neutral-100 border-neutral-300 text-black'
                          : theme === 'dark'
                          ? 'bg-white text-black border-white'
                          : 'bg-black text-white border-black'
                      }`}
                    >
                      {partido.estado}
                    </span>
                  </div>

                  <div className="flex items-center justify-between my-4 font-mono">
                    <div className="text-left flex-1">
                      <span className="font-black text-sm sm:text-base uppercase block">
                        {partido.esLocal ? 'SD GERNIKA JUVENIL' : partido.rival}
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase">
                        {partido.esLocal ? 'Local' : 'Visitante'}
                      </span>
                    </div>

                    <div className="px-4 text-center">
                      {partido.estado === 'Finalizado' ? (
                        <div className="text-xl sm:text-2xl font-black tracking-wider">
                          {partido.golesFavor} - {partido.golesContra}
                        </div>
                      ) : (
                        <div className="text-xs font-bold text-neutral-400">
                          {partido.hora}h
                        </div>
                      )}
                    </div>

                    <div className="text-right flex-1">
                      <span className="font-black text-sm sm:text-base uppercase block">
                        {partido.esLocal ? partido.rival : 'SD GERNIKA'}
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase">
                        {partido.esLocal ? 'Visitante' : 'Local'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800 font-mono text-[11px] text-neutral-400 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {partido.estadio}
                  </span>
                  <span>{partido.fecha}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
