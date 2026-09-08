import React, { useState } from 'react';
import { Player, InformeJugador } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  ClipboardCheck,
  Plus,
  Star,
  Activity,
  Brain,
  Smile,
  Flame,
  Award,
  Calendar,
  Search,
  Filter,
  Trash2,
  TrendingUp,
  User,
  HeartPulse,
} from 'lucide-react';

interface InformesViewProps {
  players: Player[];
  informes: InformeJugador[];
  onAddInforme: (informe: Omit<InformeJugador, 'id'>) => void;
  onDeleteInforme: (id: string) => void;
  onOpenPlayerModal?: (player: Player) => void;
}

export const InformesView: React.FC<InformesViewProps> = ({
  players,
  informes,
  onAddInforme,
  onDeleteInforme,
  onOpenPlayerModal,
}) => {
  const { theme } = useTheme();

  // Filter state
  const [selectedPlayerFilter, setSelectedPlayerFilter] = useState<string | 'all'>('all');
  const [tipoFilter, setTipoFilter] = useState<'all' | 'Entrenamiento' | 'Partido'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formJugadorId, setFormJugadorId] = useState<string | number>(players[0]?.id || 1);
  const [formFecha, setFormFecha] = useState(new Date().toISOString().split('T')[0]);
  const [formTipo, setFormTipo] = useState<'Entrenamiento' | 'Partido'>('Entrenamiento');
  const [formTecnica, setFormTecnica] = useState(4);
  const [formTactica, setFormTactica] = useState(4);
  const [formCondicional, setFormCondicional] = useState(4);
  const [formTomaDecision, setFormTomaDecision] = useState(4);
  const [formActitud, setFormActitud] = useState(5);
  const [formWellness, setFormWellness] = useState(4);
  const [formRPE, setFormRPE] = useState(7);
  const [formObservaciones, setFormObservaciones] = useState('');

  // Filtered reports
  const filteredInformes = informes.filter((inf) => {
    if (selectedPlayerFilter !== 'all' && String(inf.jugadorId) !== selectedPlayerFilter) {
      return false;
    }
    if (tipoFilter !== 'all' && inf.tipo !== tipoFilter) {
      return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        inf.jugadorNombre.toLowerCase().includes(q) ||
        String(inf.jugadorDorsal).includes(q) ||
        (inf.observaciones && inf.observaciones.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Calculate Averages for the squad
  const avgTecnica =
    informes.length > 0
      ? (informes.reduce((acc, i) => acc + i.tecnica, 0) / informes.length).toFixed(1)
      : '0.0';
  const avgTactica =
    informes.length > 0
      ? (informes.reduce((acc, i) => acc + i.tactica, 0) / informes.length).toFixed(1)
      : '0.0';
  const avgCondicional =
    informes.length > 0
      ? (informes.reduce((acc, i) => acc + i.condicional, 0) / informes.length).toFixed(1)
      : '0.0';
  const avgTomaDecision =
    informes.length > 0
      ? (informes.reduce((acc, i) => acc + i.tomaDecision, 0) / informes.length).toFixed(1)
      : '0.0';
  const avgActitud =
    informes.length > 0
      ? (informes.reduce((acc, i) => acc + i.actitud, 0) / informes.length).toFixed(1)
      : '0.0';
  const avgWellness =
    informes.length > 0
      ? (informes.reduce((acc, i) => acc + i.wellness, 0) / informes.length).toFixed(1)
      : '0.0';
  const avgRPE =
    informes.length > 0
      ? (informes.reduce((acc, i) => acc + i.rpe, 0) / informes.length).toFixed(1)
      : '0.0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const playerObj = players.find((p) => String(p.id) === String(formJugadorId));
    if (!playerObj) return;

    onAddInforme({
      jugadorId: playerObj.id,
      jugadorNombre: playerObj.nombre,
      jugadorDorsal: playerObj.dorsal,
      fecha: formFecha,
      tipo: formTipo,
      tecnica: formTecnica,
      tactica: formTactica,
      condicional: formCondicional,
      tomaDecision: formTomaDecision,
      actitud: formActitud,
      wellness: formWellness,
      rpe: formRPE,
      observaciones: formObservaciones.trim(),
    });

    setIsFormOpen(false);
    setFormObservaciones('');
  };

  // Helper rating pills (1-5)
  const RatingPicker = ({
    value,
    onChange,
    label,
    icon: Icon,
    max = 5,
  }: {
    value: number;
    onChange: (v: number) => void;
    label: string;
    icon: any;
    max?: number;
  }) => (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label
          className={`flex items-center gap-1.5 text-xs font-mono font-bold uppercase ${
            theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
          }`}
        >
          <Icon className="w-3.5 h-3.5 text-emerald-400" />
          <span>{label}</span>
        </label>
        <span
          className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
            theme === 'dark' ? 'bg-neutral-800 text-emerald-400' : 'bg-neutral-200 text-emerald-700'
          }`}
        >
          {value} / {max}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: max }, (_, idx) => idx + 1).map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={`flex-1 py-1.5 text-xs font-mono font-bold rounded border transition-all ${
              val <= value
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs'
                : theme === 'dark'
                ? 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700'
                : 'bg-neutral-100 border-neutral-300 text-neutral-400 hover:border-neutral-400'
            }`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-5">
      {/* Top Banner & Stats Overview */}
      <div
        className={`p-4 border transition-colors ${
          theme === 'dark' ? 'bg-[#111111] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-md flex items-center justify-center font-bold ${
                theme === 'dark' ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-black'
              }`}
            >
              <ClipboardCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2
                className={`font-black text-sm uppercase tracking-wider ${
                  theme === 'dark' ? 'text-white' : 'text-neutral-900'
                }`}
              >
                Informes de Rendimiento Técnico y Físico
              </h2>
              <p
                className={`text-xs font-mono ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                Evaluación individual: Técnica, Táctica, Condicional, Toma de Decisión, Actitud, Wellness y RPE.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-all shrink-0 ${
              theme === 'dark'
                ? 'bg-white text-black hover:bg-neutral-200 border-white'
                : 'bg-black text-white hover:bg-neutral-800 border-black shadow-xs'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            + Nuevo Informe
          </button>
        </div>

        {/* Global Team Averages KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-3 border-t border-neutral-800/40 text-center font-mono">
          <div
            className={`p-2 rounded border ${
              theme === 'dark' ? 'bg-black/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <div
              className={`text-[10px] uppercase font-semibold ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              Técnica (1-5)
            </div>
            <div className="text-lg font-black text-emerald-400">{avgTecnica}</div>
          </div>

          <div
            className={`p-2 rounded border ${
              theme === 'dark' ? 'bg-black/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <div
              className={`text-[10px] uppercase font-semibold ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              Táctica (1-5)
            </div>
            <div className="text-lg font-black text-emerald-400">{avgTactica}</div>
          </div>

          <div
            className={`p-2 rounded border ${
              theme === 'dark' ? 'bg-black/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <div
              className={`text-[10px] uppercase font-semibold ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              Condicional (1-5)
            </div>
            <div className="text-lg font-black text-emerald-400">{avgCondicional}</div>
          </div>

          <div
            className={`p-2 rounded border ${
              theme === 'dark' ? 'bg-black/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <div
              className={`text-[10px] uppercase font-semibold ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              Toma Decisión (1-5)
            </div>
            <div className="text-lg font-black text-emerald-400">{avgTomaDecision}</div>
          </div>

          <div
            className={`p-2 rounded border ${
              theme === 'dark' ? 'bg-black/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <div
              className={`text-[10px] uppercase font-semibold ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              Actitud (1-5)
            </div>
            <div className="text-lg font-black text-emerald-400">{avgActitud}</div>
          </div>

          <div
            className={`p-2 rounded border ${
              theme === 'dark' ? 'bg-black/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <div
              className={`text-[10px] uppercase font-semibold ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              Wellness (1-5)
            </div>
            <div className="text-lg font-black text-blue-400">{avgWellness}</div>
          </div>

          <div
            className={`p-2 rounded border ${
              theme === 'dark' ? 'bg-black/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <div
              className={`text-[10px] uppercase font-semibold ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              RPE Medio (1-10)
            </div>
            <div className="text-lg font-black text-amber-400">{avgRPE}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className={`p-3 border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs ${
          theme === 'dark' ? 'bg-[#111111] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search by text */}
          <div className="relative min-w-[200px] flex-1">
            <Search
              className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por jugador o nota..."
              className={`w-full pl-8 pr-3 py-1.5 text-xs border transition-colors focus:outline-none ${
                theme === 'dark'
                  ? 'bg-black border-neutral-700 text-white focus:border-white'
                  : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
              }`}
            />
          </div>

          {/* Filter by player */}
          <select
            value={selectedPlayerFilter}
            onChange={(e) => setSelectedPlayerFilter(e.target.value)}
            className={`px-3 py-1.5 text-xs border transition-colors focus:outline-none ${
              theme === 'dark'
                ? 'bg-black border-neutral-700 text-white focus:border-white'
                : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
            }`}
          >
            <option value="all">Todos los futbolistas ({players.length})</option>
            {players.map((p) => (
              <option key={`opt-filter-${p.id}`} value={String(p.id)}>
                #{p.dorsal} {p.nombre}
              </option>
            ))}
          </select>

          {/* Filter by Session Type */}
          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value as any)}
            className={`px-3 py-1.5 text-xs border transition-colors focus:outline-none ${
              theme === 'dark'
                ? 'bg-black border-neutral-700 text-white focus:border-white'
                : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
            }`}
          >
            <option value="all">Cualquier sesión</option>
            <option value="Entrenamiento">Solo Entrenamientos</option>
            <option value="Partido">Solo Partidos</option>
          </select>
        </div>

        <div
          className={`text-[11px] shrink-0 ${
            theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
          }`}
        >
          Mostrando {filteredInformes.length} informes
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredInformes.length === 0 ? (
          <div
            className={`p-12 text-center border font-mono text-xs ${
              theme === 'dark'
                ? 'border-neutral-800 bg-[#0a0a0a] text-neutral-500'
                : 'border-neutral-300 bg-white text-neutral-400'
            }`}
          >
            No hay informes registrados con los criterios seleccionados.
          </div>
        ) : (
          filteredInformes.map((inf) => {
            const player = players.find((p) => String(p.id) === String(inf.jugadorId));

            return (
              <div
                key={inf.id}
                className={`p-4 border transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#111111] border-neutral-800 hover:border-neutral-700'
                    : 'bg-white border-neutral-300 hover:border-neutral-400 shadow-xs'
                }`}
              >
                {/* Header of Report Card */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-neutral-800/60">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs font-mono ${
                        theme === 'dark'
                          ? 'bg-neutral-800 text-white border border-neutral-700'
                          : 'bg-neutral-200 text-black border border-neutral-300'
                      }`}
                    >
                      {inf.jugadorDorsal}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-sm ${
                            theme === 'dark' ? 'text-white' : 'text-neutral-900'
                          }`}
                        >
                          {inf.jugadorNombre}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono rounded font-semibold uppercase ${
                            inf.tipo === 'Partido'
                              ? 'bg-purple-950/80 text-purple-300 border border-purple-800'
                              : 'bg-blue-950/80 text-blue-300 border border-blue-800'
                          }`}
                        >
                          {inf.tipo}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-mono ${
                          theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                        }`}
                      >
                        Fecha: {inf.fecha}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {player && onOpenPlayerModal && (
                      <button
                        type="button"
                        onClick={() => onOpenPlayerModal(player)}
                        className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors ${
                          theme === 'dark'
                            ? 'text-neutral-300 border-neutral-700 hover:border-white'
                            : 'text-neutral-700 border-neutral-300 hover:border-black'
                        }`}
                      >
                        Ver Ficha
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDeleteInforme(inf.id)}
                      className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded"
                      title="Eliminar informe"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Score Indicators Grid (5 Key technical-tactical aspects + Wellness + RPE) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-3 text-xs font-mono">
                  <div
                    className={`p-2 rounded border ${
                      theme === 'dark' ? 'bg-black/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <span
                      className={`text-[10px] block ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                      }`}
                    >
                      Técnica
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-bold text-sm text-emerald-400">{inf.tecnica}</span>
                      <span className="text-[10px] text-neutral-500">/ 5</span>
                    </div>
                  </div>

                  <div
                    className={`p-2 rounded border ${
                      theme === 'dark' ? 'bg-black/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <span
                      className={`text-[10px] block ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                      }`}
                    >
                      Táctica
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-bold text-sm text-emerald-400">{inf.tactica}</span>
                      <span className="text-[10px] text-neutral-500">/ 5</span>
                    </div>
                  </div>

                  <div
                    className={`p-2 rounded border ${
                      theme === 'dark' ? 'bg-black/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <span
                      className={`text-[10px] block ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                      }`}
                    >
                      Condicional
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-bold text-sm text-emerald-400">{inf.condicional}</span>
                      <span className="text-[10px] text-neutral-500">/ 5</span>
                    </div>
                  </div>

                  <div
                    className={`p-2 rounded border ${
                      theme === 'dark' ? 'bg-black/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <span
                      className={`text-[10px] block ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                      }`}
                    >
                      Toma Decisión
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-bold text-sm text-emerald-400">{inf.tomaDecision}</span>
                      <span className="text-[10px] text-neutral-500">/ 5</span>
                    </div>
                  </div>

                  <div
                    className={`p-2 rounded border ${
                      theme === 'dark' ? 'bg-black/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <span
                      className={`text-[10px] block ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                      }`}
                    >
                      Actitud
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-bold text-sm text-emerald-400">{inf.actitud}</span>
                      <span className="text-[10px] text-neutral-500">/ 5</span>
                    </div>
                  </div>

                  <div
                    className={`p-2 rounded border ${
                      theme === 'dark' ? 'bg-black/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <span
                      className={`text-[10px] block ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                      }`}
                    >
                      Wellness
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-bold text-sm text-blue-400">{inf.wellness}</span>
                      <span className="text-[10px] text-neutral-500">/ 5</span>
                    </div>
                  </div>

                  <div
                    className={`p-2 rounded border ${
                      theme === 'dark' ? 'bg-black/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <span
                      className={`text-[10px] block ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                      }`}
                    >
                      RPE (Esfuerzo)
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-bold text-sm text-amber-400">{inf.rpe}</span>
                      <span className="text-[10px] text-neutral-500">/ 10</span>
                    </div>
                  </div>
                </div>

                {/* Observations */}
                {inf.observaciones && (
                  <p
                    className={`text-xs font-mono p-2.5 rounded border italic ${
                      theme === 'dark'
                        ? 'bg-neutral-900/60 border-neutral-800 text-neutral-300'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                    }`}
                  >
                    "{inf.observaciones}"
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal / Dialog to Add New Report */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFormOpen(false);
          }}
        >
          <div
            className={`border-2 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-2xl relative font-sans ${
              theme === 'dark'
                ? 'bg-[#111111] border-white text-white'
                : 'bg-white border-black text-neutral-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <h3 className="font-black text-base uppercase tracking-tight">
                Nuevo Informe de Rendimiento
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Player */}
              <div>
                <label
                  className={`block text-xs font-mono font-bold uppercase mb-1 ${
                    theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                  }`}
                >
                  Futbolista a Evaluar
                </label>
                <select
                  value={formJugadorId}
                  onChange={(e) => setFormJugadorId(e.target.value)}
                  className={`w-full px-3 py-2 text-sm font-mono border transition-colors focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-black border-neutral-700 text-white focus:border-white'
                      : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
                  }`}
                >
                  {players.map((p) => (
                    <option key={`form-p-${p.id}`} value={p.id}>
                      #{p.dorsal} {p.nombre} ({p.posicion || 'Futbolista'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className={`block text-xs font-mono font-bold uppercase mb-1 ${
                      theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                    }`}
                  >
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={formFecha}
                    onChange={(e) => setFormFecha(e.target.value)}
                    className={`w-full px-3 py-2 text-sm font-mono border transition-colors focus:outline-none ${
                      theme === 'dark'
                        ? 'bg-black border-neutral-700 text-white focus:border-white'
                        : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-mono font-bold uppercase mb-1 ${
                      theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                    }`}
                  >
                    Tipo de Sesión
                  </label>
                  <select
                    value={formTipo}
                    onChange={(e) => setFormTipo(e.target.value as any)}
                    className={`w-full px-3 py-2 text-sm font-mono border transition-colors focus:outline-none ${
                      theme === 'dark'
                        ? 'bg-black border-neutral-700 text-white focus:border-white'
                        : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
                    }`}
                  >
                    <option value="Entrenamiento">Entrenamiento</option>
                    <option value="Partido">Partido Oficial</option>
                  </select>
                </div>
              </div>

              {/* 5 Evaluative Pillars (1 to 5) */}
              <div className="p-3 border rounded space-y-3 bg-neutral-900/30 border-neutral-800">
                <RatingPicker
                  label="Técnica"
                  value={formTecnica}
                  onChange={setFormTecnica}
                  icon={Award}
                  max={5}
                />
                <RatingPicker
                  label="Táctica"
                  value={formTactica}
                  onChange={setFormTactica}
                  icon={Brain}
                  max={5}
                />
                <RatingPicker
                  label="Condicional (Físico)"
                  value={formCondicional}
                  onChange={setFormCondicional}
                  icon={Activity}
                  max={5}
                />
                <RatingPicker
                  label="Toma de Decisión"
                  value={formTomaDecision}
                  onChange={setFormTomaDecision}
                  icon={TrendingUp}
                  max={5}
                />
                <RatingPicker
                  label="Actitud / Compromiso"
                  value={formActitud}
                  onChange={setFormActitud}
                  icon={Flame}
                  max={5}
                />
              </div>

              {/* Wellness (1 to 5) and RPE (1 to 10) */}
              <div className="p-3 border rounded space-y-3 bg-neutral-900/30 border-neutral-800">
                <RatingPicker
                  label="Wellness (Bienestar / Recuperación)"
                  value={formWellness}
                  onChange={setFormWellness}
                  icon={Smile}
                  max={5}
                />

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      className={`flex items-center gap-1.5 text-xs font-mono font-bold uppercase ${
                        theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                      }`}
                    >
                      <HeartPulse className="w-3.5 h-3.5 text-amber-400" />
                      <span>RPE (Esfuerzo Percibido)</span>
                    </label>
                    <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      {formRPE} / 10
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setFormRPE(val)}
                        className={`flex-1 py-1.5 text-xs font-mono font-bold rounded border transition-all ${
                          val <= formRPE
                            ? 'bg-amber-600 border-amber-500 text-white'
                            : theme === 'dark'
                            ? 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700'
                            : 'bg-neutral-100 border-neutral-300 text-neutral-400'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                    <span>1: Muy suave</span>
                    <span>5: Moderado</span>
                    <span>10: Máximo esfuerzo</span>
                  </div>
                </div>
              </div>

              {/* Observations */}
              <div>
                <label
                  className={`block text-xs font-mono font-bold uppercase mb-1 ${
                    theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                  }`}
                >
                  Observaciones Técnicas / Crónica
                </label>
                <textarea
                  rows={3}
                  value={formObservaciones}
                  onChange={(e) => setFormObservaciones(e.target.value)}
                  placeholder="Aspectos a destacar, evolución en tareas, recomendaciones..."
                  className={`w-full p-2.5 text-xs font-mono border transition-colors focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-black border-neutral-700 text-white focus:border-white'
                      : 'bg-neutral-50 border-neutral-300 text-black focus:border-black'
                  }`}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className={`px-4 py-2 text-xs font-mono uppercase font-bold border transition-colors ${
                    theme === 'dark'
                      ? 'border-neutral-700 text-neutral-300 hover:border-white'
                      : 'border-neutral-300 text-neutral-700 hover:border-black'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-mono font-bold uppercase border transition-colors ${
                    theme === 'dark'
                      ? 'bg-white text-black hover:bg-neutral-200 border-white'
                      : 'bg-black text-white hover:bg-neutral-800 border-black'
                  }`}
                >
                  Guardar Informe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
