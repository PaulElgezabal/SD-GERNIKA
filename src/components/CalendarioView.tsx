import React, { useState } from 'react';
import { EventoCalendario } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  Filter,
  Trophy,
  Dumbbell,
  Users,
  Coffee,
  HeartPulse,
} from 'lucide-react';

interface CalendarioViewProps {
  eventos: EventoCalendario[];
  onAddEvento: (nuevo: Omit<EventoCalendario, 'id'>) => void;
  onToggleCompletado: (id: string) => void;
}

export const CalendarioView: React.FC<CalendarioViewProps> = ({
  eventos,
  onAddEvento,
  onToggleCompletado,
}) => {
  const { theme } = useTheme();
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Event Form State
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<EventoCalendario['tipo']>('Entrenamiento');
  const [fecha, setFecha] = useState('2026-09-11');
  const [hora, setHora] = useState('10:30');
  const [lugar, setLugar] = useState('Campo 1 Urbieta Zelaia');
  const [diaMicrociclo, setDiaMicrociclo] = useState<EventoCalendario['diaMicrociclo']>('MD-2');
  const [descripcion, setDescripcion] = useState('');

  const filtered = eventos.filter((ev) => {
    if (filterType === 'all') return true;
    return ev.tipo === filterType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    onAddEvento({
      titulo: titulo.trim(),
      tipo,
      fecha,
      hora,
      lugar: lugar.trim(),
      diaMicrociclo,
      descripcion: descripcion.trim(),
      completado: false,
    });
    setTitulo('');
    setDescripcion('');
    setIsModalOpen(false);
  };

  const getTypeIcon = (tipo: EventoCalendario['tipo']) => {
    switch (tipo) {
      case 'Partido':
        return Trophy;
      case 'Gimnasio':
        return Dumbbell;
      case 'Charla Táctica':
        return Users;
      case 'Descanso':
        return Coffee;
      case 'Fisioterapia':
        return HeartPulse;
      default:
        return CalendarIcon;
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header & Filter Controls */}
      <div
        className={`p-5 border transition-colors ${
          theme === 'dark' ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight">
              Calendario de Actividad • SD Gernika
            </h1>
            <p className="text-xs font-mono text-neutral-400 mt-0.5 uppercase">
              Microciclos semanales, partidos oficiales 2ª RFEF y sesiones en Urbieta
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-white text-black border-white hover:bg-neutral-200'
                : 'bg-black text-white border-black hover:bg-neutral-800 shadow-xs'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Añadir Sesión / Evento</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-4 border-t border-neutral-800/60 font-mono text-xs">
          <span className="text-[10px] uppercase font-bold text-neutral-400 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filtrar:
          </span>
          {['all', 'Partido', 'Entrenamiento', 'Gimnasio', 'Charla Táctica', 'Fisioterapia'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 text-xs border uppercase tracking-wider transition-colors cursor-pointer ${
                filterType === type
                  ? theme === 'dark'
                    ? 'bg-white text-black border-white font-bold'
                    : 'bg-black text-white border-black font-bold'
                  : theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-600 hover:text-black'
              }`}
            >
              {type === 'all' ? 'Todos los Eventos' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Events Timeline / List */}
      <div className="space-y-3">
        {filtered.map((ev) => {
          const Icon = getTypeIcon(ev.tipo);
          return (
            <div
              key={ev.id}
              className={`p-4 border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                ev.completado
                  ? theme === 'dark'
                    ? 'bg-[#080808] border-neutral-900 opacity-60'
                    : 'bg-neutral-50 border-neutral-200 opacity-70'
                  : theme === 'dark'
                  ? 'bg-[#0d0d0d] border-neutral-800 hover:border-neutral-600'
                  : 'bg-white border-neutral-300 hover:border-neutral-500 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 border flex items-center justify-center shrink-0 mt-0.5 ${
                    ev.tipo === 'Partido'
                      ? theme === 'dark'
                        ? 'bg-white text-black border-white'
                        : 'bg-black text-white border-black'
                      : theme === 'dark'
                      ? 'bg-black text-white border-neutral-700'
                      : 'bg-neutral-100 text-black border-neutral-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border uppercase tracking-wider ${
                        theme === 'dark'
                          ? 'border-neutral-700 bg-neutral-900 text-neutral-300'
                          : 'border-neutral-300 bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      {ev.tipo}
                    </span>

                    {ev.diaMicrociclo && (
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border uppercase tracking-wider ${
                          ev.diaMicrociclo === 'MD'
                            ? theme === 'dark'
                              ? 'bg-white text-black border-white'
                              : 'bg-black text-white border-black'
                            : theme === 'dark'
                            ? 'bg-neutral-800 border-neutral-700 text-neutral-300'
                            : 'bg-neutral-200 border-neutral-300 text-neutral-800'
                        }`}
                      >
                        {ev.diaMicrociclo}
                      </span>
                    )}

                    <span className="text-xs font-mono text-neutral-400 font-semibold">
                      {ev.fecha} • {ev.hora}h
                    </span>
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-black uppercase tracking-tight ${
                      ev.completado ? 'line-through text-neutral-500' : ''
                    }`}
                  >
                    {ev.titulo}
                  </h3>

                  {ev.descripcion && (
                    <p className="text-xs font-mono text-neutral-400 mt-1">{ev.descripcion}</p>
                  )}

                  <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-500 mt-1.5">
                    <MapPin className="w-3 h-3" />
                    <span>{ev.lugar}</span>
                  </div>
                </div>
              </div>

              {/* Status Action */}
              <div className="shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => onToggleCompletado(ev.id)}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all cursor-pointer ${
                    ev.completado
                      ? theme === 'dark'
                        ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        : 'bg-neutral-100 border-neutral-300 text-neutral-600 hover:text-black'
                      : theme === 'dark'
                      ? 'bg-white text-black border-white hover:bg-neutral-200'
                      : 'bg-black text-white border-black hover:bg-neutral-800'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{ev.completado ? 'Completado ✓' : 'Marcar Hecho'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className={`w-full max-w-lg border p-6 font-mono text-xs ${
              theme === 'dark' ? 'bg-[#0e0e0e] border-neutral-700 text-white' : 'bg-white border-black text-black shadow-xl'
            }`}
          >
            <h2 className="text-base font-black uppercase tracking-tight mb-4 border-b pb-2">
              Nueva Sesión / Evento en Calendario
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] uppercase font-bold mb-1">Título del Evento</label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej: Sesión Táctica: Basculación en bloque bajo"
                  className={`w-full p-2 border focus:outline-none ${
                    theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase font-bold mb-1">Tipo de Actividad</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as any)}
                    className={`w-full p-2 border focus:outline-none ${
                      theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                    }`}
                  >
                    <option value="Entrenamiento">Entrenamiento</option>
                    <option value="Partido">Partido Oficial</option>
                    <option value="Gimnasio">Gimnasio / Fuerza</option>
                    <option value="Charla Táctica">Charla Táctica / Vídeo</option>
                    <option value="Fisioterapia">Fisioterapia / Recuperación</option>
                    <option value="Descanso">Descanso</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold mb-1">Día del Microciclo</label>
                  <select
                    value={diaMicrociclo}
                    onChange={(e) => setDiaMicrociclo(e.target.value as any)}
                    className={`w-full p-2 border focus:outline-none ${
                      theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                    }`}
                  >
                    <option value="MD-4">MD-4 (Fuerza / Sobrecarga)</option>
                    <option value="MD-3">MD-3 (Espacios Amplios)</option>
                    <option value="MD-2">MD-2 (Velocidad & ABP)</option>
                    <option value="MD-1">MD-1 (Activación Pre-partido)</option>
                    <option value="MD">MD (Día de Partido)</option>
                    <option value="MD+1">MD+1 (Compensatorio / Recuperación)</option>
                    <option value="Descanso">Día de Descanso</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label className="block text-[11px] uppercase font-bold mb-1">Hora</label>
                  <input
                    type="time"
                    required
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className={`w-full p-2 border focus:outline-none ${
                      theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold mb-1">Instalación / Lugar</label>
                <input
                  type="text"
                  required
                  value={lugar}
                  onChange={(e) => setLugar(e.target.value)}
                  placeholder="Ej: Campo 1 Urbieta Zelaia"
                  className={`w-full p-2 border focus:outline-none ${
                    theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold mb-1">Objetivos / Descripción</label>
                <textarea
                  rows={2}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Consignas tácticas o detalles de la sesión..."
                  className={`w-full p-2 border focus:outline-none ${
                    theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border uppercase cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 font-bold uppercase border cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-white text-black border-white'
                      : 'bg-black text-white border-black'
                  }`}
                >
                  Guardar en Calendario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
