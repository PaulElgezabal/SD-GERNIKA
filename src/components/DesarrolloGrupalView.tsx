import React, { useState } from 'react';
import { PrincipioGrupal, ReunionGrupal } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Target,
  Shield,
  Zap,
  RotateCcw,
  Plus,
  MessageSquare,
  CheckCircle,
  Award,
  Layers,
} from 'lucide-react';

interface DesarrolloGrupalViewProps {
  principios: PrincipioGrupal[];
  reuniones: ReunionGrupal[];
  onAddPrincipio: (nuevo: Omit<PrincipioGrupal, 'id'>) => void;
  onAddReunion: (nueva: Omit<ReunionGrupal, 'id'>) => void;
}

export const DesarrolloGrupalView: React.FC<DesarrolloGrupalViewProps> = ({
  principios,
  reuniones,
  onAddPrincipio,
  onAddReunion,
}) => {
  const { theme } = useTheme();
  const [activeFase, setActiveFase] = useState<string>('all');
  const [showAddPrincipio, setShowAddPrincipio] = useState(false);
  const [showAddReunion, setShowAddReunion] = useState(false);

  // New Principle State
  const [fase, setFase] = useState<PrincipioGrupal['fase']>('Ataque Organizado');
  const [principioTexto, setPrincipioTexto] = useState('');
  const [subprincipiosRaw, setSubprincipiosRaw] = useState('');
  const [consignasRaw, setConsignasRaw] = useState('');
  const [nivelDominio, setNivelDominio] = useState<number>(4);
  const [observacionesStaff, setObservacionesStaff] = useState('');

  // New Meeting State
  const [temaReunion, setTemaReunion] = useState('');
  const [fechaReunion, setFechaReunion] = useState('2026-09-09');
  const [conclusionesRaw, setConclusionesRaw] = useState('');
  const [acuerdosRaw, setAcuerdosRaw] = useState('');

  const filteredPrincipios = principios.filter((p) => {
    if (activeFase === 'all') return true;
    return p.fase === activeFase;
  });

  const handleSavePrincipio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!principioTexto.trim()) return;
    onAddPrincipio({
      fase,
      principio: principioTexto.trim(),
      subprincipios: subprincipiosRaw.split('\n').filter((s) => s.trim().length > 0),
      consignasClave: consignasRaw.split('\n').filter((s) => s.trim().length > 0),
      nivelDominio,
      observacionesStaff: observacionesStaff.trim(),
    });
    setPrincipioTexto('');
    setSubprincipiosRaw('');
    setConsignasRaw('');
    setObservacionesStaff('');
    setShowAddPrincipio(false);
  };

  const handleSaveReunion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!temaReunion.trim()) return;
    onAddReunion({
      fecha: fechaReunion,
      tema: temaReunion.trim(),
      conclusiones: conclusionesRaw.split('\n').filter((s) => s.trim().length > 0),
      acuerdosVestuario: acuerdosRaw.split('\n').filter((s) => s.trim().length > 0),
    });
    setTemaReunion('');
    setConclusionesRaw('');
    setAcuerdosRaw('');
    setShowAddReunion(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div
        className={`p-5 border transition-colors ${
          theme === 'dark' ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight">
              Desarrollo Grupal • Modelo de Juego
            </h1>
            <p className="text-xs font-mono text-neutral-400 mt-0.5 uppercase">
              Principios tácticos colectivos en 4 fases y bitácora del vestuario
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddPrincipio(true)}
              className={`px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-white text-black border-white hover:bg-neutral-200'
                  : 'bg-black text-white border-black hover:bg-neutral-800 shadow-xs'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Nuevo Principio</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddReunion(true)}
              className={`px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-700 text-white hover:border-white'
                  : 'bg-neutral-100 border-neutral-300 text-black hover:border-black'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>+ Acta Reunión</span>
            </button>
          </div>
        </div>

        {/* Phase Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-4 border-t border-neutral-800/60 font-mono text-xs">
          <span className="text-[10px] uppercase font-bold text-neutral-400 mr-2 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Fases del Juego:
          </span>
          {[
            { id: 'all', label: 'Todas las Fases' },
            { id: 'Ataque Organizado', label: '1. Ataque Organizado' },
            { id: 'Defensa Organizada', label: '2. Defensa Organizada' },
            { id: 'Transición Ofensiva', label: '3. Transición Ofensiva' },
            { id: 'Transición Defensiva', label: '4. Transición Defensiva' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFase(f.id)}
              className={`px-3 py-1 text-xs border uppercase tracking-wider transition-colors cursor-pointer ${
                activeFase === f.id
                  ? theme === 'dark'
                    ? 'bg-white text-black border-white font-bold'
                    : 'bg-black text-white border-black font-bold'
                  : theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-600 hover:text-black'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Principles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrincipios.map((p) => (
          <div
            key={p.id}
            className={`p-5 border transition-all flex flex-col justify-between ${
              theme === 'dark' ? 'bg-[#0d0d0d] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 border uppercase tracking-wider ${
                    theme === 'dark'
                      ? 'border-neutral-700 bg-black text-neutral-300'
                      : 'border-neutral-300 bg-neutral-100 text-neutral-800'
                  }`}
                >
                  {p.fase}
                </span>

                <div className="flex items-center gap-1 font-mono text-xs">
                  <span className="text-[10px] text-neutral-400">Dominio:</span>
                  <span className="font-bold">{p.nivelDominio} / 5</span>
                </div>
              </div>

              <h3 className="font-black text-base uppercase tracking-tight mb-3">{p.principio}</h3>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Subprincipios:
                  </span>
                  <ul className="space-y-1 text-neutral-300">
                    {p.subprincipios.map((sub, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-neutral-500">•</span>
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Consignas Clave en Campo:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {p.consignasClave.map((c, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] px-2 py-0.5 border ${
                          theme === 'dark'
                            ? 'bg-neutral-900 border-neutral-800 text-neutral-300'
                            : 'bg-neutral-100 border-neutral-300 text-neutral-800'
                        }`}
                      >
                        "{c}"
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {p.observacionesStaff && (
              <div className="mt-4 pt-3 border-t border-neutral-800/80 font-mono text-xs text-neutral-400">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-0.5">
                  Valoración Staff:
                </span>
                <p className="italic">"{p.observacionesStaff}"</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dressing Room Collective Meeting Minutes */}
      <div
        className={`p-5 border transition-colors ${
          theme === 'dark' ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2 mb-4 border-b border-neutral-800 pb-2">
          <MessageSquare className="w-4 h-4" />
          <h2 className="text-sm font-black uppercase tracking-tight">
            Bitácora de Reuniones Grupales & Acuerdos de Vestuario
          </h2>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {reuniones.map((r) => (
            <div
              key={r.id}
              className={`p-4 border ${
                theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-neutral-400 font-bold mb-1">
                <span>{r.fecha}</span>
                <span className="uppercase text-emerald-400">Reunión Oficial</span>
              </div>
              <h3 className="font-bold text-sm uppercase mb-2">{r.tema}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div>
                  <span className="text-[10px] uppercase text-neutral-400 font-bold block mb-1">
                    Conclusiones Técnicas:
                  </span>
                  <ul className="space-y-1 text-neutral-300">
                    {r.conclusiones.map((c, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-neutral-500">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-neutral-400 font-bold block mb-1">
                    Acuerdos del Vestuario:
                  </span>
                  <ul className="space-y-1 text-neutral-300">
                    {r.acuerdosVestuario.map((a, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <CheckCircle className="w-3 h-3 text-white shrink-0 mt-0.5" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Principle Modal */}
      {showAddPrincipio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className={`w-full max-w-lg border p-6 font-mono text-xs ${
              theme === 'dark' ? 'bg-[#0e0e0e] border-neutral-700 text-white' : 'bg-white border-black text-black shadow-xl'
            }`}
          >
            <h2 className="text-base font-black uppercase tracking-tight mb-4 border-b pb-2">
              Añadir Principio Táctico Colectivo
            </h2>
            <form onSubmit={handleSavePrincipio} className="space-y-3.5">
              <div>
                <label className="block text-[11px] uppercase font-bold mb-1">Fase del Juego</label>
                <select
                  value={fase}
                  onChange={(e) => setFase(e.target.value as any)}
                  className={`w-full p-2 border focus:outline-none ${
                    theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                >
                  <option value="Ataque Organizado">1. Ataque Organizado</option>
                  <option value="Defensa Organizada">2. Defensa Organizada</option>
                  <option value="Transición Ofensiva">3. Transición Ofensiva</option>
                  <option value="Transición Defensiva">4. Transición Defensiva</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold mb-1">Principio General</label>
                <input
                  type="text"
                  required
                  value={principioTexto}
                  onChange={(e) => setPrincipioTexto(e.target.value)}
                  placeholder="Ej: Salida de balón mediante fijación de centrales"
                  className={`w-full p-2 border focus:outline-none ${
                    theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold mb-1">Subprincipios (uno por línea)</label>
                <textarea
                  rows={2}
                  value={subprincipiosRaw}
                  onChange={(e) => setSubprincipiosRaw(e.target.value)}
                  placeholder="Amplitud máxima&#10;Desdoble de pivote"
                  className={`w-full p-2 border focus:outline-none ${
                    theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold mb-1">Consignas Clave (una por línea)</label>
                <textarea
                  rows={2}
                  value={consignasRaw}
                  onChange={(e) => setConsignasRaw(e.target.value)}
                  placeholder="Pase tenso al pie alejado"
                  className={`w-full p-2 border focus:outline-none ${
                    theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddPrincipio(false)}
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
                  Guardar Principio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Meeting Modal */}
      {showAddReunion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className={`w-full max-w-lg border p-6 font-mono text-xs ${
              theme === 'dark' ? 'bg-[#0e0e0e] border-neutral-700 text-white' : 'bg-white border-black text-black shadow-xl'
            }`}
          >
            <h2 className="text-base font-black uppercase tracking-tight mb-4 border-b pb-2">
              Registrar Reunión / Acuerdo de Vestuario
            </h2>
            <form onSubmit={handleSaveReunion} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase font-bold mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={fechaReunion}
                    onChange={(e) => setFechaReunion(e.target.value)}
                    className={`w-full p-2 border focus:outline-none ${
                      theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-bold mb-1">Tema Principal</label>
                  <input
                    type="text"
                    required
                    value={temaReunion}
                    onChange={(e) => setTemaReunion(e.target.value)}
                    placeholder="Ej: Análisis vídeo J3"
                    className={`w-full p-2 border focus:outline-none ${
                      theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold mb-1">Conclusiones (una por línea)</label>
                <textarea
                  rows={2}
                  value={conclusionesRaw}
                  onChange={(e) => setConclusionesRaw(e.target.value)}
                  placeholder="Gran compromiso defensivo&#10;Ajustar el segundo palo"
                  className={`w-full p-2 border focus:outline-none ${
                    theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold mb-1">Acuerdos del Vestuario (uno por línea)</label>
                <textarea
                  rows={2}
                  value={acuerdosRaw}
                  onChange={(e) => setAcuerdosRaw(e.target.value)}
                  placeholder="Vocalizar cambios de marca en ABP"
                  className={`w-full p-2 border focus:outline-none ${
                    theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddReunion(false)}
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
                  Guardar Acta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
