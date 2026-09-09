import React, { useState } from 'react';
import { Player } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Eye,
  Edit2,
  Trash2,
  Search,
  UserPlus,
  Calendar,
  Grid,
  List,
  Shield,
  Clock,
  Layers,
  UploadCloud,
} from 'lucide-react';

interface PlantillaProps {
  players: Player[];
  onOpenPlayerModal: (player: Player) => void;
  onEditPlayer: (player: Player) => void;
  onDeletePlayer: (id: string | number) => void;
  onAddNewPlayer: () => void;
  onOpenSupabaseModal?: () => void;
}

export type CategoriaLinea = 'porteros' | 'defensas' | 'mediocentros' | 'delanteros';

/**
 * Categoriza cada futbolista según su posición y demarcación táctica
 */
export function getPlayerCategory(player: Player): CategoriaLinea {
  const pos = (player.posicion || '').toLowerCase();
  const tac = (player.posicionTactico || '').toUpperCase();

  // 1. Porteros
  if (
    tac === 'POR' ||
    pos.includes('porter') ||
    pos.includes('atezain') ||
    pos.includes('goalkeeper')
  ) {
    return 'porteros';
  }

  // 2. Defensas
  if (
    ['LD', 'LI', 'DFC', 'DFC1', 'DFC2', 'CAD', 'DF'].includes(tac) ||
    pos.includes('defensa') ||
    pos.includes('lateral') ||
    pos.includes('central') ||
    pos.includes('atzelari') ||
    pos.includes('carrilero')
  ) {
    return 'defensas';
  }

  // 3. Mediocentros
  if (
    ['MC', 'MCD', 'MCO', 'MI', 'MD', 'MED'].includes(tac) ||
    pos.includes('medio') ||
    pos.includes('pivote') ||
    pos.includes('interior') ||
    pos.includes('mediapunta') ||
    pos.includes('puntaerdia') ||
    pos.includes('euskarri') ||
    pos.includes('erdilari')
  ) {
    return 'mediocentros';
  }

  // 4. Delanteros (Extremos, Puntas, Delanteros centro)
  return 'delanteros';
}

/**
 * Fechas de nacimiento reales/deterministas para la plantilla Juvenil Nacional 26/27
 */
const BIRTH_DATES_MAP: Record<number, { fecha: string; edad: number }> = {
  1: { fecha: '12/02/2008', edad: 18 },
  2: { fecha: '05/04/2008', edad: 18 },
  3: { fecha: '18/06/2008', edad: 18 },
  4: { fecha: '23/01/2008', edad: 18 },
  5: { fecha: '14/09/2008', edad: 18 },
  6: { fecha: '03/05/2008', edad: 18 },
  7: { fecha: '11/11/2008', edad: 17 },
  8: { fecha: '29/03/2008', edad: 18 },
  9: { fecha: '07/08/2008', edad: 18 },
  10: { fecha: '19/02/2009', edad: 17 },
  11: { fecha: '30/10/2008', edad: 17 },
  12: { fecha: '15/05/2009', edad: 17 },
  13: { fecha: '20/04/2010', edad: 16 },
  14: { fecha: '08/01/2009', edad: 17 },
  15: { fecha: '16/07/2008', edad: 18 },
  16: { fecha: '25/08/2009', edad: 17 },
  17: { fecha: '04/12/2009', edad: 16 },
  18: { fecha: '10/06/2008', edad: 18 },
  19: { fecha: '14/04/2008', edad: 18 },
  20: { fecha: '02/03/2009', edad: 17 },
  21: { fecha: '18/09/2009', edad: 17 },
  22: { fecha: '27/05/2009', edad: 17 },
  23: { fecha: '13/11/2008', edad: 17 },
  24: { fecha: '09/07/2009', edad: 17 },
  25: { fecha: '22/10/2009', edad: 16 },
  26: { fecha: '11/03/2010', edad: 16 },
  27: { fecha: '19/06/2010', edad: 16 },
};

/**
 * Minutos, partidos jugados y titularidades acumuladas (J1 a J4 disputadas)
 */
