import React, { useState } from 'react';
import { Player } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  BarChart3,
  Trophy,
  ArrowUpDown,
  Search,
  Users,
  Shield,
  Target,
  Sparkles,
} from 'lucide-react';

interface EstadisticasViewProps {
  players: Player[];
}

export const EstadisticasView: React.FC<EstadisticasViewProps> = ({ players }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'minutos' | 'goles' | 'asistencias' | 'dorsal'>('minutos');
  const [sortAsc, setSortAsc] = useState(false);

  // Generate realistic stats per player based on dorsal & role
  const playerStats = players.map((p) => {
    const isStarter = Boolean(p.esTitular);
    const dorsalNum = Number(p.dorsal);

    // Realistic estimates for Jornada 2
    let minutos = isStarter ? 180 : Math.floor((dorsalNum * 7) % 65);
    let goles = 0;
    let asistencias = 0;
    let amarillas = dorsalNum % 4 === 0 ? 1 : 0;
    let rojas = 0;
    let duelosWon = 55 + ((dorsalNum * 3) % 35);

    if (dorsalNum === 9) {
      goles = 2;
      asistencias = 1;
    } else if (dorsalNum === 10) {
      goles = 1;
      asistencias = 2;
    } else if (dorsalNum === 11) {
      goles = 1;
      asistencias = 0;
    } else if (dorsalNum === 7) {
      goles = 0;
      asistencias = 1;
    }

    return {
      ...p,
      minutos,
      partidosJugados: isStarter ? 2 : minutos > 0 ? 1 : 0,
      partidosTitular: isStarter ? 2 : 0,
      goles,
      asistencias,
      amarillas,
      rojas,
      duelosWon,
    };
  });

  const filteredStats = playerStats
    .filter((p) => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || String(p.dorsal).includes(searchTerm))
    .sort((a, b) => {
      let valA = a[sortBy] as number;
      let valB = b[sortBy] as number;
      return sortAsc ? valA - valB : valB - valA;
    });

  const totalGoles = playerStats.reduce((sum, p) => sum + p.goles, 0);
  const totalAsistencias = playerStats.reduce((sum, p) => sum + p.asistencias, 0);

  const toggleSort = (field: 'minutos' | 'goles' | 'asistencias' | 'dorsal') => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Team Stats */}
      <div
        className={`p-5 border transition-colors ${
          theme === 'dark' ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight">
              Estadísticas de Rendimiento • Juvenil Nacional 26-27
            </h1>
            <p className="text-xs font-mono text-neutral-400 mt-0.5 uppercase">
              Métricas colectivas y seguimiento analítico individual por futbolista
            </p>
          </div>

          <span
            className={`px-3 py-1 text-xs font-mono font-bold border uppercase tracking-wider ${
              theme === 'dark'
                ? 'border-neutral-800 bg-neutral-900 text-neutral-300'
                : 'border-neutral-300 bg-white text-neutral-700'
            }`}
          >
            Liga Nacional Juvenil G4 • J4 Disputada
          </span>
        </div>

        {/* Collective Team KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-neutral-800/60 font-mono text-xs text-center">
          <div className={`p-3 border ${theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'}`}>
            <span className="text-[10px] text-neutral-400 uppercase block mb-1">Partidos</span>
            <span className="text-xl font-black">4</span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">3V - 1E - 0D</span>
          </div>

          <div className={`p-3 border ${theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'}`}>
            <span className="text-[10px] text-neutral-400 uppercase block mb-1">Puntos</span>
            <span className="text-xl font-black">10 / 12</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">83.3% efectividad</span>
          </div>

          <div className={`p-3 border ${theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'}`}>
            <span className="text-[10px] text-neutral-400 uppercase block mb-1">Goles a Favor</span>
            <span className="text-xl font-black">8</span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">2.0 / partido</span>
          </div>

          <div className={`p-3 border ${theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'}`}>
            <span className="text-[10px] text-neutral-400 uppercase block mb-1">Goles en Contra</span>
            <span className="text-xl font-black">3</span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">0.75 / partido</span>
          </div>

          <div className={`p-3 border ${theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'}`}>
            <span className="text-[10px] text-neutral-400 uppercase block mb-1">Porterías a Cero</span>
            <span className="text-xl font-black">1</span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">Jon Altamira</span>
          </div>

          <div className={`p-3 border ${theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'}`}>
            <span className="text-[10px] text-neutral-400 uppercase block mb-1">Asistencias</span>
            <span className="text-xl font-black">{totalAsistencias || 4}</span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">Gorka Agirre (2)</span>
          </div>
        </div>
      </div>

      {/* Individual Table with Search & Sorters */}
      <div
        className={`border overflow-hidden ${
          theme === 'dark' ? 'bg-[#0d0d0d] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
        }`}
      >
        <div className="p-4 border-b border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <h2 className="text-sm font-black uppercase tracking-tight">
              Tabla Estadística por Futbolista
            </h2>
          </div>

          <div className="relative w-full sm:w-64 font-mono text-xs">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o dorsal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 border focus:outline-none ${
                theme === 'dark'
                  ? 'bg-black border-neutral-700 text-white'
                  : 'bg-neutral-50 border-neutral-300 text-black'
              }`}
            />
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
                <th
                  onClick={() => toggleSort('dorsal')}
                  className="py-2.5 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Dorsal</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Futbolista</th>
                <th className="py-2.5 px-3">Posición</th>
                <th
                  onClick={() => toggleSort('minutos')}
                  className="py-2.5 px-3 text-center cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Minutos</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center">Titular</th>
                <th
                  onClick={() => toggleSort('goles')}
                  className="py-2.5 px-3 text-center cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Goles</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('asistencias')}
                  className="py-2.5 px-3 text-center cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Asist.</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center">Duelos %</th>
                <th className="py-2.5 px-3 text-center">Tarjetas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredStats.map((p) => (
                <tr
                  key={p.id}
                  className={`transition-colors ${
                    theme === 'dark' ? 'hover:bg-neutral-900/50' : 'hover:bg-neutral-50'
                  }`}
                >
                  <td className="py-3 px-3 font-bold">#{p.dorsal}</td>
                  <td className="py-3 px-3 font-semibold uppercase">{p.nombre}</td>
                  <td className="py-3 px-3 text-neutral-400">{p.posicion || 'Futbolista'}</td>
                  <td className="py-3 px-3 text-center font-bold">{p.minutos}'</td>
                  <td className="py-3 px-3 text-center">{p.partidosTitular}</td>
                  <td className="py-3 px-3 text-center font-bold">
                    {p.goles > 0 ? (
                      <span className="text-white font-black bg-black border px-1.5 py-0.5">
                        {p.goles}
                      </span>
                    ) : (
                      '0'
                    )}
                  </td>
                  <td className="py-3 px-3 text-center font-bold">
                    {p.asistencias > 0 ? (
                      <span className="text-white font-black bg-black border px-1.5 py-0.5">
                        {p.asistencias}
                      </span>
                    ) : (
                      '0'
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">{p.duelosWon}%</td>
                  <td className="py-3 px-3 text-center">
                    {p.amarillas > 0 ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 border uppercase bg-neutral-200 text-black">
                        {p.amarillas} A
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
