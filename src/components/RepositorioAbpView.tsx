import React, { useState } from 'react';
import { JugadaABP } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  BookOpen,
  Plus,
  Shield,
  Target,
  ArrowUpRight,
  Filter,
  CheckCircle,
} from 'lucide-react';

interface RepositorioAbpViewProps {
  jugadas: JugadaABP[];
  onAddJugada: (nueva: Omit<JugadaABP, 'id'>) => void;
}

export const RepositorioAbpView: React.FC<RepositorioAbpViewProps> = ({
  jugadas,
  onAddJugada,
}) => {
  const { theme } = useTheme();
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedJugadaId, setSelectedJugadaId] = useState<string>(jugadas[0]?.id || '');
  const [showModal, setShowModal] = useState(false);

  // New ABP Form State
  const [tipo, setTipo] = useState<JugadaABP['tipo']>('Córner Ofensivo');
  const [nombre, setNombre] = useState('');
  const [codigoSecreto, setCodigoSecreto] = useState('');
  const [lanzador, setLanzador] = useState('');
  const [perfilPie, setPerfilPie] = useState<'Derecho' | 'Zurdo'>('Derecho');
  const [zonaEnvio, setZonaEnvio] = useState<JugadaABP['zonaEnvio']>('Primer palo');
  const [descripcion, setDescripcion] = useState('');
  const [asignacionesRaw, setAsignacionesRaw] = useState('');

  const filtered = jugadas.filter((j) => {
    if (filterType === 'all') return true;
    return j.tipo === filterType;
  });

  const selectedJugada = jugadas.find((j) => j.id === selectedJugadaId) || jugadas[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const asignaciones = asignacionesRaw
      .split('\n')
      .map((line) => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          return { rol: parts[0].trim(), jugador: parts[1].trim() };
        }
        return { rol: 'Asignación', jugador: line.trim() };
      })
      .filter((a) => a.jugador.length > 0);

    onAddJugada({
      tipo,
      nombre: nombre.trim(),
      codigoSecreto: codigoSecreto.trim().toUpperCase() || 'ABP',
      lanzador: lanzador.trim(),
      perfilPie,
      zonaEnvio,
      descripcion: descripcion.trim(),
      asignaciones: asignaciones.length > 0 ? asignaciones : [{ rol: 'Ejecutor', jugador: lanzador }],
    });

    setNombre('');
    setCodigoSecreto('');
    setLanzador('');
    setDescripcion('');
    setAsignacionesRaw('');
    setShowModal(false);
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
              Repositorio ABP • Acciones a Balón Parado
            </h1>
            <p className="text-xs font-mono text-neutral-400 mt-0.5 uppercase">
              Catálogo oficial de jugadas ensayadas, códigos secretos y asignación de roles
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-white text-black border-white hover:bg-neutral-200'
                : 'bg-black text-white border-black hover:bg-neutral-800 shadow-xs'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Nueva Jugada ABP</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-4 border-t border-neutral-800/60 font-mono text-xs">
          <span className="text-[10px] uppercase font-bold text-neutral-400 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Categoría:
          </span>
          {['all', 'Córner Ofensivo', 'Córner Defensivo', 'Falta Frontal', 'Falta Lateral Ofensiva'].map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterType(cat)}
                className={`px-3 py-1 text-xs border uppercase tracking-wider transition-colors cursor-pointer ${
                  filterType === cat
                    ? theme === 'dark'
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-black text-white border-black font-bold'
                    : theme === 'dark'
                    ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    : 'bg-neutral-100 border-neutral-300 text-neutral-600 hover:text-black'
                }`}
              >
                {cat === 'all' ? 'Todas las ABP' : cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main ABP Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: List of Routines */}
        <div className="space-y-2.5">
          {filtered.map((j) => {
            const isSelected = j.id === (selectedJugada?.id || '');
            return (
              <button
                key={j.id}
                type="button"
                onClick={() => setSelectedJugadaId(j.id)}
                className={`w-full p-4 border text-left transition-all cursor-pointer font-mono ${
                  isSelected
                    ? theme === 'dark'
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-black text-white border-black font-bold'
                    : theme === 'dark'
                    ? 'bg-[#0d0d0d] border-neutral-800 text-white hover:border-neutral-600'
                    : 'bg-white border-neutral-300 text-black hover:border-neutral-500 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider mb-1 opacity-80">
                  <span>{j.tipo}</span>
                  <span className="font-bold border px-1.5 py-0.2">CÓDIGO: {j.codigoSecreto}</span>
                </div>
                <h3 className="font-black text-sm uppercase">{j.nombre}</h3>
                <div className="text-[11px] mt-2 opacity-80 flex items-center justify-between">
                  <span>Lanzador: {j.lanzador}</span>
                  <span>Zona: {j.zonaEnvio}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right 2 Columns: Detailed Routine Sheet & Pitch Graphic */}
        {selectedJugada && (
          <div
            className={`lg:col-span-2 p-6 border flex flex-col justify-between ${
              theme === 'dark' ? 'bg-[#0c0c0c] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
            }`}
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3 mb-4 font-mono">
                <div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 border uppercase tracking-wider ${
                      theme === 'dark'
                        ? 'border-neutral-700 bg-neutral-900 text-neutral-300'
                        : 'border-neutral-300 bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    {selectedJugada.tipo}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight mt-1">
                    {selectedJugada.nombre}
                  </h2>
                </div>

                <div
                  className={`px-3 py-1.5 border text-center ${
                    theme === 'dark' ? 'bg-black border-neutral-700' : 'bg-neutral-100 border-neutral-300'
                  }`}
                >
                  <span className="text-[10px] text-neutral-400 uppercase block">Código en Partido</span>
                  <span className="font-mono font-black text-sm">{selectedJugada.codigoSecreto}</span>
                </div>
              </div>

              {/* Specs Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs mb-5">
                <div
                  className={`p-3 border ${
                    theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'
                  }`}
                >
                  <span className="text-[10px] uppercase text-neutral-400 block mb-1">Lanzador Principal</span>
                  <span className="font-bold">{selectedJugada.lanzador}</span>
                  <span className="text-[10px] text-neutral-500 block mt-0.5">Pie {selectedJugada.perfilPie}</span>
                </div>

                <div
                  className={`p-3 border ${
                    theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'
                  }`}
                >
                  <span className="text-[10px] uppercase text-neutral-400 block mb-1">Zona de Envío</span>
                  <span className="font-bold">{selectedJugada.zonaEnvio}</span>
                  <span className="text-[10px] text-neutral-500 block mt-0.5">Área de Remate</span>
                </div>

                <div
                  className={`p-3 border ${
                    theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'
                  }`}
                >
                  <span className="text-[10px] uppercase text-neutral-400 block mb-1">Foco Táctico</span>
                  <span className="font-bold">Eficacia Máxima</span>
                  <span className="text-[10px] text-neutral-500 block mt-0.5">Segunda Jugada Cubierta</span>
                </div>
              </div>

              {/* Pitch Area Representation (Schematic) */}
              <div
                className={`p-4 border font-mono text-xs mb-5 relative ${
                  theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-100 border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] uppercase text-neutral-400 font-bold mb-3">
                  <span>Esquema de Colocación en Área Rival</span>
                  <span>Urbieta Zelaia</span>
                </div>

                {/* Pitch outline box */}
                <div className="h-44 border-2 border-dashed border-neutral-700 relative flex items-center justify-center p-3">
                  {/* Goal Area Box */}
                  <div className="absolute top-0 w-36 h-14 border-b-2 border-x-2 border-neutral-600 flex items-center justify-center">
                    <span className="text-[9px] text-neutral-500 uppercase tracking-widest">
                      Portería / Área Pequeña
                    </span>
                  </div>

                  {/* Penalty Spot */}
                  <div className="absolute top-20 w-2 h-2 rounded-full bg-white border border-black" />

                  {/* Interactive Visual Tags */}
                  <div className="absolute top-10 left-8 px-2 py-1 border text-[10px] bg-black text-white">
                    Pantalla Primer Palo
                  </div>
                  <div className="absolute top-14 right-10 px-2 py-1 border text-[10px] bg-white text-black font-bold">
                    Entrada Remate Central
                  </div>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2 py-1 border text-[10px] bg-neutral-900 text-neutral-300">
                    Rechace Frontal (#8)
                  </div>
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 border text-[9px] bg-white text-black">
                    Córner (Lanzador)
                  </div>
                </div>
              </div>

              {/* Explanation & Player Assignments */}
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Descripción de la Rutina:
                  </span>
                  <p className="text-neutral-300 leading-relaxed">{selectedJugada.descripcion}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-2">
                    Asignaciones Individuales:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedJugada.asignaciones.map((asig, i) => (
                      <div
                        key={i}
                        className={`p-2.5 border flex items-center justify-between ${
                          theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'
                        }`}
                      >
                        <span className="text-neutral-400">{asig.rol}:</span>
                        <span className="font-bold">{asig.jugador}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New ABP Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className={`w-full max-w-lg border p-6 font-mono text-xs ${
              theme === 'dark' ? 'bg-[#0e0e0e] border-neutral-700 text-white' : 'bg-white border-black text-black shadow-xl'
            }`}
          >
            <h2 className="text-base font-black uppercase tracking-tight mb-4 border-b pb-2">
              Añadir Nueva Jugada ABP
            </h2>
            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase font-bold mb-1">Tipo de ABP</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as any)}
                    className={`w-full p-2 border focus:outline-none ${
                      theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                    }`}
                  >
                    <option value="Córner Ofensivo">Córner Ofensivo</option>
                    <option value="Córner Defensivo">Córner Defensivo</option>
                    <option value="Falta Frontal">Falta Frontal</option>
                    <option value="Falta Lateral Ofensiva">Falta Lateral Ofensiva</option>
                    <option value="Falta Lateral Defensiva">Falta Lateral Defensiva</option>
                    <option value="Penalti">Penalti</option>
                    <option value="Saque de Banda">Saque de Banda Táctico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold mb-1">Código Secreto</label>
                  <input
                    type="text"
                    required
                    value={codigoSecreto}
                    onChange={(e) => setCodigoSecreto(e.target.value)}
                    placeholder="Ej: KOBE, FLASH, MURALLA"
                    className={`w-full p-2 border focus:outline-none ${
                      theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold mb-1">Nombre de la Jugada</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Urbieta Delta (Centro Pasado)"
                  className={`w-full p-2 border focus:outline-none ${
                    theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] uppercase font-bold mb-1">Lanzador</label>
                  <input
                    type="text"
                    required
                    value={lanzador}
                    onChange={(e) => setLanzador(e.target.value)}
                    placeholder="Ej: Gorka Agirre"
                    className={`w-full p-2 border focus:outline-none ${
                      theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold mb-1">Perfil Pie</label>
                  <select
                    value={perfilPie}
                    onChange={(e) => setPerfilPie(e.target.value as any)}
                    className={`w-full p-2 border focus:outline-none ${
                      theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                    }`}
                  >
                    <option value="Derecho">Derecho</option>
                    <option value="Zurdo">Zurdo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold mb-1">Zona Envío</label>
                  <select
                    value={zonaEnvio}
                    onChange={(e) => setZonaEnvio(e.target.value as any)}
                    className={`w-full p-2 border focus:outline-none ${
                      theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                    }`}
                  >
                    <option value="Primer palo">Primer palo</option>
                    <option value="Segundo palo">Segundo palo</option>
                    <option value="Punto penalti">Punto penalti</option>
                    <option value="Corta / Dos toques">Corta / Dos toques</option>
                    <option value="Frontal / Rechace">Frontal / Rechace</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold mb-1">Descripción Táctica</label>
                <textarea
                  rows={2}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Movimientos de arrastre y bloqueos..."
                  className={`w-full p-2 border focus:outline-none ${
                    theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold mb-1">
                  Asignaciones (formato: "Rol: Jugador", una por línea)
                </label>
                <textarea
                  rows={2}
                  value={asignacionesRaw}
                  onChange={(e) => setAsignacionesRaw(e.target.value)}
                  placeholder="Pantalla: Mikel Arzalluz&#10;Remate: Koldo Berasaluze"
                  className={`w-full p-2 border focus:outline-none ${
                    theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border uppercase cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 font-bold uppercase border cursor-pointer ${
                    theme === 'dark' ? 'bg-white text-black border-white' : 'bg-black text-white border-black'
                  }`}
                >
                  Guardar ABP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