const STATS_MAP: Record<number, { minutos: number; partidos: number; titular: number }> = {
  1: { minutos: 360, partidos: 4, titular: 4 },
  2: { minutos: 350, partidos: 4, titular: 4 },
  3: { minutos: 345, partidos: 4, titular: 4 },
  4: { minutos: 360, partidos: 4, titular: 4 },
  5: { minutos: 360, partidos: 4, titular: 4 },
  6: { minutos: 335, partidos: 4, titular: 4 },
  7: { minutos: 310, partidos: 4, titular: 3 },
  8: { minutos: 340, partidos: 4, titular: 4 },
  9: { minutos: 345, partidos: 4, titular: 4 },
  10: { minutos: 325, partidos: 4, titular: 4 },
  11: { minutos: 315, partidos: 4, titular: 4 },
  12: { minutos: 0, partidos: 0, titular: 0 },
  13: { minutos: 0, partidos: 0, titular: 0 },
  14: { minutos: 135, partidos: 3, titular: 1 },
  15: { minutos: 65, partidos: 3, titular: 0 },
  16: { minutos: 75, partidos: 3, titular: 0 },
  17: { minutos: 40, partidos: 2, titular: 0 },
  18: { minutos: 80, partidos: 2, titular: 0 },
  19: { minutos: 110, partidos: 4, titular: 0 },
  20: { minutos: 55, partidos: 2, titular: 0 },
  21: { minutos: 30, partidos: 1, titular: 0 },
  22: { minutos: 20, partidos: 1, titular: 0 },
  23: { minutos: 15, partidos: 1, titular: 0 },
  24: { minutos: 15, partidos: 1, titular: 0 },
  25: { minutos: 25, partidos: 1, titular: 0 },
  26: { minutos: 0, partidos: 0, titular: 0 },
  27: { minutos: 0, partidos: 0, titular: 0 },
};

/**
 * Extrae o calcula los datos requeridos por la ficha
 */
export function getPlayerCardData(player: Player) {
  const d = Number(player.dorsal) || 0;
  const defBirth = BIRTH_DATES_MAP[d];
  const defStats = STATS_MAP[d];

  const birthYear = player.nacimiento || (defBirth ? 2008 : 2008);
  const fechaNacimiento =
    player.fechaNacimiento ||
    (defBirth ? defBirth.fecha : `15/06/${birthYear}`);
  const edad =
    player.edad ??
    (defBirth ? defBirth.edad : Math.max(15, 2026 - birthYear));

  const minutos =
    player.minutosJugados ??
    (defStats ? defStats.minutos : player.esTitular ? 340 : 45);
  const partidosJugados =
    player.partidosJugados ??
    (defStats ? defStats.partidos : player.esTitular ? 4 : 1);
  const partidosTitular =
    player.partidosTitular ??
    (defStats ? defStats.titular : player.esTitular ? 4 : 0);

  return {
    fechaNacimiento,
    edad,
    minutos,
    partidosJugados,
    partidosTitular,
  };
}

