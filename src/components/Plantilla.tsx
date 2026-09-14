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
  GripVertical,
  Check,
  Move,
  ArrowRightLeft,
  Sparkles,
  MapPin,
  Maximize2,
  Columns,
} from 'lucide-react';
import { CampoTacticoVerde, TACTICAL_POSITIONS } from './CampoTacticoVerde';

interface PlantillaProps {
  players: Player[];
  onOpenPlayerModal: (player: Player) => void;
  onEditPlayer: (player: Player) => void;
  onDeletePlayer: (player: Player | string | number) => void;
  onAddNewPlayer: () => void;
  onOpenSupabaseModal?: () => void;
  onUpdatePlayer?: (player: Player) => void;
  onUpdatePlayerPosition?: (id: string | number, x: number, y: number) => void;
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

  // 4. Delanteros (o por defecto)
  return 'delanteros';
}

/**
 * Extrae y formatea de forma segura los datos estadísticos y de nacimiento de un jugador
 */
export function getPlayerCardData(player: Player): {
  fechaNacimiento: string;
  edad: number;
  minutos: number;
  partidosJugados: number;
  partidosTitular: number;
} {
  const currentYear = 2026;
  let fecha = player.fechaNacimiento || '';
  let anioNac = player.nacimiento;

  if (fecha && fecha.includes('/')) {
    const parts = fecha.split('/');
    if (parts.length === 3) {
      const parsedYear = parseInt(parts[2], 10);
      if (!isNaN(parsedYear) && parsedYear > 1990 && parsedYear < 2030) {
        anioNac = parsedYear;
      }
    }
  } else if (!fecha && anioNac) {
    fecha = `01/01/${anioNac}`;
  } else if (!fecha) {
    fecha = '2008';
    anioNac = 2008;
  }

  const edad = player.edad || (anioNac ? currentYear - anioNac : 18);
  const minutos =
    player.minutosJugados !== undefined && player.minutosJugados !== null
      ? player.minutosJugados
      : 0;

  const partidosJugados =
    player.partidosJugados !== undefined && player.partidosJugados !== null
      ? player.partidosJugados
      : Math.min(4, Math.ceil(minutos / 85));

  const partidosTitular =
    player.partidosTitular !== undefined && player.partidosTitular !== null
      ? player.partidosTitular
      : Math.min(partidosJugados, Math.floor(minutos / 70));

  return {
    fechaNacimiento: fecha,
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
  onUpdatePlayer,
  onUpdatePlayerPosition,
}) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPos, setFilterPos] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'split' | 'cards' | 'field' | 'table'>('split');

  // Estado del jugador seleccionado (para mostrar la bola roja en el campo verde)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(() => players[0] || null);

  // Estado para el Drag & Drop (deslizar ficha)
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null);
  const [dragOverSection, setDragOverSection] = useState<CategoriaLinea | null>(null);
  const [quickPosMenuPlayerId, setQuickPosMenuPlayerId] = useState<string | number | null>(null);

  // Mantener seleccionado el jugador activo y actualizarlo inmediatamente con los datos frescos
  React.useEffect(() => {
    if (players.length > 0) {
      if (selectedPlayer) {
        const fresh = players.find((p) => String(p.id) === String(selectedPlayer.id));
        if (fresh) {
          setSelectedPlayer(fresh);
        } else {
          setSelectedPlayer(players[0]);
        }
      } else {
        setSelectedPlayer(players[0]);
      }
    }
  }, [players]);

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
    lineColor: string;
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
      borderClase: theme === 'dark' ? 'border-amber-500/30' : 'border-amber-300',
      icon: '🧤',
      lineColor: 'border-amber-500 text-amber-500',
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
      lineColor: 'border-blue-500 text-blue-500',
    },
    {
      key: 'mediocentros',
      nombre: 'Mediocentros',
      nombreEuskera: 'Erdilariak',
      descripcion: 'Equilibrio posicional, creatividad y distribución',
      badgeClase:
        theme === 'dark'
          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
          : 'bg-emerald-100 text-emerald-900 border-emerald-300',
      borderClase: theme === 'dark' ? 'border-emerald-500/30' : 'border-emerald-300',
      icon: '⚙️',
      lineColor: 'border-emerald-500 text-emerald-500',
    },
    {
      key: 'delanteros',
      nombre: 'Delanteros',
      nombreEuskera: 'Aurrelariak',
      descripcion: 'Desborde exterior, verticalidad y eficacia goleadora',
      badgeClase:
        theme === 'dark'
          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
          : 'bg-rose-100 text-rose-900 border-rose-300',
      borderClase: theme === 'dark' ? 'border-rose-500/30' : 'border-rose-300',
      icon: '⚽',
      lineColor: 'border-rose-500 text-rose-500',
    },
  ];

  // Agrupación de jugadores
  const grouped: Record<CategoriaLinea, Player[]> = {
    porteros: [],
    defensas: [],
    mediocentros: [],
    delanteros: [],
  };

  matchingPlayers.forEach((j) => {
    const cat = getPlayerCategory(j);
    grouped[cat].push(j);
  });

  const visibleSections =
    filterPos === 'all'
      ? sections
      : sections.filter((s) => s.key === filterPos);

  // Mover jugador a otra línea al soltarlo sobre una sección
  const handleDropOnSection = (targetSection: CategoriaLinea) => {
    if (!draggedPlayer) return;

    let newPos = draggedPlayer.posicion;
    let newTac = draggedPlayer.posicionTactico;
    let newEusk = draggedPlayer.posicionEuskera;
    let newX = draggedPlayer.posicion_x ?? 50;
    let newY = draggedPlayer.posicion_y ?? 50;

    if (targetSection === 'porteros') {
      newPos = 'Portero';
      newTac = 'POR';
      newEusk = 'Atezaina';
      newX = 50;
      newY = 89;
    } else if (targetSection === 'defensas') {
      newPos = 'Defensa Central';
      newTac = 'DFC1';
      newEusk = 'Erdiko Atzelaria';
      newX = 62;
      newY = 78;
    } else if (targetSection === 'mediocentros') {
      newPos = 'Mediocentro';
      newTac = 'MC';
      newEusk = 'Erdilaria';
      newX = 50;
      newY = 50;
    } else if (targetSection === 'delanteros') {
      newPos = 'Delantero Centro';
      newTac = 'DC';
      newEusk = 'Aurrelaria';
      newX = 50;
      newY = 18;
    }

    const updated: Player = {
      ...draggedPlayer,
      posicion: newPos,
      posicionTactico: newTac,
      posicionEuskera: newEusk,
      posicion_x: newX,
      posicion_y: newY,
    };

    if (onUpdatePlayer) {
      onUpdatePlayer(updated);
    }
    setSelectedPlayer(updated);
    setDraggedPlayer(null);
    setDragOverSection(null);
  };

  // Cambio táctico desde el campo verde
  const handleTacticalPositionChange = (
    playerId: string | number,
    newCode: string,
    newX: number,
    newY: number,
    newLabel?: string,
    newEuskera?: string
  ) => {
    const target = players.find((p) => String(p.id) === String(playerId));
    if (!target) return;

    const updated: Player = {
      ...target,
      posicionTactico: newCode,
      posicion: newLabel || target.posicion,
      posicionEuskera: newEuskera || target.posicionEuskera,
      posicion_x: newX,
      posicion_y: newY,
    };

    if (onUpdatePlayer) {
      onUpdatePlayer(updated);
    }
    if (onUpdatePlayerPosition) {
      onUpdatePlayerPosition(playerId, newX, newY);
    }
    setSelectedPlayer(updated);
  };

  return (
    <div id="plantilla-view" className="space-y-6">
      {/* BARRA SUPERIOR DE ACCIONES Y CONTROLES */}
      <div
        className={`p-3.5 sm:p-4 rounded-xl border transition-colors flex flex-col gap-3 ${
          theme === 'dark' ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Campo de Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por dorsal, nombre, posición o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-lg text-xs font-mono border focus:outline-none transition-colors ${
                theme === 'dark'
                  ? 'bg-black/50 border-neutral-700 text-white focus:border-white placeholder:text-neutral-500'
                  : 'bg-neutral-50 border-neutral-300 text-black focus:border-black placeholder:text-neutral-400'
              }`}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Vistas y Acciones Principales */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Conmutador de Vistas: Dividida (Fichas + Campo Verde), Solo Fichas, Solo Campo Verde, Tabla */}
            <div
              className={`flex items-center p-1 rounded-lg border font-mono text-xs ${
                theme === 'dark' ? 'bg-black/50 border-neutral-800' : 'bg-neutral-100 border-neutral-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
                  viewMode === 'split'
                    ? theme === 'dark'
                      ? 'bg-neutral-800 text-white shadow-xs'
                      : 'bg-white text-black shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Vista Dividida: Fichas compactas + Campo verde con bola roja"
              >
                <Columns className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Fichas + Campo</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'cards'
                    ? theme === 'dark'
                      ? 'bg-neutral-800 text-white shadow-xs'
                      : 'bg-white text-black shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Vista de Fichas Compactas"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Solo Fichas</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('field')}
                className={`px-2.5 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'field'
                    ? theme === 'dark'
                      ? 'bg-neutral-800 text-white shadow-xs'
                      : 'bg-white text-black shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Vista de Campo Táctico Verde"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Campo</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'table'
                    ? theme === 'dark'
                      ? 'bg-neutral-800 text-white shadow-xs'
                      : 'bg-white text-black shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Vista de Tabla Comparativa"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tabla</span>
              </button>
            </div>

            {/* Botón Subir 27 Jugadores a Supabase */}
            {onOpenSupabaseModal && (
              <button
                type="button"
                onClick={onOpenSupabaseModal}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider font-mono border rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                  theme === 'dark'
                    ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400'
                    : 'bg-emerald-50 border-emerald-600 text-emerald-900 hover:bg-emerald-100 shadow-xs'
                }`}
                title="Volcar o sincronizar los 27 jugadores en Supabase"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Subir {players.length} Jugadores</span>
                <span className="md:hidden">Nube</span>
              </button>
            )}

            {/* Botón Añadir Jugador */}
            <button
              type="button"
              onClick={onAddNewPlayer}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider font-mono border rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                theme === 'dark'
                  ? 'bg-white text-black hover:bg-neutral-200 border-white'
                  : 'bg-black text-white hover:bg-neutral-800 border-black shadow-xs'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Jugador</span>
            </button>
          </div>
        </div>

        {/* Filtros de Demarcación y Ayuda Visual de Arrastre */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800/40 font-mono text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span
              className={`text-[11px] uppercase tracking-wider font-bold mr-1 flex items-center gap-1 ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              <Layers className="w-3 h-3" />
              Línea:
            </span>

            {[
              { id: 'all', label: 'Todas', count: matchingPlayers.length },
              { id: 'porteros', label: 'Porteros', count: grouped.porteros.length },
              { id: 'defensas', label: 'Defensas', count: grouped.defensas.length },
              { id: 'mediocentros', label: 'Medios', count: grouped.mediocentros.length },
              { id: 'delanteros', label: 'Delanteros', count: grouped.delanteros.length },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterPos(f.id)}
                className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
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
            className={`text-[11px] flex items-center gap-2 ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400">
              <Move className="w-3 h-3" />
              Desliza las fichas entre líneas o al campo verde
            </span>
            <span>
              Total: <strong className="text-white/neutral-900">{players.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CUERPO PRINCIPAL SEGÚN LA VISTA SELECCIONADA */}
      {/* ========================================================================= */}

      {/* VISTA DIVIDIDA (SPLIT): FICHAS COMPACTAS (IZQ) + CAMPO VERDE TÁCTICO (DCH) */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* COLUMNA IZQUIERDA: FICHAS MÁS PEQUEÑAS AGRUPADAS POR LÍNEA (7 cols en lg, 8 en xl) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            {visibleSections.map((sec) => {
              const list = grouped[sec.key];
              const isSectionDraggedOver = dragOverSection === sec.key;

              return (
                <section
                  key={`sec-split-${sec.key}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSection(sec.key);
                  }}
                  onDragLeave={() => setDragOverSection(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDropOnSection(sec.key);
                  }}
                  className={`space-y-2 p-3 rounded-xl border transition-all ${
                    isSectionDraggedOver
                      ? 'border-dashed border-2 border-emerald-400 bg-emerald-500/10 shadow-lg scale-[1.01]'
                      : theme === 'dark'
                      ? 'border-neutral-800/80 bg-neutral-950/40'
                      : 'border-neutral-200 bg-neutral-50/70'
                  }`}
                >
                  {/* Cabecera de Línea con botón de soltar */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800/60">
                    <div className="flex items-center gap-2">
                      <span className="text-base" role="img" aria-label={sec.nombre}>
                        {sec.icon}
                      </span>
                      <h2
                        className={`font-black text-sm uppercase tracking-tight ${
                          theme === 'dark' ? 'text-white' : 'text-neutral-900'
                        }`}
                      >
                        {sec.nombre}
                      </h2>
                      <span className="text-[11px] font-mono text-neutral-400 opacity-70 italic">
                        ({sec.nombreEuskera})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSectionDraggedOver && (
                        <span className="text-[10px] font-mono font-bold text-emerald-400 animate-pulse">
                          Suelta aquí para cambiar a {sec.nombre}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border ${sec.badgeClase}`}
                      >
                        {list.length}
                      </span>
                    </div>
                  </div>

                  {/* Grid de Fichas Compactas (más pequeñas) */}
                  {list.length === 0 ? (
                    <div
                      className={`p-4 text-center text-xs font-mono border border-dashed rounded-lg ${
                        theme === 'dark' ? 'border-neutral-800 text-neutral-500' : 'border-neutral-300 text-neutral-400'
                      }`}
                    >
                      Arrastra jugadores aquí para asignarlos a {sec.nombre.toLowerCase()}.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {list.map((j) => (
                        <CompactPlayerCard
                          key={`card-compact-${j.id || j.dorsal}`}
                          player={j}
                          isSelected={selectedPlayer ? String(selectedPlayer.id) === String(j.id) : false}
                          theme={theme}
                          onSelect={() => setSelectedPlayer(j)}
                          onOpenModal={() => onOpenPlayerModal(j)}
                          onEdit={() => onEditPlayer(j)}
                          onDelete={() => onDeletePlayer(j)}
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', String(j.id));
                            setDraggedPlayer(j);
                            setSelectedPlayer(j);
                          }}
                          onDragEnd={() => {
                            setDraggedPlayer(null);
                            setDragOverSection(null);
                          }}
                          isQuickPosOpen={quickPosMenuPlayerId === j.id}
                          toggleQuickPos={() =>
                            setQuickPosMenuPlayerId(quickPosMenuPlayerId === j.id ? null : j.id)
                          }
                          onQuickAssignPos={(posInfo) => {
                            handleTacticalPositionChange(
                              j.id,
                              posInfo.code,
                              posInfo.x,
                              posInfo.y,
                              posInfo.label,
                              posInfo.labelEuskera
                            );
                            setQuickPosMenuPlayerId(null);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          {/* COLUMNA DERECHA: EL CAMPO DE FÚTBOL VERDE CON LA BOLA ROJA (5 cols en lg, sticky) */}
          <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-4">
            <CampoTacticoVerde
              selectedPlayer={selectedPlayer}
              onSelectPlayer={(p) => setSelectedPlayer(p)}
              onUpdatePlayerPosition={handleTacticalPositionChange}
              players={players}
              draggedPlayer={draggedPlayer}
              setDraggedPlayer={setDraggedPlayer}
              onOpenPlayerModal={onOpenPlayerModal}
            />
          </div>
        </div>
      )}

      {/* VISTA SOLO FICHAS (CARDS) */}
      {viewMode === 'cards' && (
        <div className="space-y-6">
          {visibleSections.map((sec) => {
            const list = grouped[sec.key];
            const isSectionDraggedOver = dragOverSection === sec.key;

            return (
              <section
                key={`sec-cards-${sec.key}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverSection(sec.key);
                }}
                onDragLeave={() => setDragOverSection(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDropOnSection(sec.key);
                }}
                className={`space-y-3 p-4 rounded-xl border transition-all ${
                  isSectionDraggedOver
                    ? 'border-dashed border-2 border-emerald-400 bg-emerald-500/10 shadow-lg'
                    : theme === 'dark'
                    ? 'border-neutral-800 bg-neutral-950/30'
                    : 'border-neutral-200 bg-neutral-50/50'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{sec.icon}</span>
                    <h2
                      className={`font-black text-base uppercase tracking-tight ${
                        theme === 'dark' ? 'text-white' : 'text-neutral-900'
                      }`}
                    >
                      {sec.nombre}
                    </h2>
                    <span className="text-xs font-mono text-neutral-400 opacity-70 italic">
                      ({sec.nombreEuskera})
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-xs font-mono font-bold uppercase rounded border ${sec.badgeClase}`}
                  >
                    {list.length} futbolistas
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {list.map((j) => (
                    <CompactPlayerCard
                      key={`card-full-${j.id || j.dorsal}`}
                      player={j}
                      isSelected={selectedPlayer ? String(selectedPlayer.id) === String(j.id) : false}
                      theme={theme}
                      onSelect={() => setSelectedPlayer(j)}
                      onOpenModal={() => onOpenPlayerModal(j)}
                      onEdit={() => onEditPlayer(j)}
                      onDelete={() => onDeletePlayer(j)}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', String(j.id));
                        setDraggedPlayer(j);
                        setSelectedPlayer(j);
                      }}
                      onDragEnd={() => {
                        setDraggedPlayer(null);
                        setDragOverSection(null);
                      }}
                      isQuickPosOpen={quickPosMenuPlayerId === j.id}
                      toggleQuickPos={() =>
                        setQuickPosMenuPlayerId(quickPosMenuPlayerId === j.id ? null : j.id)
                      }
                      onQuickAssignPos={(posInfo) => {
                        handleTacticalPositionChange(
                          j.id,
                          posInfo.code,
                          posInfo.x,
                          posInfo.y,
                          posInfo.label,
                          posInfo.labelEuskera
                        );
                        setQuickPosMenuPlayerId(null);
                      }}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* VISTA SOLO CAMPO TÁCTICO VERDE */}
      {viewMode === 'field' && (
        <div className="max-w-xl mx-auto space-y-4">
          <div className="text-center">
            <h2
              className={`text-lg font-black uppercase ${
                theme === 'dark' ? 'text-white' : 'text-neutral-900'
              }`}
            >
              Pizarra Verde y Posicionamiento de Jugadores
            </h2>
            <p className="text-xs font-mono text-neutral-400">
              Selecciona un jugador para ver su bola roja en la posición donde puede jugar
            </p>
          </div>

          <CampoTacticoVerde
            selectedPlayer={selectedPlayer}
            onSelectPlayer={(p) => setSelectedPlayer(p)}
            onUpdatePlayerPosition={handleTacticalPositionChange}
            players={players}
            draggedPlayer={draggedPlayer}
            setDraggedPlayer={setDraggedPlayer}
            onOpenPlayerModal={onOpenPlayerModal}
          />
        </div>
      )}

      {/* VISTA TABLA COMPARATIVA */}
      {viewMode === 'table' && (
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
                  className={`py-2 px-4 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between border-b ${
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
                      <th className="py-2 px-3 w-14 text-center font-bold">Dorsal</th>
                      <th className="py-2 px-3 font-bold">Nombre / Demarcación</th>
                      <th className="py-2 px-3">Nacimiento</th>
                      <th className="py-2 px-3 text-center">Minutos</th>
                      <th className="py-2 px-3 text-center">Partidos</th>
                      <th className="py-2 px-3 text-center">Titular</th>
                      <th className="py-2 px-3 text-right font-bold w-36">Acciones</th>
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
                          onClick={() => setSelectedPlayer(j)}
                          className={`transition-colors cursor-pointer ${
                            selectedPlayer && String(selectedPlayer.id) === String(j.id)
                              ? 'bg-red-500/10'
                              : theme === 'dark'
                              ? 'hover:bg-neutral-900/60'
                              : 'hover:bg-neutral-50'
                          }`}
                        >
                          <td
                            className={`py-2 px-3 text-center font-black text-sm ${
                              theme === 'dark' ? 'text-white' : 'text-neutral-900'
                            }`}
                          >
                            #{j.dorsal}
                          </td>
                          <td className="py-2 px-3">
                            <div
                              className={`font-black text-xs uppercase ${
                                theme === 'dark' ? 'text-white' : 'text-neutral-900'
                              }`}
                            >
                              {j.nombre}
                            </div>
                            <div className="text-[10px] text-neutral-400 uppercase">
                              {j.posicion || 'Futbolista'}
                            </div>
                          </td>
                          <td className="py-2 px-3 text-neutral-400 text-xs">
                            {data.fechaNacimiento} ({data.edad}a)
                          </td>
                          <td className="py-2 px-3 text-center font-bold">{data.minutos}’</td>
                          <td className="py-2 px-3 text-center">{data.partidosJugados}</td>
                          <td className="py-2 px-3 text-center">{data.partidosTitular}</td>
                          <td className="py-2 px-3 text-right">
                            <div className="flex items-center justify-end">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenPlayerModal(j);
                                }}
                                className={`px-2.5 py-1 rounded border font-mono text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                                  theme === 'dark'
                                    ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white hover:border-emerald-500 hover:bg-neutral-800'
                                    : 'border-neutral-300 bg-neutral-100 text-neutral-800 hover:text-black hover:border-emerald-600 hover:bg-white'
                                }`}
                                title="Ver Ficha (Editar, Guardar y Borrar)"
                              >
                                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Ver Ficha</span>
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
    </div>
  );
};

/**
 * COMPONENTE DE FICHA COMPACTA DE JUGADOR (MÁS PEQUEÑA Y DESLIZABLE)
 */
interface CompactPlayerCardProps {
  player: Player;
  isSelected: boolean;
  theme: string;
  onSelect: () => void;
  onOpenModal: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  isQuickPosOpen: boolean;
  toggleQuickPos: () => void;
  onQuickAssignPos: (pos: any) => void;
}

const CompactPlayerCard: React.FC<CompactPlayerCardProps> = ({
  player,
  isSelected,
  theme,
  onSelect,
  onOpenModal,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  isQuickPosOpen,
  toggleQuickPos,
  onQuickAssignPos,
}) => {
  const data = getPlayerCardData(player);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onSelect}
      className={`relative p-2.5 rounded-lg border transition-all select-none cursor-grab active:cursor-grabbing group ${
        isSelected
          ? theme === 'dark'
            ? 'bg-neutral-900 border-red-500 ring-2 ring-red-500/50 shadow-md'
            : 'bg-white border-red-500 ring-2 ring-red-500/40 shadow-md'
          : theme === 'dark'
          ? 'bg-[#111111] border-neutral-800/80 hover:border-neutral-600 hover:bg-[#161616]'
          : 'bg-white border-neutral-200 hover:border-neutral-400 shadow-2xs'
      }`}
    >
      {/* 1. Fila Superior: Grip para deslizar + Dorsal + Nombre + Acciones */}
      <div className="flex items-center justify-between gap-1.5 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Asa de arrastre visual */}
          <div
            className="text-neutral-500 hover:text-white cursor-grab active:cursor-grabbing shrink-0"
            title="Desliza para mover a otra posición o al campo verde"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>

          {/* Dorsal */}
          <span
            className={`px-1.5 py-0.5 rounded font-black font-mono text-xs border shrink-0 ${
              isSelected
                ? 'bg-red-600 text-white border-red-500'
                : theme === 'dark'
                ? 'bg-neutral-900 text-white border-neutral-700'
                : 'bg-neutral-100 text-black border-neutral-300'
            }`}
          >
            #{player.dorsal}
          </span>

          {/* Nombre */}
          <h3
            className={`font-black text-xs sm:text-sm uppercase tracking-tight truncate leading-tight ${
              isSelected
                ? 'text-red-400 dark:text-red-300'
                : theme === 'dark'
                ? 'text-white'
                : 'text-neutral-900'
            }`}
            title={player.nombre}
          >
            {player.nombre}
          </h3>
        </div>

        {/* Botón Ojo: abre la ficha donde están Editar, Guardar y Borrar */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal();
          }}
          className={`px-2 py-1 rounded border font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
            theme === 'dark'
              ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white hover:border-emerald-500 hover:bg-neutral-800'
              : 'border-neutral-300 bg-neutral-100 text-neutral-700 hover:text-black hover:border-emerald-600 hover:bg-white'
          }`}
          title="Ver Ficha (Editar, Guardar y Borrar)"
        >
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] hidden sm:inline">Ficha</span>
        </button>
      </div>

      {/* 2. Fila Intermedia: Posición + Selector Rápido + Edad */}
      <div className="flex items-center justify-between gap-1 mb-2 text-[11px] font-mono">
        <div className="flex items-center gap-1 min-w-0">
          <span
            onClick={(e) => {
              e.stopPropagation();
              toggleQuickPos();
            }}
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase truncate border cursor-pointer hover:border-red-400 flex items-center gap-1 ${
              isSelected
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : theme === 'dark'
                ? 'bg-neutral-900 text-neutral-300 border-neutral-700'
                : 'bg-neutral-100 text-neutral-700 border-neutral-300'
            }`}
            title="Clic para cambiar demarcación táctica"
          >
            <span>{player.posicionTactico || 'JUG'}</span>
            <span className="text-[9px] opacity-70">▾</span>
          </span>

          <span
            className={`text-[10px] truncate ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            {player.posicion || 'Futbolista'}
          </span>
        </div>

        {/* Nacimiento y edad */}
        <span
          className={`text-[10px] shrink-0 ${
            theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
          }`}
        >
          {data.fechaNacimiento.split('/')[2] || data.fechaNacimiento} ({data.edad}a)
        </span>
      </div>

      {/* 3. Menú Desplegable de Cambio Rápido de Posición (al hacer clic en la pastilla de posición) */}
      {isQuickPosOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute left-2 right-2 top-12 p-2 rounded-lg border z-40 shadow-xl font-mono text-[10px] ${
            theme === 'dark' ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1 pb-1 border-b border-neutral-700">
            <span className="font-bold text-neutral-300 uppercase">Cambiar Posición:</span>
            <button
              type="button"
              onClick={toggleQuickPos}
              className="text-neutral-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {[
              { code: 'POR', label: 'POR', desc: 'Portero', x: 50, y: 89 },
              { code: 'LD', label: 'LD', desc: 'Lateral Der.', x: 82, y: 74 },
              { code: 'DFC1', label: 'DFC', desc: 'Central', x: 62, y: 78 },
              { code: 'LI', label: 'LI', desc: 'Lateral Izq.', x: 18, y: 74 },
              { code: 'MCD', label: 'MCD', desc: 'Pivote', x: 50, y: 60 },
              { code: 'MC', label: 'MC', desc: 'Interior', x: 65, y: 48 },
              { code: 'MCO', label: 'MCO', desc: 'Mediapunta', x: 50, y: 38 },
              { code: 'ED', label: 'ED', desc: 'Extremo Der.', x: 82, y: 24 },
              { code: 'DC', label: 'DC', desc: 'Delantero', x: 50, y: 18 },
              { code: 'EI', label: 'EI', desc: 'Extremo Izq.', x: 18, y: 24 },
            ].map((p) => (
              <button
                key={`btn-quick-${p.code}`}
                type="button"
                onClick={() =>
                  onQuickAssignPos({
                    code: p.code,
                    label: p.desc,
                    labelEuskera: '',
                    x: p.x,
                    y: p.y,
                  })
                }
                className="py-1 rounded bg-neutral-800 hover:bg-red-600 hover:text-white text-neutral-200 border border-neutral-700 text-center font-bold cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Fila Inferior: Estadísticas Compactas en una sola línea */}
      <div
        className={`flex items-center justify-between px-2 py-1 rounded text-[10px] font-mono border ${
          theme === 'dark' ? 'bg-black/50 border-neutral-800/80' : 'bg-neutral-50 border-neutral-200'
        }`}
      >
        <span className="flex items-center gap-1 font-bold">
          <Clock className="w-2.5 h-2.5 opacity-60" />
          {data.minutos}’
        </span>
        <span className="text-neutral-500">•</span>
        <span>{data.partidosJugados} PJ</span>
        <span className="text-neutral-500">•</span>
        <span>{data.partidosTitular} Tit.</span>
        <span className="text-neutral-500">•</span>
        <span className="opacity-75">{player.lateralidad === 'Zurdo' ? 'Z' : 'D'}</span>
      </div>

      {/* Indicador de Bola Roja si está seleccionado */}
      {isSelected && (
        <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center">
          <span className="w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white shadow-md animate-pulse" />
        </div>
      )}
    </div>
  );
};
