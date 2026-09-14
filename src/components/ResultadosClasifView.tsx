import React, { useState, useMemo } from 'react';
import { EquipoClasificacion, Partido, EquipoLiga, JornadaOficial } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  EQUIPOS_LIGA_NACIONAL,
  CALENDARIO_OFICIAL_JORNADAS,
} from '../data/ligaNacionalData';
import {
  Trophy,
  Calendar,
  Shield,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Search,
  Phone,
  Shirt,
  Info,
  CalendarDays,
  Users,
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

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'clasificacion' | 'calendario' | 'equipos'>('clasificacion');

  // Standings filters
  const [filterProvincia, setFilterProvincia] = useState<'all' | 'Bizkaia' | 'Gipuzkoa' | 'Álava'>('all');
  const [searchEquipo, setSearchEquipo] = useState('');

  // Calendar state
  const [selectedJornadaNum, setSelectedJornadaNum] = useState<number>(1);
  const [calendarioMode, setCalendarioMode] = useState<'todos' | 'gernika'>('todos');

  // Teams directory state
  const [searchClub, setSearchClub] = useState('');
  const [filterClubProvincia, setFilterClubProvincia] = useState<'all' | 'Bizkaia' | 'Gipuzkoa' | 'Álava'>('all');
  const [filterSuperficie, setFilterSuperficie] = useState<'all' | 'HA' | 'HN'>('all');

  // Filtered standings
  const filteredClasificacion = useMemo(() => {
    return clasificacion.filter((eq) => {
      const matchesSearch = eq.nombre.toLowerCase().includes(searchEquipo.toLowerCase());
      if (!matchesSearch) return false;

      if (filterProvincia === 'all') return true;

      // Match club province
      const matchingClub = EQUIPOS_LIGA_NACIONAL.find(
        (c) =>
          c.nombre.toLowerCase().includes(eq.nombre.toLowerCase()) ||
          eq.nombre.toLowerCase().includes(c.nombre.toLowerCase())
      );
      if (!matchingClub) return true;
      return matchingClub.provincia === filterProvincia;
    });
  }, [clasificacion, searchEquipo, filterProvincia]);

  // Selected Jornada data
  const currentJornada: JornadaOficial = useMemo(() => {
    return (
      CALENDARIO_OFICIAL_JORNADAS.find((j) => j.numero === selectedJornadaNum) ||
      CALENDARIO_OFICIAL_JORNADAS[0]
    );
  }, [selectedJornadaNum]);

  // Filtered clubs directory
  const filteredClubs = useMemo(() => {
    return EQUIPOS_LIGA_NACIONAL.filter((club) => {
      const matchSearch =
        club.nombre.toLowerCase().includes(searchClub.toLowerCase()) ||
        club.campo.toLowerCase().includes(searchClub.toLowerCase()) ||
        club.localidad.toLowerCase().includes(searchClub.toLowerCase());
      if (!matchSearch) return false;

      if (filterClubProvincia !== 'all' && club.provincia !== filterClubProvincia) return false;
      if (filterSuperficie === 'HA' && !club.tipoHierba.includes('(HA)')) return false;
      if (filterSuperficie === 'HN' && !club.tipoHierba.includes('(HN)')) return false;

      return true;
    });
  }, [searchClub, filterClubProvincia, filterSuperficie]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Official League Header Banner */}
      <div
        className={`p-5 sm:p-6 border transition-colors ${
          theme === 'dark'
            ? 'bg-[#0a0a0a] border-neutral-800'
            : 'bg-white border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 border uppercase tracking-wider ${
                  theme === 'dark'
                    ? 'border-neutral-700 bg-neutral-900 text-neutral-300'
                    : 'border-neutral-300 bg-neutral-100 text-neutral-800'
                }`}
              >
                FVF-EFF • Gazteen Nazional Liga
              </span>
              <span className="text-xs font-mono text-neutral-400 font-semibold">
                Temporada 2026/2027 • Grupo IV
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-red-950/40 text-red-400 border border-red-900/60 uppercase font-bold">
                18 Equipos • 34 Jornadas
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              Campeonato de Liga Nacional Juvenil
            </h1>
            <p className="text-xs font-mono text-neutral-400 mt-0.5">
              Federación Vasca de Fútbol · Euskadiko Futbol Federakundea (SD Gernika Club Juvenil)
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs w-full lg:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('clasificacion')}
              className={`flex-1 sm:flex-initial px-3.5 py-2 border font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'clasificacion'
                  ? theme === 'dark'
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-black'
                  : theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-600 hover:text-black'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Clasificación (18)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('calendario')}
              className={`flex-1 sm:flex-initial px-3.5 py-2 border font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'calendario'
                  ? theme === 'dark'
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-black'
                  : theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-600 hover:text-black'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Calendario Oficial (34J)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('equipos')}
              className={`flex-1 sm:flex-initial px-3.5 py-2 border font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'equipos'
                  ? theme === 'dark'
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-black'
                  : theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-600 hover:text-black'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Directorio Clubes (18)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CLASIFICACIÓN OFICIAL (18 EQUIPOS) */}
      {/* ========================================================================= */}
      {activeTab === 'clasificacion' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div
            className={`p-3.5 border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
              theme === 'dark' ? 'bg-[#0d0d0d] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
            }`}
          >
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchEquipo}
                onChange={(e) => setSearchEquipo(e.target.value)}
                placeholder="Filtrar por nombre de club o filial..."
                className={`w-full pl-9 pr-3 py-1.5 text-xs font-mono border transition-colors focus:outline-hidden ${
                  theme === 'dark'
                    ? 'bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500 focus:border-white'
                    : 'bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 focus:border-black'
                }`}
              />
            </div>

            {/* Province Filter */}
            <div className="flex items-center gap-1.5 font-mono text-[11px] overflow-x-auto pb-1 sm:pb-0">
              <span className="text-neutral-400 text-xs hidden md:inline">Territorio:</span>
              {(['all', 'Bizkaia', 'Gipuzkoa', 'Álava'] as const).map((prov) => (
                <button
                  key={prov}
                  type="button"
                  onClick={() => setFilterProvincia(prov)}
                  className={`px-2.5 py-1 border uppercase tracking-wider font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    filterProvincia === prov
                      ? theme === 'dark'
                        ? 'bg-white text-black border-white'
                        : 'bg-black text-white border-black'
                      : theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                      : 'bg-neutral-100 border-neutral-300 text-neutral-600 hover:text-black'
                  }`}
                >
                  {prov === 'all' ? 'Todos (18)' : prov}
                </button>
              ))}
            </div>
          </div>

          {/* Standings Table Card */}
          <div
            className={`border overflow-hidden ${
              theme === 'dark' ? 'bg-[#0d0d0d] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
            }`}
          >
            <div className="p-3.5 border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-tight">
                  Clasificación Oficial • Jornada 4 (18 Clubes)
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-emerald-500 inline-block rounded-xs" />
                  1º Ascenso División de Honor Juvenil
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-500 inline-block rounded-xs" />
                  2º - 4º Zona Alta / Promoción
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-red-600 inline-block rounded-xs" />
                  15º - 18º Descenso Liga Vasca
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
                    <th className="py-2.5 px-3">Club / Equipo</th>
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
                <tbody className="divide-y divide-neutral-800/80">
                  {filteredClasificacion.map((eq) => {
                    const isGernika = eq.esGernika || eq.nombre.includes('GERNIKA');
                    const isDirectPromotion = eq.posicion === 1;
                    const isZonaAlta = eq.posicion >= 2 && eq.posicion <= 4;
                    const isRelegation = eq.posicion >= 15;

                    return (
                      <tr
                        key={eq.posicion}
                        className={`transition-colors ${
                          isGernika
                            ? theme === 'dark'
                              ? 'bg-neutral-900/95 font-bold text-white border-y-2 border-white'
                              : 'bg-neutral-200/90 font-bold text-black border-y-2 border-black'
                            : isDirectPromotion
                            ? theme === 'dark'
                              ? 'bg-emerald-950/20 hover:bg-emerald-950/30'
                              : 'bg-emerald-50/70 hover:bg-emerald-100/50'
                            : isRelegation
                            ? theme === 'dark'
                              ? 'bg-red-950/15 hover:bg-red-950/25'
                              : 'bg-red-50/60 hover:bg-red-100/40'
                            : theme === 'dark'
                            ? 'hover:bg-neutral-900/40'
                            : 'hover:bg-neutral-50'
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`w-6 h-6 inline-flex items-center justify-center font-bold text-[11px] rounded-xs ${
                              isDirectPromotion
                                ? 'bg-emerald-600 text-white font-black'
                                : isZonaAlta
                                ? 'bg-blue-900/80 text-blue-200 font-bold border border-blue-600'
                                : isRelegation
                                ? 'bg-red-900/80 text-red-200 font-bold border border-red-600'
                                : 'text-neutral-400'
                            }`}
                          >
                            {eq.posicion}
                          </span>
                        </td>
                        <td className="py-3 px-3 uppercase">
                          <div className="flex items-center gap-2">
                            <span className="font-bold tracking-tight">{eq.nombre}</span>
                            {isGernika && (
                              <span
                                className={`text-[9px] px-2 py-0.5 border uppercase font-black tracking-wider ${
                                  theme === 'dark'
                                    ? 'bg-white text-black border-white'
                                    : 'bg-black text-white border-black'
                                }`}
                              >
                                Gure Taldea • SD Gernika
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-black text-sm">
                          {eq.puntos}
                        </td>
                        <td className="py-3 px-3 text-center">{eq.partidosJugados}</td>
                        <td className="py-3 px-3 text-center text-emerald-400 font-semibold">{eq.partidosGanados}</td>
                        <td className="py-3 px-3 text-center text-neutral-400">{eq.partidosEmpatados}</td>
                        <td className="py-3 px-3 text-center text-red-400">{eq.partidosPerdidos}</td>
                        <td className="py-3 px-3 text-center">{eq.golesFavor}</td>
                        <td className="py-3 px-3 text-center">{eq.golesContra}</td>
                        <td className="py-3 px-3 text-center font-semibold">
                          {eq.diferenciaGoles > 0 ? `+${eq.diferenciaGoles}` : eq.diferenciaGoles}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {eq.racha && eq.racha.length > 0 ? (
                              eq.racha.map((r, i) => (
                                <span
                                  key={i}
                                  className={`w-4 h-4 text-[9px] font-bold flex items-center justify-center border uppercase rounded-xs ${
                                    r === 'V'
                                      ? 'bg-emerald-600 text-white border-emerald-500'
                                      : r === 'E'
                                      ? 'bg-neutral-600 text-white border-neutral-500'
                                      : 'bg-red-700 text-white border-red-600'
                                  }`}
                                >
                                  {r}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-neutral-500">-</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Rules Summary */}
            <div className="p-3.5 border-t border-neutral-800/80 bg-neutral-950/30 text-xs font-mono text-neutral-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>Normativa FVF: 34 jornadas a doble vuelta. Ascenso directo el 1º clasificado a División de Honor Juvenil RFEF.</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-neutral-400">
                SD Gernika Juvenil · Licencia Oficial FVF #1019
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CALENDARIO OFICIAL DE LAS 34 JORNADAS */}
      {/* ========================================================================= */}
      {activeTab === 'calendario' && (
        <div className="space-y-4">
          {/* Jornada Selector & Navigation Bar */}
          <div
            className={`p-4 border ${
              theme === 'dark' ? 'bg-[#0d0d0d] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
            }`}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {/* Stepper Navigation */}
              <div className="flex items-center gap-2 font-mono">
                <button
                  type="button"
                  disabled={selectedJornadaNum <= 1}
                  onClick={() => setSelectedJornadaNum((prev) => Math.max(1, prev - 1))}
                  className={`p-2 border transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                    theme === 'dark'
                      ? 'border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800'
                      : 'border-neutral-300 bg-neutral-100 text-black hover:bg-neutral-200'
                  }`}
                  aria-label="Jornada anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Dropdown Selector */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedJornadaNum}
                    onChange={(e) => setSelectedJornadaNum(Number(e.target.value))}
                    className={`px-3 py-1.5 text-xs font-mono font-bold border transition-colors cursor-pointer focus:outline-hidden ${
                      theme === 'dark'
                        ? 'bg-black border-neutral-700 text-white focus:border-white'
                        : 'bg-white border-neutral-300 text-black focus:border-black'
                    }`}
                  >
                    {CALENDARIO_OFICIAL_JORNADAS.map((j) => (
                      <option key={j.numero} value={j.numero} className="bg-black text-white">
                        Jornada {j.numero} ({j.fecha}) • {j.vuelta}ª Vuelta
                      </option>
                    ))}
                  </select>

                  <span className="text-xs font-mono text-neutral-400">
                    de 34
                  </span>
                </div>

                <button
                  type="button"
                  disabled={selectedJornadaNum >= 34}
                  onClick={() => setSelectedJornadaNum((prev) => Math.min(34, prev + 1))}
                  className={`p-2 border transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                    theme === 'dark'
                      ? 'border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800'
                      : 'border-neutral-300 bg-neutral-100 text-black hover:bg-neutral-200'
                  }`}
                  aria-label="Jornada siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Vuelta badge & Date info */}
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-1 text-[11px] font-mono font-bold border uppercase tracking-wider ${
                    currentJornada.vuelta === 1
                      ? 'border-neutral-700 bg-neutral-900 text-neutral-200'
                      : 'border-blue-700 bg-blue-950/40 text-blue-300'
                  }`}
                >
                  {currentJornada.vuelta}ª Vuelta
                </span>
                <span className="text-xs font-mono font-bold text-neutral-400">
                  Fecha Oficial: {currentJornada.fecha}
                </span>
              </div>

              {/* Filter: All 9 Matches vs SD Gernika only */}
              <div className="flex items-center gap-1 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setCalendarioMode('todos')}
                  className={`px-3 py-1.5 border font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    calendarioMode === 'todos'
                      ? theme === 'dark'
                        ? 'bg-white text-black border-white'
                        : 'bg-black text-white border-black'
                      : theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-800 text-neutral-400'
                      : 'bg-neutral-100 border-neutral-300 text-neutral-600'
                  }`}
                >
                  Todos los partidos (9)
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarioMode('gernika')}
                  className={`px-3 py-1.5 border font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    calendarioMode === 'gernika'
                      ? theme === 'dark'
                        ? 'bg-white text-black border-white'
                        : 'bg-black text-white border-black'
                      : theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-800 text-neutral-400'
                      : 'bg-neutral-100 border-neutral-300 text-neutral-600'
                  }`}
                >
                  Solo SD Gernika (34J)
                </button>
              </div>
            </div>

            {/* Quick Jornadas Pills Carousel */}
            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center gap-1 overflow-x-auto pb-1">
              <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold mr-1 shrink-0">
                Saltar a:
              </span>
              {CALENDARIO_OFICIAL_JORNADAS.map((j) => {
                const isSelected = j.numero === selectedJornadaNum;
                // Check if Gernika plays home in this jornada
                const gernikaMatch = j.partidos.find(
                  (p) => p.local.includes('GERNIKA') || p.visitante.includes('GERNIKA')
                );
                const isHome = gernikaMatch?.local.includes('GERNIKA');

                return (
                  <button
                    key={j.numero}
                    type="button"
                    onClick={() => setSelectedJornadaNum(j.numero)}
                    title={`Jornada ${j.numero}: ${j.fecha} (${isHome ? 'En Urbieta' : 'Fuera'})`}
                    className={`shrink-0 w-7 h-7 text-[10px] font-mono font-bold border transition-colors cursor-pointer flex items-center justify-center relative ${
                      isSelected
                        ? theme === 'dark'
                          ? 'bg-white text-black border-white ring-1 ring-white'
                          : 'bg-black text-white border-black ring-1 ring-black'
                        : theme === 'dark'
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white'
                        : 'bg-neutral-50 border-neutral-300 text-neutral-600 hover:border-neutral-500 hover:text-black'
                    }`}
                  >
                    {j.numero}
                    {isHome && (
                      <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode A: All 9 Matches for selected Jornada */}
          {calendarioMode === 'todos' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {currentJornada.partidos.map((partido, index) => {
                  const isGernikaMatch =
                    partido.local.includes('GERNIKA') || partido.visitante.includes('GERNIKA');
                  const gernikaIsLocal = partido.local.includes('GERNIKA');

                  // Lookup pitch info from local club
                  const localClub = EQUIPOS_LIGA_NACIONAL.find(
                    (c) =>
                      c.nombre.toUpperCase().includes(partido.local.toUpperCase()) ||
                      partido.local.toUpperCase().includes(c.nombre.toUpperCase())
                  );

                  return (
                    <div
                      key={index}
                      className={`p-4 border transition-all ${
                        isGernikaMatch
                          ? theme === 'dark'
                            ? 'bg-neutral-900/90 border-white ring-1 ring-white/50 shadow-md'
                            : 'bg-neutral-100 border-black ring-1 ring-black/30 shadow-md'
                          : theme === 'dark'
                          ? 'bg-[#0d0d0d] border-neutral-800 hover:border-neutral-700'
                          : 'bg-white border-neutral-300 shadow-xs hover:border-neutral-400'
                      }`}
                    >
                      {/* Header of Match Card */}
                      <div className="flex items-center justify-between font-mono text-[11px] pb-2 mb-3 border-b border-neutral-800/80">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          <span className="font-bold text-neutral-400">
                            Jornada {currentJornada.numero}
                          </span>
                          <span className="text-neutral-600">•</span>
                          <span>{currentJornada.fecha}</span>
                        </div>

                        {isGernikaMatch ? (
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 border uppercase tracking-wider ${
                              theme === 'dark'
                                ? 'bg-white text-black border-white'
                                : 'bg-black text-white border-black'
                            }`}
                          >
                            ⭐ Partido SD Gernika
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-neutral-400">
                            Oficial FVF
                          </span>
                        )}
                      </div>

                      {/* Opponents & Score */}
                      <div className="grid grid-cols-12 items-center gap-2 my-2 font-mono">
                        {/* Local */}
                        <div className="col-span-5 text-left">
                          <span
                            className={`font-black text-xs sm:text-sm uppercase block truncate ${
                              gernikaIsLocal ? 'text-emerald-400 underline decoration-2' : ''
                            }`}
                            title={partido.local}
                          >
                            {partido.local}
                          </span>
                          <span className="text-[10px] text-neutral-500 uppercase">Local</span>
                        </div>

                        {/* VS or Result */}
                        <div className="col-span-2 text-center">
                          {partido.golesLocal !== undefined && partido.golesVisitante !== undefined ? (
                            <span className="font-black text-base px-2 py-0.5 bg-black text-white border border-neutral-700 inline-block">
                              {partido.golesLocal} - {partido.golesVisitante}
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold px-2 py-0.5 border border-neutral-700 text-neutral-400 uppercase">
                              VS
                            </span>
                          )}
                        </div>

                        {/* Visitante */}
                        <div className="col-span-5 text-right">
                          <span
                            className={`font-black text-xs sm:text-sm uppercase block truncate ${
                              isGernikaMatch && !gernikaIsLocal
                                ? 'text-emerald-400 underline decoration-2'
                                : ''
                            }`}
                            title={partido.visitante}
                          >
                            {partido.visitante}
                          </span>
                          <span className="text-[10px] text-neutral-500 uppercase">Visitante</span>
                        </div>
                      </div>

                      {/* Pitch & Stadium Info */}
                      <div className="pt-2.5 mt-2 border-t border-neutral-800/80 flex items-center justify-between font-mono text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1 truncate max-w-[220px]">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{localClub?.campo || 'Campo oficial federativo'}</span>
                        </span>
                        {localClub && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 border uppercase font-bold ${
                              localClub.tipoHierba.includes('(HA)')
                                ? 'border-neutral-700 bg-neutral-900 text-neutral-300'
                                : 'border-emerald-800 bg-emerald-950 text-emerald-300'
                            }`}
                          >
                            {localClub.tipoHierba}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mode B: All 34 Matches of SD GERNIKA */}
          {calendarioMode === 'gernika' && (
            <div className="space-y-3">
              <div className="p-3 border font-mono text-xs text-neutral-400 flex items-center justify-between">
                <span>Mostrando el calendario oficial íntegro de la <strong>SD Gernika Juvenil</strong> (34 partidos).</span>
                <span className="text-[10px] uppercase font-bold">17 en Urbieta • 17 a domicilio</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {partidos.map((partido) => {
                  const isFinished = partido.estado === 'Finalizado';

                  return (
                    <div
                      key={partido.id}
                      onClick={() => setSelectedJornadaNum(partido.jornada)}
                      className={`p-4 border transition-all cursor-pointer ${
                        selectedJornadaNum === partido.jornada
                          ? theme === 'dark'
                            ? 'bg-neutral-900/90 border-white ring-1 ring-white shadow-md'
                            : 'bg-neutral-100 border-black ring-1 ring-black shadow-md'
                          : theme === 'dark'
                          ? 'bg-[#0d0d0d] border-neutral-800 hover:border-neutral-700'
                          : 'bg-white border-neutral-300 shadow-xs hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] pb-2 mb-3 border-b border-neutral-800/80">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black uppercase">Jornada {partido.jornada}</span>
                          <span className="text-neutral-600">•</span>
                          <span>{partido.fecha}</span>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 border uppercase ${
                            isFinished
                              ? 'bg-neutral-800 border-neutral-700 text-neutral-300'
                              : 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                          }`}
                        >
                          {partido.estado}
                        </span>
                      </div>

                      <div className="flex items-center justify-between my-2 font-mono">
                        <div className="text-left flex-1">
                          <span className="font-black text-xs sm:text-sm uppercase block truncate">
                            {partido.esLocal ? 'SD GERNIKA JUVENIL' : partido.rival}
                          </span>
                          <span className="text-[10px] text-neutral-500 uppercase">
                            {partido.esLocal ? 'Local (Urbieta)' : 'Visitante'}
                          </span>
                        </div>

                        <div className="px-3 text-center">
                          {isFinished ? (
                            <span className="text-lg font-black tracking-wider">
                              {partido.golesFavor} - {partido.golesContra}
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-neutral-400">
                              {partido.hora}h
                            </span>
                          )}
                        </div>

                        <div className="text-right flex-1">
                          <span className="font-black text-xs sm:text-sm uppercase block truncate">
                            {partido.esLocal ? partido.rival : 'SD GERNIKA JUVENIL'}
                          </span>
                          <span className="text-[10px] text-neutral-500 uppercase">
                            {partido.esLocal ? 'Visitante' : 'Local'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2.5 mt-2 border-t border-neutral-800/80 flex items-center justify-between font-mono text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1 truncate max-w-[240px]">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{partido.estadio}</span>
                        </span>
                        <span className="text-[10px] font-bold uppercase">
                          {partido.jornada <= 17 ? '1ª Vuelta' : '2ª Vuelta'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DIRECTORIO DE EQUIPOS Y CAMPOS RIVALES (18 CLUBES) */}
      {/* ========================================================================= */}
      {activeTab === 'equipos' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div
            className={`p-3.5 border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${
              theme === 'dark' ? 'bg-[#0d0d0d] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
            }`}
          >
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchClub}
                onChange={(e) => setSearchClub(e.target.value)}
                placeholder="Buscar por club, campo o localidad..."
                className={`w-full pl-9 pr-3 py-1.5 text-xs font-mono border transition-colors focus:outline-hidden ${
                  theme === 'dark'
                    ? 'bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500 focus:border-white'
                    : 'bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 focus:border-black'
                }`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
              {/* Province filter */}
              <div className="flex items-center gap-1">
                {(['all', 'Bizkaia', 'Gipuzkoa', 'Álava'] as const).map((prov) => (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => setFilterClubProvincia(prov)}
                    className={`px-2.5 py-1 border uppercase tracking-wider font-bold transition-colors cursor-pointer ${
                      filterClubProvincia === prov
                        ? theme === 'dark'
                          ? 'bg-white text-black border-white'
                          : 'bg-black text-white border-black'
                        : theme === 'dark'
                        ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        : 'bg-neutral-100 border-neutral-300 text-neutral-600 hover:text-black'
                    }`}
                  >
                    {prov === 'all' ? 'Todos' : prov}
                  </button>
                ))}
              </div>

              {/* Pitch type filter */}
              <div className="flex items-center gap-1">
                {(['all', 'HA', 'HN'] as const).map((sup) => (
                  <button
                    key={sup}
                    type="button"
                    onClick={() => setFilterSuperficie(sup)}
                    className={`px-2.5 py-1 border uppercase tracking-wider font-bold transition-colors cursor-pointer ${
                      filterSuperficie === sup
                        ? theme === 'dark'
                          ? 'bg-white text-black border-white'
                          : 'bg-black text-white border-black'
                        : theme === 'dark'
                        ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        : 'bg-neutral-100 border-neutral-300 text-neutral-600 hover:text-black'
                    }`}
                  >
                    {sup === 'all' ? 'Cualquier césped' : sup === 'HA' ? 'Hierba Artif.' : 'Hierba Natural'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid of 18 Clubs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClubs.map((club) => {
              const isGernika = club.nombre.includes('GERNIKA');

              // Find matches vs Gernika in calendar
              const matchIda = CALENDARIO_OFICIAL_JORNADAS.slice(0, 17).find((j) =>
                j.partidos.some(
                  (p) =>
                    (p.local.toUpperCase().includes(club.nombre.toUpperCase()) &&
                      p.visitante.includes('GERNIKA')) ||
                    (p.visitante.toUpperCase().includes(club.nombre.toUpperCase()) &&
                      p.local.includes('GERNIKA'))
                )
              );

              const matchVuelta = CALENDARIO_OFICIAL_JORNADAS.slice(17).find((j) =>
                j.partidos.some(
                  (p) =>
                    (p.local.toUpperCase().includes(club.nombre.toUpperCase()) &&
                      p.visitante.includes('GERNIKA')) ||
                    (p.visitante.toUpperCase().includes(club.nombre.toUpperCase()) &&
                      p.local.includes('GERNIKA'))
                )
              );

              return (
                <div
                  key={club.numero}
                  className={`p-4 border flex flex-col justify-between transition-all ${
                    isGernika
                      ? theme === 'dark'
                        ? 'bg-neutral-900/90 border-white ring-1 ring-white/60 shadow-lg'
                        : 'bg-neutral-100 border-black ring-1 ring-black/40 shadow-lg'
                      : theme === 'dark'
                      ? 'bg-[#0d0d0d] border-neutral-800 hover:border-neutral-700'
                      : 'bg-white border-neutral-300 shadow-xs hover:border-neutral-400'
                  }`}
                >
                  <div>
                    {/* Club Header */}
                    <div className="flex items-start justify-between gap-2 pb-2.5 mb-2.5 border-b border-neutral-800/80">
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 border uppercase ${
                              theme === 'dark'
                                ? 'border-neutral-700 bg-neutral-900 text-neutral-300'
                                : 'border-neutral-300 bg-neutral-100 text-neutral-800'
                            }`}
                          >
                            Cod #{club.codigo}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400 font-semibold">
                            {club.provincia} • {club.localidad}
                          </span>
                        </div>
                        <h3 className="font-black text-sm uppercase tracking-tight">
                          {club.nombre}
                        </h3>
                      </div>

                      {isGernika ? (
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 border uppercase tracking-wider ${
                            theme === 'dark'
                              ? 'bg-white text-black border-white'
                              : 'bg-black text-white border-black'
                          }`}
                        >
                          NUESTRO CLUB
                        </span>
                      ) : (
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 border uppercase font-bold ${
                            club.tipoHierba.includes('(HA)')
                              ? 'border-neutral-700 text-neutral-400'
                              : 'border-emerald-800 bg-emerald-950/40 text-emerald-300'
                          }`}
                        >
                          {club.tipoHierba.includes('(HA)') ? 'Hierba Artif.' : 'Hierba Natural'}
                        </span>
                      )}
                    </div>

                    {/* Stadium / Pitch */}
                    <div className="space-y-1.5 font-mono text-xs">
                      <div className="flex items-start gap-1.5 text-neutral-300">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-neutral-400 mt-0.5" />
                        <div>
                          <span className="font-bold block">{club.campo}</span>
                          <span className="text-[10px] text-neutral-500 block">
                            {club.direccion}
                          </span>
                        </div>
                      </div>

                      {/* Contact Info */}
                      {(club.telefono || club.contacto) && (
                        <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex flex-col gap-0.5">
                          {club.contacto && (
                            <span className="truncate">Contacto: <strong className="text-neutral-300">{club.contacto}</strong></span>
                          )}
                          {club.telefono && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-neutral-500" />
                              {club.telefono}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Kit colors */}
                      <div className="pt-2 border-t border-neutral-800/80 text-[11px]">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Shirt className="w-3 h-3 text-neutral-400" />
                          <span className="font-bold text-[10px] uppercase text-neutral-400">1ª Equipación:</span>
                        </div>
                        <p className="text-[10px] text-neutral-300 pl-4">
                          {club.primeraEquipacion.camiseta} · {club.primeraEquipacion.pantalon} · {club.primeraEquipacion.medias}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Gernika Match Dates (Ida & Vuelta) */}
                  {!isGernika && (
                    <div className="pt-3 mt-3 border-t border-neutral-800/80 font-mono text-[10px] bg-neutral-950/20 p-2">
                      <span className="font-bold text-neutral-400 uppercase block mb-1">
                        Duelos vs SD Gernika:
                      </span>
                      <div className="flex items-center justify-between text-neutral-300">
                        <span>
                          Ida: <strong>J{matchIda?.numero || '-'}</strong> ({matchIda?.fecha || '-'})
                        </span>
                        <span>
                          Vuelta: <strong>J{matchVuelta?.numero || '-'}</strong> ({matchVuelta?.fecha || '-'})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
