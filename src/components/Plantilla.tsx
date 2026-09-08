import React, { useState } from 'react';
import { Player } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Eye,
  Edit2,
  Trash2,
  Search,
  UserPlus,
  Phone,
  Mail,
  Shield,
  Users,
  Grid,
  List,
  Award,
} from 'lucide-react';

interface PlantillaProps {
  players: Player[];
  onOpenPlayerModal: (player: Player) => void;
  onEditPlayer: (player: Player) => void;
  onDeletePlayer: (id: string | number) => void;
  onAddNewPlayer: () => void;
}

export const Plantilla: React.FC<PlantillaProps> = ({
  players,
  onOpenPlayerModal,
  onEditPlayer,
  onDeletePlayer,
  onAddNewPlayer,
}) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'titulares' | 'suplentes'>('all');
  const [filterPos, setFilterPos] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const filtered = players
    .filter((j) => {
      // Role filter
      if (filterRole === 'titulares' && !j.esTitular) return false;
      if (filterRole === 'suplentes' && j.esTitular) return false;

      // Position filter
      if (filterPos !== 'all') {
        const pos = (j.posicion || '').toLowerCase();
        if (filterPos === 'portero' && !pos.includes('portero')) return false;
        if (
          filterPos === 'defensa' &&
          !pos.includes('defensa') &&
          !pos.includes('lateral') &&
          !pos.includes('central')
        )
          return false;
        if (
          filterPos === 'medio' &&
          !pos.includes('medio') &&
          !pos.includes('pivote') &&
          !pos.includes('interior')
        )
          return false;
        if (
          filterPos === 'delantero' &&
          !pos.includes('delantero') &&
          !pos.includes('extremo') &&
          !pos.includes('punta')
        )
          return false;
      }

      // Text search
      const q = searchTerm.toLowerCase();
      return (
        j.nombre.toLowerCase().includes(q) ||
        String(j.dorsal).includes(q) ||
        (j.posicion && j.posicion.toLowerCase().includes(q)) ||
        (j.telefono && j.telefono.toLowerCase().includes(q)) ||
        (j.email && j.email.toLowerCase().includes(q)) ||
        (j.correo && j.correo.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => a.dorsal - b.dorsal);

  const countTitulares = players.filter((p) => p.esTitular).length;
  const countSuplentes = players.length - countTitulares;

  return (
    <div id="tab-lista" className="w-full space-y-4">
      {/* Top Controls: Search, Filters, View toggle & Add */}
      <div
        className={`flex flex-col gap-3 p-4 border transition-colors ${
          theme === 'dark'
            ? 'bg-[#111111] border-neutral-800'
            : 'bg-white border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search
              className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            />
            <input
              type="text"
              placeholder="Buscar por dorsal, nombre, posición o teléfono..."
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
            {/* View Mode Toggle */}
            <div
              className={`flex items-center p-0.5 border rounded ${
                theme === 'dark' ? 'bg-black border-neutral-700' : 'bg-neutral-100 border-neutral-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'cards'
                    ? theme === 'dark'
                      ? 'bg-neutral-800 text-white'
                      : 'bg-white text-black shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Vista de Fichas"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'table'
                    ? theme === 'dark'
                      ? 'bg-neutral-800 text-white'
                      : 'bg-white text-black shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Vista de Tabla"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
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

        {/* Filter Pills & Categories */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800/40 font-mono text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span
              className={`text-[11px] uppercase tracking-wider font-bold mr-1 ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              Alineación:
            </span>

            <button
              type="button"
              onClick={() => setFilterRole('all')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                filterRole === 'all'
                  ? theme === 'dark'
                    ? 'bg-white text-black font-bold'
                    : 'bg-black text-white font-bold'
                  : theme === 'dark'
                  ? 'bg-neutral-900 text-neutral-400 hover:text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:text-black'
              }`}
            >
              Todos ({players.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterRole('titulares')}
              className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
                filterRole === 'titulares'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : theme === 'dark'
                  ? 'bg-neutral-900 text-neutral-400 hover:text-emerald-400'
                  : 'bg-neutral-100 text-neutral-600 hover:text-emerald-700'
              }`}
            >
              <Shield className="w-3 h-3" />
              11 Titular ({countTitulares})
            </button>

            <button
              type="button"
              onClick={() => setFilterRole('suplentes')}
              className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
                filterRole === 'suplentes'
                  ? theme === 'dark'
                    ? 'bg-neutral-700 text-white font-bold'
                    : 'bg-neutral-800 text-white font-bold'
                  : theme === 'dark'
                  ? 'bg-neutral-900 text-neutral-400 hover:text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:text-black'
              }`}
            >
              <Users className="w-3 h-3" />
              Banquillo ({countSuplentes})
            </button>
          </div>

          {/* Demarcation Filter */}
          <div className="flex items-center gap-1">
            <span
              className={`text-[11px] uppercase font-bold mr-1 ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              Línea:
            </span>
            {[
              { label: 'Todas', val: 'all' },
              { label: 'Porteros', val: 'portero' },
              { label: 'Defensas', val: 'defensa' },
              { label: 'Medios', val: 'medio' },
              { label: 'Delanteros', val: 'delantero' },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => setFilterPos(p.val)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  filterPos === p.val
                    ? theme === 'dark'
                      ? 'bg-neutral-700 text-white font-bold'
                      : 'bg-neutral-800 text-white font-bold'
                    : theme === 'dark'
                    ? 'text-neutral-400 hover:text-white'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW 1: Cards of Player Dossiers (Fichas) */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filtered.map((j) => {
            const photo =
              j.foto_url ||
              j.fotoUrl ||
              '';

            return (
              <div
                key={`card-${j.id || j.dorsal}`}
                className={`p-4 border rounded-lg transition-all flex flex-col justify-between group ${
                  theme === 'dark'
                    ? 'bg-[#111111] border-neutral-800 hover:border-neutral-600'
                    : 'bg-white border-neutral-300 hover:border-neutral-400 shadow-xs'
                }`}
              >
                <div>
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-black font-mono text-sm border-2 ${
                        j.esTitular
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : theme === 'dark'
                          ? 'bg-neutral-900 text-white border-neutral-700'
                          : 'bg-neutral-200 text-black border-neutral-400'
                      }`}
                    >
                      {j.dorsal}
                    </span>

                    {j.esTitular ? (
                      <span
                        className={`px-2 py-0.5 text-[9px] rounded font-bold uppercase tracking-wider ${
                          theme === 'dark'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        11 Titular
                      </span>
                    ) : (
                      <span
                        className={`px-2 py-0.5 text-[9px] rounded font-mono uppercase tracking-wider ${
                          theme === 'dark'
                            ? 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                            : 'bg-neutral-100 text-neutral-600 border border-neutral-300'
                        }`}
                      >
                        Banquillo
                      </span>
                    )}
                  </div>

                  {/* Player Info */}
                  <h3
                    className={`font-black text-base uppercase tracking-tight mb-0.5 ${
                      theme === 'dark' ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    {j.nombre}
                  </h3>

                  <div
                    className={`text-xs font-mono mb-3 ${
                      theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'
                    }`}
                  >
                    {j.posicion || 'Futbolista'}
                    {j.posicionEuskera && (
                      <span className="text-[11px] opacity-70 italic ml-1">
                        ({j.posicionEuskera})
                      </span>
                    )}
                  </div>

                  {/* Quick Technical KPIs */}
                  <div className="grid grid-cols-3 gap-1.5 mb-3 font-mono text-center text-xs">
                    <div
                      className={`p-1.5 rounded border ${
                        theme === 'dark' ? 'bg-black/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                      }`}
                    >
                      <span className="text-[9px] block text-neutral-500 uppercase">TÉC</span>
                      <span className="font-bold text-emerald-400">{j.tecnica ?? '-'}</span>
                    </div>
                    <div
                      className={`p-1.5 rounded border ${
                        theme === 'dark' ? 'bg-black/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                      }`}
                    >
                      <span className="text-[9px] block text-neutral-500 uppercase">TÁC</span>
                      <span className="font-bold text-emerald-400">{j.tactica ?? '-'}</span>
                    </div>
                    <div
                      className={`p-1.5 rounded border ${
                        theme === 'dark' ? 'bg-black/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                      }`}
                    >
                      <span className="text-[9px] block text-neutral-500 uppercase">FÍS</span>
                      <span className="font-bold text-emerald-400">{j.condicional ?? '-'}</span>
                    </div>
                  </div>

                  {/* Contact Preview */}
                  <div
                    className={`space-y-1 text-xs font-mono mb-4 ${
                      theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                    }`}
                  >
                    {j.telefono && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{j.telefono}</span>
                      </div>
                    )}
                    {(j.email || j.correo) && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{j.email || j.correo}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-2.5 border-t border-neutral-800/60">
                  <button
                    type="button"
                    onClick={() => onOpenPlayerModal(j)}
                    className={`px-2.5 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
                      theme === 'dark'
                        ? 'bg-neutral-900 border-neutral-700 text-white hover:border-white hover:bg-neutral-800'
                        : 'bg-neutral-100 border-neutral-300 text-black hover:border-black hover:bg-neutral-200 shadow-2xs'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    Ver Ficha
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditPlayer(j)}
                      className={`p-1.5 rounded border transition-colors ${
                        theme === 'dark'
                          ? 'border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600'
                          : 'border-neutral-300 text-neutral-600 hover:text-black hover:border-neutral-400'
                      }`}
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeletePlayer(j.id)}
                      className="p-1.5 rounded border border-red-900/40 text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW 2: Table Format */
        <div
          className={`border overflow-x-auto transition-colors ${
            theme === 'dark' ? 'border-neutral-800 bg-[#0a0a0a]' : 'border-neutral-300 bg-white shadow-xs'
          }`}
        >
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr
                className={`border-b uppercase tracking-wider transition-colors ${
                  theme === 'dark'
                    ? 'border-neutral-700 bg-neutral-900 text-neutral-300'
                    : 'border-neutral-300 bg-neutral-100 text-neutral-800'
                }`}
              >
                <th className="py-3 px-4 w-16 text-center font-bold">Dorsal</th>
                <th className="py-3 px-4 font-bold">Nombre / Posición</th>
                <th
                  className={`py-3 px-4 hidden md:table-cell ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                  }`}
                >
                  Contacto
                </th>
                <th
                  className={`py-3 px-4 hidden lg:table-cell ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                  }`}
                >
                  Año
                </th>
                <th
                  className={`py-3 px-4 hidden sm:table-cell ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                  }`}
                >
                  Lateral
                </th>
                <th
                  className={`py-3 px-4 hidden xl:table-cell ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                  }`}
                >
                  Val. (T-T-C)
                </th>
                <th className="py-3 px-4 text-right font-bold w-36">Acciones</th>
              </tr>
            </thead>
            <tbody
              id="tabla-cuerpo"
              className={`divide-y ${
                theme === 'dark' ? 'divide-neutral-800' : 'divide-neutral-200'
              }`}
            >
              {filtered.map((j) => (
                <tr
                  key={`row-${j.id || j.dorsal}`}
                  className={`transition-colors ${
                    theme === 'dark' ? 'hover:bg-neutral-900/60' : 'hover:bg-neutral-50'
                  }`}
                >
                  <td
                    className={`py-3 px-4 text-center font-black text-sm ${
                      theme === 'dark' ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    <b>{j.dorsal}</b>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold text-sm ${
                          theme === 'dark' ? 'text-white' : 'text-neutral-900'
                        }`}
                      >
                        {j.nombre}
                      </span>
                      {j.esTitular ? (
                        <span
                          className={`px-1.5 py-0.5 text-[9px] rounded font-bold uppercase tracking-wider ${
                            theme === 'dark'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          11 Titular
                        </span>
                      ) : (
                        <span
                          className={`px-1.5 py-0.5 text-[9px] rounded font-mono uppercase tracking-wider ${
                            theme === 'dark'
                              ? 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                              : 'bg-neutral-100 text-neutral-600 border border-neutral-300'
                          }`}
                        >
                          Banquillo
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[11px] flex flex-wrap gap-x-2 mt-0.5 ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                      }`}
                    >
                      <span>{j.posicion || 'Futbolista'}</span>
                      {j.telefono && (
                        <span className="md:hidden">· 📞 {j.telefono}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <div className="flex flex-col gap-0.5 text-[11px]">
                      {j.telefono && <span>📞 {j.telefono}</span>}
                      {(j.email || j.correo) && <span>✉️ {j.email || j.correo}</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">{j.nacimiento || '-'}</td>
                  <td className="py-3 px-4 hidden sm:table-cell">{j.lateralidad || '-'}</td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    {j.tecnica ?? '-'}-{j.tactica ?? '-'}-{j.condicional ?? '-'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenPlayerModal(j)}
                        className="p-1.5 border border-neutral-700 hover:border-white rounded text-neutral-300 hover:text-white"
                        title="Ver Ficha"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditPlayer(j)}
                        className="p-1.5 border border-neutral-700 hover:border-white rounded text-neutral-300 hover:text-white"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeletePlayer(j.id)}
                        className="p-1.5 border border-red-900/60 hover:border-red-500 rounded text-red-400"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer info */}
      <div
        className={`flex flex-wrap items-center justify-between text-xs font-mono px-1 ${
          theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
        }`}
      >
        <div>
          Mostrando {filtered.length} de {players.length} futbolistas • SD Gernika 2025-2026
        </div>
        <div>Segunda Federación • Urbieta Zelaia</div>
      </div>
    </div>
  );
};