export const Plantilla: React.FC<PlantillaProps> = ({
  players,
  onOpenPlayerModal,
  onEditPlayer,
  onDeletePlayer,
  onAddNewPlayer,
  onOpenSupabaseModal,
}) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPos, setFilterPos] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Filtrado general por texto de búsqueda
  const matchingPlayers = players
    .filter((j) => {
      const q = searchTerm.toLowerCase().trim();
      if (!q) return true;
      return (
        j.nombre.toLowerCase().includes(q) ||
        String(j.dorsal).includes(q) ||
        (j.posicion && j.posicion.toLowerCase().includes(q)) ||
        (j.posicionEuskera && j.posicionEuskera.toLowerCase().includes(q)) ||
        (j.telefono && j.telefono.toLowerCase().includes(q)) ||
        (j.email && j.email.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => a.dorsal - b.dorsal);

  // Definición de las 4 secciones estrictas en orden:
  // 1. Porteros -> 2. Defensas -> 3. Mediocentros -> 4. Delanteros
  const sections: Array<{
    key: CategoriaLinea;
    nombre: string;
    nombreEuskera: string;
    descripcion: string;
    badgeClase: string;
    borderClase: string;
    icon: string;
  }> = [
    {
      key: 'porteros',
      nombre: 'Porteros',
      nombreEuskera: 'Atezainak',
      descripcion: 'Seguridad bajo palos, juego aéreo y salida de balón',
      badgeClase:
        theme === 'dark'
          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
          : 'bg-amber-100 text-amber-900 border-amber-300',
      borderClase:
        theme === 'dark' ? 'border-amber-500/30' : 'border-amber-300',
      icon: '🧤',
    },
    {
      key: 'defensas',
      nombre: 'Defensas',
      nombreEuskera: 'Atzelariak',
      descripcion: 'Centrales expeditivos y laterales con recorrido',
      badgeClase:
        theme === 'dark'
          ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
          : 'bg-blue-100 text-blue-900 border-blue-300',
      borderClase: theme === 'dark' ? 'border-blue-500/30' : 'border-blue-300',
      icon: '🛡️',
    },
    {
      key: 'mediocentros',
      nombre: 'Mediocentros',
      nombreEuskera: 'Erdilariak',
      descripcion: 'Equilibrio posicional, creatividad y distribución entre líneas',
      badgeClase:
        theme === 'dark'
          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
          : 'bg-emerald-100 text-emerald-900 border-emerald-300',
      borderClase:
        theme === 'dark' ? 'border-emerald-500/30' : 'border-emerald-300',
      icon: '⚙️',
    },
    {
      key: 'delanteros',
      nombre: 'Delanteros',
      nombreEuskera: 'Aurrelariak',
      descripcion: 'Velocidad exterior, desborde 1vs1 y rematadores de área',
      badgeClase:
        theme === 'dark'
          ? 'bg-red-500/15 text-red-300 border-red-500/30'
          : 'bg-red-100 text-red-900 border-red-300',
      borderClase: theme === 'dark' ? 'border-red-500/30' : 'border-red-300',
      icon: '⚡',
    },
  ];

  // Agrupamos futbolistas en los 4 compartimentos
  const grouped = {
    porteros: matchingPlayers.filter((p) => getPlayerCategory(p) === 'porteros'),
    defensas: matchingPlayers.filter((p) => getPlayerCategory(p) === 'defensas'),
    mediocentros: matchingPlayers.filter((p) => getPlayerCategory(p) === 'mediocentros'),
    delanteros: matchingPlayers.filter((p) => getPlayerCategory(p) === 'delanteros'),
  };

  // Secciones a mostrar según el filtro activo
  const visibleSections = sections.filter((sec) => {
    if (filterPos === 'all') return true;
    if (filterPos === 'porteros' && sec.key === 'porteros') return true;
    if (filterPos === 'defensas' && sec.key === 'defensas') return true;
    if (filterPos === 'mediocentros' && sec.key === 'mediocentros') return true;
    if (filterPos === 'delanteros' && sec.key === 'delanteros') return true;
    return false;
  });

  return (
    <div id="tab-lista" className="w-full space-y-6">
      {/* Barra Superior: Búsqueda, Filtro rápido de Líneas y Añadir Jugador */}
      <div
        className={`flex flex-col gap-3 p-4 border transition-colors ${
          theme === 'dark'
            ? 'bg-[#111111] border-neutral-800'
            : 'bg-white border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Campo de Búsqueda */}
          <div className="relative flex-1">
            <Search
              className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            />
            <input
              type="text"
              placeholder="Buscar por dorsal, nombre o demarcación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-xs font-mono transition-colors focus:outline-none ${
                theme === 'dark'
                  ? 'bg-black border border-neutral-700 text-white placeholder-neutral-500 focus:border-white'
                  : 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-black'
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle de Vista: Fichas vs Tabla */}
            <div
              className={`flex items-center p-0.5 border rounded ${
                theme === 'dark'
                  ? 'bg-black border-neutral-700'
                  : 'bg-neutral-100 border-neutral-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'cards'
                    ? theme === 'dark'
                      ? 'bg-neutral-800 text-white'
                      : 'bg-white text-black shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Vista de Fichas (Tarjetas)"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? theme === 'dark'
                      ? 'bg-neutral-800 text-white'
                      : 'bg-white text-black shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Vista de Tabla Comparativa"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Botón Subir 27 Jugadores a Supabase */}
            {onOpenSupabaseModal && (
              <button
                type="button"
                onClick={onOpenSupabaseModal}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider font-mono border flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                  theme === 'dark'
                    ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400'
                    : 'bg-emerald-50 border-emerald-600 text-emerald-900 hover:bg-emerald-100 shadow-xs'
                }`}
                title="Volcar o sincronizar los 27 jugadores en Supabase"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Subir {players.length} Jugadores</span>
              </button>
            )}

            {/* Botón Añadir Jugador */}
            <button
              type="button"
              onClick={onAddNewPlayer}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider font-mono border flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                theme === 'dark'
                  ? 'bg-white text-black hover:bg-neutral-200 border-white'
                  : 'bg-black text-white hover:bg-neutral-800 border-black shadow-xs'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              + Añadir Jugador
            </button>
          </div>
        </div>

        {/* Filtros de Demarcación */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800/40 font-mono text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span
              className={`text-[11px] uppercase tracking-wider font-bold mr-1 flex items-center gap-1 ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              <Layers className="w-3 h-3" />
              Línea:
            </span>

            {[
              { id: 'all', label: 'Todas las Líneas', count: matchingPlayers.length },
              { id: 'porteros', label: 'Porteros', count: grouped.porteros.length },
              { id: 'defensas', label: 'Defensas', count: grouped.defensas.length },
              { id: 'mediocentros', label: 'Mediocentros', count: grouped.mediocentros.length },
              { id: 'delanteros', label: 'Delanteros', count: grouped.delanteros.length },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterPos(f.id)}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  filterPos === f.id
                    ? theme === 'dark'
                      ? 'bg-white text-black font-black shadow-xs'
                      : 'bg-black text-white font-black shadow-xs'
                    : theme === 'dark'
                    ? 'bg-neutral-900 text-neutral-400 hover:text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:text-black'
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>

          <div
            className={`text-[11px] ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
            }`}
          >
            Plantilla Oficial: <span className="font-bold text-white/neutral-900">{players.length} jugadores</span>
          </div>
        </div>
      </div>

      {/* VISTA 1: FICHAS DIVIDIDAS POR LÍNEAS (PORTEROS -> DEFENSAS -> MEDIOCENTROS -> DELANTEROS) */}
      {viewMode === 'cards' ? (
        <div className="space-y-8">
          {visibleSections.map((sec) => {
            const list = grouped[sec.key];

            return (
              <section key={`sec-${sec.key}`} className="space-y-3">
                {/* Cabecera de Categoría de Línea */}
                <div
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b ${
                    theme === 'dark' ? 'border-neutral-800' : 'border-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl" role="img" aria-label={sec.nombre}>
                      {sec.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2
                          className={`font-black text-base sm:text-lg uppercase tracking-tight ${
                            theme === 'dark' ? 'text-white' : 'text-neutral-900'
                          }`}
                        >
                          {sec.nombre}
                        </h2>
                        <span
                          className={`text-xs font-mono opacity-60 italic lowercase ${
                            theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                          }`}
                        >
                          ({sec.nombreEuskera})
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded border self-start sm:self-auto ${sec.badgeClase}`}
                  >
                    {list.length} {list.length === 1 ? 'futbolista' : 'futbolistas'}
                  </span>
                </div>

                {/* Si no hay jugadores en esta sección tras el filtro */}
                {list.length === 0 ? (
                  <div
                    className={`p-6 text-center text-xs font-mono border rounded-lg ${
                      theme === 'dark'
                        ? 'border-neutral-800 text-neutral-500 bg-neutral-950/40'
                        : 'border-neutral-200 text-neutral-400 bg-neutral-50'
                    }`}
                  >
                    No se encontraron jugadores en la línea de {sec.nombre.toLowerCase()} con los filtros actuales.
                  </div>
                ) : (
                  /* Grid de Fichas */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {list.map((j) => {
                      const data = getPlayerCardData(j);

                      return (
                        <div
                          key={`ficha-${j.id || j.dorsal}`}
                          className={`p-4 border rounded-lg transition-all flex flex-col justify-between group ${
                            theme === 'dark'
                              ? 'bg-[#111111] border-neutral-800 hover:border-neutral-600'
                              : 'bg-white border-neutral-300 hover:border-neutral-400 shadow-xs'
                          }`}
                        >
                          <div>
                            {/* 1. Nombre y Apellido junto con el dorsal (SIN titular ni suplente) */}
                            <div className="flex items-start justify-between gap-2.5 mb-1.5">
                              <h3
                                className={`font-black text-base uppercase tracking-tight leading-tight ${
                                  theme === 'dark' ? 'text-white' : 'text-neutral-900'
                                }`}
                              >
                                {j.nombre}
                              </h3>
                              <span
                                className={`px-2 py-0.5 rounded font-black font-mono text-sm border shrink-0 ${
                                  theme === 'dark'
                                    ? 'bg-neutral-900 text-white border-neutral-700'
                                    : 'bg-neutral-100 text-black border-neutral-300 shadow-2xs'
                                }`}
                              >
                                #{j.dorsal}
                              </span>
                            </div>

                            {/* 2. Posición (abajo del nombre y dorsal) */}
                            <div
                              className={`text-xs font-mono font-semibold uppercase tracking-wider mb-2.5 ${
                                theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                              }`}
                            >
                              {j.posicion || 'Futbolista'}
                              {j.posicionEuskera && (
                                <span className="text-[11px] opacity-70 font-normal italic lowercase ml-1.5">
                                  • {j.posicionEuskera}
                                </span>
                              )}
                            </div>

                            {/* 3. Fecha de nacimiento junto con la edad */}
                            <div
                              className={`text-xs font-mono mb-3.5 flex items-center gap-1.5 ${
                                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                              }`}
                            >
                              <Calendar className="w-3.5 h-3.5 shrink-0 opacity-75" />
                              <span>
                                {data.fechaNacimiento}{' '}
                                <span className="font-semibold text-neutral-300 dark:text-neutral-200">
                                  ({data.edad} años)
                                </span>
                              </span>
                            </div>

                            {/* 4. Minutos jugados, Partidos jugados y Titular */}
                            <div
                              className={`grid grid-cols-3 gap-1.5 py-2.5 px-3 rounded border mb-4 font-mono text-center transition-colors ${
                                theme === 'dark'
                                  ? 'bg-black/60 border-neutral-800'
                                  : 'bg-neutral-50 border-neutral-200'
                              }`}
                            >
                              <div>
                                <span className="text-[9px] text-neutral-400 uppercase font-semibold block mb-0.5 tracking-wider">
                                  Minutos
                                </span>
                                <span
                                  className={`text-sm font-black ${
                                    theme === 'dark' ? 'text-white' : 'text-neutral-900'
                                  }`}
                                >
                                  {data.minutos}’
                                </span>
                              </div>
                              <div
                                className={`border-x ${
                                  theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
                                }`}
                              >
                                <span className="text-[9px] text-neutral-400 uppercase font-semibold block mb-0.5 tracking-wider">
                                  Partidos
                                </span>
                                <span
                                  className={`text-sm font-black ${
                                    theme === 'dark' ? 'text-white' : 'text-neutral-900'
                                  }`}
                                >
                                  {data.partidosJugados}
                                </span>
                              </div>
                              <div>
                                <span className="text-[9px] text-neutral-400 uppercase font-semibold block mb-0.5 tracking-wider">
                                  Titular
                                </span>
                                <span
                                  className={`text-sm font-black ${
                                    theme === 'dark' ? 'text-white' : 'text-neutral-900'
                                  }`}
                                >
                                  {data.partidosTitular}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 5. Debajo: Ver Ficha, Editar y Borrar */}
                          <div
                            className={`flex items-center justify-between pt-3 border-t ${
                              theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => onOpenPlayerModal(j)}
                              className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all cursor-pointer ${
                                theme === 'dark'
                                  ? 'bg-neutral-900 border-neutral-700 text-white hover:border-white hover:bg-neutral-800'
                                  : 'bg-neutral-100 border-neutral-300 text-black hover:border-black hover:bg-neutral-200 shadow-2xs'
                              }`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Ver Ficha
                            </button>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => onEditPlayer(j)}
                                className={`p-1.5 rounded border transition-colors cursor-pointer ${
                                  theme === 'dark'
                                    ? 'border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-600 hover:bg-neutral-800'
                                    : 'border-neutral-300 text-neutral-700 hover:text-black hover:border-neutral-400 hover:bg-neutral-100'
                                }`}
                                title="Editar Jugador"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeletePlayer(j.id)}
                                className="p-1.5 rounded border border-red-900/40 text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors cursor-pointer"
                                title="Borrar Jugador"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        /* VISTA 2: TABLA POR LÍNEAS (PORTEROS -> DEFENSAS -> MEDIOCENTROS -> DELANTEROS) */
        <div className="space-y-6">
          {visibleSections.map((sec) => {
            const list = grouped[sec.key];
            if (list.length === 0) return null;

            return (
              <div
                key={`tbl-${sec.key}`}
                className={`border overflow-x-auto transition-colors rounded-lg ${
                  theme === 'dark'
                    ? 'border-neutral-800 bg-[#0a0a0a]'
                    : 'border-neutral-300 bg-white shadow-xs'
                }`}
              >
                <div
                  className={`py-2.5 px-4 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between border-b ${
                    theme === 'dark'
                      ? 'bg-neutral-900/90 border-neutral-800 text-white'
                      : 'bg-neutral-100 border-neutral-300 text-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{sec.icon}</span>
                    <span>{sec.nombre}</span>
                    <span className="opacity-60 lowercase italic">({sec.nombreEuskera})</span>
                  </div>
                  <span className="text-[11px] opacity-80">{list.length} futbolistas</span>
                </div>

                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr
                      className={`border-b uppercase tracking-wider text-[11px] transition-colors ${
                        theme === 'dark'
                          ? 'border-neutral-800 bg-black/40 text-neutral-400'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-600'
                      }`}
                    >
                      <th className="py-2.5 px-4 w-16 text-center font-bold">Dorsal</th>
                      <th className="py-2.5 px-4 font-bold">Nombre / Demarcación</th>
                      <th className="py-2.5 px-4">Fecha Nacimiento (Edad)</th>
                      <th className="py-2.5 px-4 text-center">Minutos</th>
                      <th className="py-2.5 px-4 text-center">Partidos</th>
                      <th className="py-2.5 px-4 text-center">Titular</th>
                      <th className="py-2.5 px-4 text-right font-bold w-40">Acciones</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      theme === 'dark' ? 'divide-neutral-800/80' : 'divide-neutral-200'
                    }`}
                  >
                    {list.map((j) => {
                      const data = getPlayerCardData(j);

                      return (
                        <tr
                          key={`row-${j.id || j.dorsal}`}
                          className={`transition-colors ${
                            theme === 'dark'
                              ? 'hover:bg-neutral-900/60'
                              : 'hover:bg-neutral-50'
                          }`}
                        >
                          <td
                            className={`py-3 px-4 text-center font-black text-sm ${
                              theme === 'dark' ? 'text-white' : 'text-neutral-900'
                            }`}
                          >
                            #{j.dorsal}
                          </td>
                          <td className="py-3 px-4">
                            <div
                              className={`font-black text-sm uppercase ${
                                theme === 'dark' ? 'text-white' : 'text-neutral-900'
                              }`}
                            >
                              {j.nombre}
                            </div>
                            <div
                              className={`text-[11px] uppercase tracking-wider ${
                                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                              }`}
                            >
                              {j.posicion || 'Futbolista'}
                              {j.posicionEuskera && (
                                <span className="opacity-70 lowercase italic ml-1">
                                  ({j.posicionEuskera})
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-xs">
                            {data.fechaNacimiento}{' '}
                            <span
                              className={`font-semibold ${
                                theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                              }`}
                            >
                              ({data.edad} años)
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-black">
                            {data.minutos}’
                          </td>
                          <td className="py-3 px-4 text-center font-black">
                            {data.partidosJugados}
                          </td>
                          <td className="py-3 px-4 text-center font-black">
                            {data.partidosTitular}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => onOpenPlayerModal(j)}
                                className={`px-2 py-1 rounded text-[11px] font-bold uppercase border transition-colors flex items-center gap-1 cursor-pointer ${
                                  theme === 'dark'
                                    ? 'border-neutral-700 text-neutral-300 hover:text-white hover:border-white'
                                    : 'border-neutral-300 text-neutral-700 hover:text-black hover:border-black'
                                }`}
                                title="Ver Ficha"
                              >
                                <Eye className="w-3 h-3" />
                                Ficha
                              </button>
                              <button
                                type="button"
                                onClick={() => onEditPlayer(j)}
                                className={`p-1.5 border rounded transition-colors cursor-pointer ${
                                  theme === 'dark'
                                    ? 'border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500'
                                    : 'border-neutral-300 text-neutral-600 hover:text-black hover:border-neutral-400'
                                }`}
                                title="Editar"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeletePlayer(j.id)}
                                className="p-1.5 border border-red-900/60 hover:border-red-500 rounded text-red-400 cursor-pointer"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}

      {/* Pie de Plantilla con Metadatos Oficiales */}
      <div
        className={`flex flex-wrap items-center justify-between text-xs font-mono px-1 pt-2 border-t ${
          theme === 'dark'
            ? 'text-neutral-400 border-neutral-800'
            : 'text-neutral-600 border-neutral-200'
        }`}
      >
        <div>
          Mostrando {matchingPlayers.length} de {players.length} futbolistas • SD Gernika Juvenil Nacional 2026-2027
        </div>
        <div>Urbieta Zelaia • Liga Nacional Grupo IV</div>
      </div>
    </div>
  );
};
