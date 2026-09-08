import React, { useState } from 'react';
import { Player, Partido } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Trophy,
  Calendar,
  MapPin,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Users,
  CheckCircle2,
  Shield,
  Search,
} from 'lucide-react';

interface PartidosViewProps {
  partidos: Partido[];
  players: Player[];
  onAddPartido: (partido: Omit<Partido, 'id'>) => void;
  onUpdatePartido: (partido: Partido) => void;
  onDeletePartido: (id: string) => void;
  onOpenPlayerModal?: (player: Player) => void;
}

export const PartidosView: React.FC<PartidosViewProps> = ({
  partidos,
  players,
  onAddPartido,
  onUpdatePartido,
  onDeletePartido,
  onOpenPlayerModal,
}) => {
  const { theme } = useTheme();

  // Filters
  const [filterEstado, setFilterEstado] = useState<'all' | 'Finalizado' | 'Próximo'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Edit / Create Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Partido | null>(null);

  // Form states
  const [jornada, setJornada] = useState<number>(1);
  const [fecha, setFecha] = useState<string>('');
  const [hora, setHora] = useState<string>('17:00');
  const [rival, setRival] = useState<string>('');
  const [esLocal, setEsLocal] = useState<boolean>(true);
  const [estadio, setEstadio] = useState<string>('Urbieta Zelaia (Gernika)');
  const [golesFavor, setGolesFavor] = useState<number | ''>('');
  const [golesContra, setGolesContra] = useState<number | ''>('');
  const [estado, setEstado] = useState<'Finalizado' | 'Próximo' | 'En Directo'>('Próximo');
  const [titularesIds, setTitularesIds] = useState<Array<string | number>>([]);
  const [suplentesIds, setSuplentesIds] = useState<Array<string | number>>([]);
  const [goleadoresStr, setGoleadoresStr] = useState<string>('');
  const [cronica, setCronica] = useState<string>('');

  const openCreateModal = () => {
    setEditingMatch(null);
    const nextJornada = partidos.length > 0 ? Math.max(...partidos.map((p) => p.jornada)) + 1 : 1;
    setJornada(nextJornada);
    setFecha(new Date().toISOString().split('T')[0]);
    setHora('17:00');
    setRival('');
    setEsLocal(true);
    setEstadio('Urbieta Zelaia (Gernika)');
    setGolesFavor('');
    setGolesContra('');
    setEstado('Próximo');
    // Pre-populate with current titulars
    const currentTitulares = players.filter((p) => p.esTitular).map((p) => p.id);
    setTitularesIds(currentTitulares);
    const currentSuplentes = players.filter((p) => !p.esTitular).map((p) => p.id);
    setSuplentesIds(currentSuplentes);
    setGoleadoresStr('');
    setCronica('');
    setIsModalOpen(true);
  };

  const openEditModal = (match: Partido) => {
    setEditingMatch(match);
    setJornada(match.jornada);
    setFecha(match.fecha);
    setHora(match.hora);
    setRival(match.rival);
    setEsLocal(match.esLocal);
    setEstadio(match.estadio);
    setGolesFavor(match.golesFavor !== undefined ? match.golesFavor : '');
    setGolesContra(match.golesContra !== undefined ? match.golesContra : '');
    setEstado(match.estado);
    setTitularesIds(match.titularesIds || []);
    setSuplentesIds(match.suplentesIds || []);
    setGoleadoresStr((match.goleadores || []).join(', '));
    setCronica(match.cronica || '');
    setIsModalOpen(true);
  };

  const handleToggleTitular = (playerId: string | number) => {
    if (titularesIds.includes(playerId)) {
      setTitularesIds(titularesIds.filter((id) => id !== playerId));
    } else {
      if (titularesIds.length >= 11) {
        alert('Ya hay 11 titulares seleccionados. Desmarca uno antes de añadir otro.');
        return;
      }
      setTitularesIds([...titularesIds, playerId]);
      // Remove from suplentes if in suplentes
      setSuplentesIds(suplentesIds.filter((id) => id !== playerId));
    }
  };

  const handleToggleSuplente = (playerId: string | number) => {
    if (suplentesIds.includes(playerId)) {
      setSuplentesIds(suplentesIds.filter((id) => id !== playerId));
    } else {
      setSuplentesIds([...suplentesIds, playerId]);
      // Remove from titulares if in titulares
      setTitularesIds(titularesIds.filter((id) => id !== playerId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rival.trim()) {
      alert('El nombre del rival es obligatorio');
      return;
    }

    const payload = {
      jornada: Number(jornada) || 1,
      fecha,
      hora,
      rival: rival.trim(),
      esLocal,
      estadio: estadio.trim(),
      golesFavor: golesFavor === '' ? undefined : Number(golesFavor),
      golesContra: golesContra === '' ? undefined : Number(golesContra),
      estado,
      titularesIds,
      suplentesIds,
      goleadores: goleadoresStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      cronica: cronica.trim(),
    };

    if (editingMatch) {
      onUpdatePartido({
        ...payload,
        id: editingMatch.id,
      });
    } else {
      onAddPartido(payload);
    }

    setIsModalOpen(false);
  };

  // Filtered list
  const filteredPartidos = partidos
    .filter((p) => {
      if (filterEstado !== 'all' && p.estado !== filterEstado) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          p.rival.toLowerCase().includes(q) ||
          String(p.jornada).includes(q) ||
          p.estadio.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => a.jornada - b.jornada);

  return (
    <div className="w-full space-y-5">
      {/* Top Banner */}
      <div
        className={`p-4 border transition-colors ${
          theme === 'dark' ? 'bg-[#111111] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-md flex items-center justify-center font-bold ${
                theme === 'dark' ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-black'
              }`}
            >
              <Trophy className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2
                className={`font-black text-sm uppercase tracking-wider ${
                  theme === 'dark' ? 'text-white' : 'text-neutral-900'
                }`}
              >
                Calendario Oficial • Temporada 2025-2026
              </h2>
              <p
                className={`text-xs font-mono ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                Segunda Federación • Grupo 2 • SD Gernika Club
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-all shrink-0 ${
              theme === 'dark'
                ? 'bg-white text-black hover:bg-neutral-200 border-white'
                : 'bg-black text-white hover:bg-neutral-800 border-black shadow-xs'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            + Nuevo Partido
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className={`p-3 border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs ${
          theme === 'dark' ? 'bg-[#111111] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search
              className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por rival o jornada..."
              className={`w-full pl-8 pr-3 py-1.5 text-xs border transition-colors focus:outline-none ${
                theme === 'dark'
                  ? 'bg-black border-neutral-700 text-white focus:border-white'
                  : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
              }`}
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFilterEstado('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterEstado === 'all'
                  ? theme === 'dark'
                    ? 'bg-white text-black font-bold'
                    : 'bg-black text-white font-bold'
                  : theme === 'dark'
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              Todos ({partidos.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterEstado('Finalizado')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterEstado === 'Finalizado'
                  ? 'bg-emerald-600 text-white font-bold'
                  : theme === 'dark'
                  ? 'text-neutral-400 hover:text-emerald-400'
                  : 'text-neutral-600 hover:text-emerald-700'
              }`}
            >
              Jugados ({partidos.filter((p) => p.estado === 'Finalizado').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterEstado('Próximo')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterEstado === 'Próximo'
                  ? theme === 'dark'
                    ? 'bg-neutral-700 text-white font-bold'
                    : 'bg-neutral-800 text-white font-bold'
                  : theme === 'dark'
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              Próximos ({partidos.filter((p) => p.estado === 'Próximo').length})
            </button>
          </div>
        </div>

        <span
          className={`text-[11px] ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}
        >
          {filteredPartidos.length} partidos listados
        </span>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPartidos.map((partido) => {
          const isFinished = partido.estado === 'Finalizado';
          const gf = partido.golesFavor ?? 0;
          const gc = partido.golesContra ?? 0;
          const isWin = isFinished && gf > gc;
          const isDraw = isFinished && gf === gc;
          const isLoss = isFinished && gf < gc;

          // Resolve lineup players
          const titulares = players.filter((p) => (partido.titularesIds || []).includes(p.id));
          const suplentes = players.filter((p) => (partido.suplentesIds || []).includes(p.id));

          return (
            <div
              key={partido.id}
              className={`p-4 border rounded-lg transition-colors flex flex-col justify-between ${
                theme === 'dark'
                  ? 'bg-[#111111] border-neutral-800 hover:border-neutral-700'
                  : 'bg-white border-neutral-300 hover:border-neutral-400 shadow-xs'
              }`}
            >
              <div>
                {/* Header: Jornada and Status */}
                <div className="flex items-center justify-between mb-3 font-mono text-xs pb-2 border-b border-neutral-800/60">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-black px-2 py-0.5 rounded text-[11px] uppercase ${
                        theme === 'dark'
                          ? 'bg-neutral-800 text-white border border-neutral-700'
                          : 'bg-neutral-100 text-black border border-neutral-300'
                      }`}
                    >
                      Jornada {partido.jornada}
                    </span>
                    <span
                      className={`text-[11px] ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                      }`}
                    >
                      {partido.esLocal ? '🏟️ Local' : '✈️ Visitante'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isFinished ? (
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                          isWin
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            : isDraw
                            ? 'bg-amber-950 text-amber-300 border border-amber-700'
                            : 'bg-red-950 text-red-300 border border-red-700'
                        }`}
                      >
                        {isWin ? 'Victoria' : isDraw ? 'Empate' : 'Derrota'}
                      </span>
                    ) : (
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                          theme === 'dark'
                            ? 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                            : 'bg-neutral-100 text-neutral-600 border border-neutral-300'
                        }`}
                      >
                        Próximo
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => openEditModal(partido)}
                      className="p-1 hover:text-white transition-colors"
                      title="Editar Partido"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeletePartido(partido.id)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      title="Eliminar Partido"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Scoreboard Banner */}
                <div
                  className={`p-3 rounded border mb-3 flex items-center justify-between ${
                    theme === 'dark'
                      ? 'bg-black/60 border-neutral-800'
                      : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="flex-1 text-left">
                    <div className="font-black text-sm uppercase truncate">
                      {partido.esLocal ? 'SD Gernika' : partido.rival}
                    </div>
                    <div
                      className={`text-[10px] font-mono ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                      }`}
                    >
                      {partido.esLocal ? 'Local' : 'Visitante'}
                    </div>
                  </div>

                  <div className="px-4 text-center shrink-0">
                    {isFinished ? (
                      <div className="font-mono text-2xl font-black tracking-wider text-emerald-400">
                        {partido.esLocal
                          ? `${partido.golesFavor} - ${partido.golesContra}`
                          : `${partido.golesContra} - ${partido.golesFavor}`}
                      </div>
                    ) : (
                      <div
                        className={`font-mono text-xs font-bold uppercase px-2.5 py-1 rounded border ${
                          theme === 'dark'
                            ? 'bg-neutral-900 border-neutral-700 text-neutral-300'
                            : 'bg-neutral-200 border-neutral-300 text-neutral-800'
                        }`}
                      >
                        {partido.hora}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-right">
                    <div className="font-black text-sm uppercase truncate">
                      {partido.esLocal ? partido.rival : 'SD Gernika'}
                    </div>
                    <div
                      className={`text-[10px] font-mono ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                      }`}
                    >
                      {partido.esLocal ? 'Visitante' : 'Local'}
                    </div>
                  </div>
                </div>

                {/* Match Details: Date, Stadium */}
                <div
                  className={`flex flex-wrap items-center gap-3 text-xs font-mono mb-3 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    {partido.fecha}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    {partido.hora}
                  </span>
                  <span className="flex items-center gap-1 truncate max-w-[200px]">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {partido.estadio}
                  </span>
                </div>

                {/* Scorers */}
                {partido.goleadores && partido.goleadores.length > 0 && (
                  <div
                    className={`mb-3 p-2 rounded border text-xs font-mono ${
                      theme === 'dark'
                        ? 'bg-neutral-900/50 border-neutral-800 text-neutral-300'
                        : 'bg-neutral-100 border-neutral-200 text-neutral-800'
                    }`}
                  >
                    <span className="font-bold text-[11px] text-emerald-400 mr-1">⚽ Goles SDG:</span>
                    <span>{partido.goleadores.join(' • ')}</span>
                  </div>
                )}

                {/* Lineup Highlights */}
                {titulares.length > 0 && (
                  <div className="mb-3">
                    <div
                      className={`text-[10px] font-mono uppercase font-bold mb-1 flex items-center justify-between ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Alineación ({titulares.length} titulares)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {titulares.map((t) => (
                        <span
                          key={`tit-${partido.id}-${t.id}`}
                          onClick={() => onOpenPlayerModal && onOpenPlayerModal(t)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono border cursor-pointer transition-colors ${
                            theme === 'dark'
                              ? 'bg-black border-neutral-800 text-neutral-300 hover:border-white'
                              : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:border-black'
                          }`}
                          title={`#${t.dorsal} ${t.nombre}`}
                        >
                          #{t.dorsal} {t.nombre.split(' ').pop()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chronicle Note */}
                {partido.cronica && (
                  <p
                    className={`text-xs font-mono italic p-2 rounded border ${
                      theme === 'dark'
                        ? 'bg-neutral-900/40 border-neutral-800/80 text-neutral-400'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600'
                    }`}
                  >
                    "{partido.cronica}"
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Match Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            className={`border-2 w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl relative font-sans ${
              theme === 'dark'
                ? 'bg-[#111111] border-white text-white'
                : 'bg-white border-black text-neutral-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <h3 className="font-black text-base uppercase tracking-tight">
                {editingMatch ? `Editar Partido (Jornada ${jornada})` : 'Registrar Nuevo Partido'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              {/* Jornada & Rival */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase mb-1">Jornada</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="38"
                    value={jornada}
                    onChange={(e) => setJornada(Number(e.target.value))}
                    className={`w-full px-3 py-2 border transition-colors focus:outline-none ${
                      theme === 'dark'
                        ? 'bg-black border-neutral-700 text-white focus:border-white'
                        : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
                    }`}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold uppercase mb-1">Equipo Rival</label>
                  <input
                    type="text"
                    required
                    value={rival}
                    onChange={(e) => setRival(e.target.value)}
                    placeholder="Ej: Barakaldo CF, Arenas Club..."
                    className={`w-full px-3 py-2 border transition-colors focus:outline-none ${
                      theme === 'dark'
                        ? 'bg-black border-neutral-700 text-white focus:border-white'
                        : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
                    }`}
                  />
                </div>
              </div>

              {/* Fecha, Hora, Local/Visitante */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className={`w-full px-3 py-2 border transition-colors focus:outline-none ${
                      theme === 'dark'
                        ? 'bg-black border-neutral-700 text-white focus:border-white'
                        : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">Hora</label>
                  <input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className={`w-full px-3 py-2 border transition-colors focus:outline-none ${
                      theme === 'dark'
                        ? 'bg-black border-neutral-700 text-white focus:border-white'
                        : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">Condición</label>
                  <select
                    value={esLocal ? 'local' : 'visitante'}
                    onChange={(e) => {
                      const isLoc = e.target.value === 'local';
                      setEsLocal(isLoc);
                      if (isLoc) setEstadio('Urbieta Zelaia (Gernika)');
                      else setEstadio('Campo Rival');
                    }}
                    className={`w-full px-3 py-2 border transition-colors focus:outline-none ${
                      theme === 'dark'
                        ? 'bg-black border-neutral-700 text-white focus:border-white'
                        : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
                    }`}
                  >
                    <option value="local">Local (Urbieta)</option>
                    <option value="visitante">Visitante</option>
                  </select>
                </div>
              </div>

              {/* Estadio */}
              <div>
                <label className="block font-bold uppercase mb-1">Estadio / Campo</label>
                <input
                  type="text"
                  value={estadio}
                  onChange={(e) => setEstadio(e.target.value)}
                  className={`w-full px-3 py-2 border transition-colors focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-black border-neutral-700 text-white focus:border-white'
                      : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
                  }`}
                />
              </div>

              {/* Estado & Marcador */}
              <div className="grid grid-cols-3 gap-3 p-3 border rounded bg-neutral-900/30 border-neutral-800">
                <div>
                  <label className="block font-bold uppercase mb-1">Estado</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value as any)}
                    className={`w-full px-3 py-2 border transition-colors focus:outline-none ${
                      theme === 'dark'
                        ? 'bg-black border-neutral-700 text-white focus:border-white'
                        : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
                    }`}
                  >
                    <option value="Próximo">Próximo</option>
                    <option value="Finalizado">Finalizado</option>
                    <option value="En Directo">En Directo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">Goles SD Gernika</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={golesFavor}
                    onChange={(e) => setGolesFavor(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ej: 2"
                    className={`w-full px-3 py-2 border transition-colors focus:outline-none ${
                      theme === 'dark'
                        ? 'bg-black border-neutral-700 text-white focus:border-white'
                        : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">Goles Rival</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={golesContra}
                    onChange={(e) => setGolesContra(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ej: 1"
                    className={`w-full px-3 py-2 border transition-colors focus:outline-none ${
                      theme === 'dark'
                        ? 'bg-black border-neutral-700 text-white focus:border-white'
                        : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
                    }`}
                  />
                </div>
              </div>

              {/* Lineup Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold uppercase">
                    Selección de 11 Titulares ({titularesIds.length}/11 seleccionados)
                  </label>
                </div>
                <div className="flex flex-wrap gap-1 p-2 border rounded max-h-32 overflow-y-auto bg-black/40 border-neutral-800">
                  {players.map((p) => {
                    const isTitular = titularesIds.includes(p.id);
                    return (
                      <button
                        key={`form-tit-${p.id}`}
                        type="button"
                        onClick={() => handleToggleTitular(p.id)}
                        className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                          isTitular
                            ? 'bg-emerald-600 border-emerald-500 text-white font-bold'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'
                        }`}
                      >
                        #{p.dorsal} {p.nombre.split(' ').pop()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Goleadores */}
              <div>
                <label className="block font-bold uppercase mb-1">
                  Goleadores de la SD Gernika (separados por coma)
                </label>
                <input
                  type="text"
                  value={goleadoresStr}
                  onChange={(e) => setGoleadoresStr(e.target.value)}
                  placeholder="Ej: Diego Asensio (23'), Ibon Badiola (75')"
                  className={`w-full px-3 py-2 border transition-colors focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-black border-neutral-700 text-white focus:border-white'
                      : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
                  }`}
                />
              </div>

              {/* Crónica */}
              <div>
                <label className="block font-bold uppercase mb-1">Crónica / Notas Tácticas</label>
                <textarea
                  rows={3}
                  value={cronica}
                  onChange={(e) => setCronica(e.target.value)}
                  placeholder="Resumen del planteamiento, ocasiones y rendimiento del bloque..."
                  className={`w-full p-2.5 border transition-colors focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-black border-neutral-700 text-white focus:border-white'
                      : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
                  }`}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-700 text-neutral-300 hover:border-white uppercase font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 uppercase font-bold border border-white bg-white text-black hover:bg-neutral-200"
                >
                  Guardar Partido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
