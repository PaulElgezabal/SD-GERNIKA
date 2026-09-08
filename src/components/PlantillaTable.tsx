import React, { useState } from 'react';
import { Player } from '../types';
import { UserCheck, Search, FileText, ArrowUpDown, ChevronRight, User } from 'lucide-react';

interface PlantillaTableProps {
  players: Player[];
  onOpenPlayerModal: (player: Player) => void;
}

// The 10 official players explicitly required
const OFFICIAL_10_NAMES = [
  'Jon Altamira',
  'Asier Parra',
  'Koldo Berasaluze',
  'Jon Agirrezabala',
  'Xabier Arberas',
  'Josu Gallastegi',
  'Mikel Arzalluz',
  'Gorka Marcos',
  'Giovanni Navarro',
  'Kepa Vieites',
];

export const PlantillaTable: React.FC<PlantillaTableProps> = ({
  players,
  onOpenPlayerModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll11, setShowAll11] = useState(false);
  const [sortField, setSortField] = useState<'dorsal' | 'nombre' | 'nacimiento'>('dorsal');
  const [sortAsc, setSortAsc] = useState(true);

  // Filter players according to view toggle (10 official vs 11 squad)
  const baseList = showAll11
    ? players
    : players.filter((p) => OFFICIAL_10_NAMES.includes(p.nombre) || p.dorsal <= 11);

  // Search filter
  const filteredList = baseList.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(term) ||
      p.dorsal.toString().includes(term) ||
      p.lateralidad.toLowerCase().includes(term) ||
      p.posicion.toLowerCase().includes(term)
    );
  });

  // Sorting
  const sortedList = [...filteredList].sort((a, b) => {
    let diff = 0;
    if (sortField === 'dorsal') diff = a.dorsal - b.dorsal;
    else if (sortField === 'nombre') diff = a.nombre.localeCompare(b.nombre);
    else if (sortField === 'nacimiento') diff = a.nacimiento - b.nacimiento;
    return sortAsc ? diff : -diff;
  });

  const handleSort = (field: 'dorsal' | 'nombre' | 'nacimiento') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div id="sd-gernika-plantilla" className="space-y-4">
      {/* Table Section Header */}
      <div className="p-4 border border-neutral-800 bg-neutral-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm">🔳</span>
            <h2 className="text-base sm:text-lg font-black tracking-tight uppercase text-white">
              PLANTILLA OFICIAL (BASE DE DATOS) — S.D. GERNIKA CLUB
            </h2>
            <span className="text-sm">⬜</span>
          </div>
          <p className="text-xs font-mono text-neutral-400 mt-0.5">
            Base de datos de jugadores del club: Nombre, Dorsal, Año de Nacimiento y Lateralidad.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              id="input-buscar-plantilla"
              type="text"
              placeholder="Buscar jugador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black text-white text-xs font-mono border border-neutral-700 px-3 py-1.5 pl-8 focus:border-white focus:outline-none w-44 sm:w-56"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
          </div>

          <button
            type="button"
            onClick={() => setShowAll11(!showAll11)}
            className="text-xs font-mono border border-neutral-700 bg-black text-neutral-300 px-3 py-1.5 hover:border-white hover:text-white transition-colors"
          >
            {showAll11 ? 'Ver los 10 Oficiales' : 'Ver Plantilla Completa (11)'}
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="border border-neutral-800 bg-black overflow-x-auto shadow-2xl">
        <table className="w-full text-left border-collapse font-mono text-xs sm:text-sm">
          <thead>
            <tr className="border-b-2 border-white bg-neutral-950 text-neutral-300">
              <th
                onClick={() => handleSort('dorsal')}
                className="py-3.5 px-4 font-black uppercase text-white tracking-wider cursor-pointer hover:bg-neutral-900 select-none w-20 text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>DORSAL</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('nombre')}
                className="py-3.5 px-4 font-black uppercase text-white tracking-wider cursor-pointer hover:bg-neutral-900 select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>NOMBRE Y APELLIDOS</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('nacimiento')}
                className="py-3.5 px-4 font-black uppercase text-white tracking-wider cursor-pointer hover:bg-neutral-900 select-none text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>AÑO NACIMIENTO</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                </div>
              </th>

              <th className="py-3.5 px-4 font-black uppercase text-white tracking-wider text-center">
                LATERALIDAD
              </th>

              <th className="py-3.5 px-4 font-black uppercase text-white tracking-wider text-center hidden md:table-cell">
                POSICIÓN
              </th>

              <th className="py-3.5 px-4 font-black uppercase text-white tracking-wider text-center hidden lg:table-cell">
                RENDIMIENTO
              </th>

              <th className="py-3.5 px-4 font-black uppercase text-white tracking-wider text-right">
                FICHA
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-900">
            {sortedList.map((player) => {
              // Calculate average
              const notes = [player.tecnica, player.tactica, player.condicional].filter(
                (n): n is number => n !== null
              );
              const avg = notes.length > 0 ? (notes.reduce((a, b) => a + b, 0) / notes.length).toFixed(1) : null;

              return (
                <tr
                  key={player.id}
                  id={`fila-jugador-${player.dorsal}`}
                  onClick={() => onOpenPlayerModal(player)}
                  className="hover:bg-neutral-900/90 transition-colors cursor-pointer group"
                >
                  {/* Dorsal */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-neutral-700 bg-neutral-950 text-white font-black group-hover:border-white group-hover:bg-white group-hover:text-black transition-all">
                      {player.dorsal}
                    </span>
                  </td>

                  {/* Nombre con foto miniatura */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border border-neutral-700 overflow-hidden bg-neutral-950 flex items-center justify-center shrink-0">
                        {player.fotoUrl ? (
                          <img
                            src={player.fotoUrl}
                            alt={player.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-neutral-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm tracking-tight group-hover:text-white">
                          {player.nombre}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          {player.posicion} {player.posicionEuskera ? `(${player.posicionEuskera})` : ''}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Año de Nacimiento */}
                  <td className="py-3.5 px-4 text-center text-white font-semibold">
                    <span>{player.nacimiento}</span>
                    <span className="text-neutral-400 text-xs ml-1">
                      ({new Date().getFullYear() - player.nacimiento} años)
                    </span>
                  </td>

                  {/* Lateralidad */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 text-xs uppercase font-bold border ${
                        player.lateralidad === 'Zurdo'
                          ? 'border-neutral-500 bg-neutral-900 text-white'
                          : 'border-neutral-700 bg-neutral-950 text-neutral-300'
                      }`}
                    >
                      {player.lateralidad}
                    </span>
                  </td>

                  {/* Posición */}
                  <td className="py-3.5 px-4 text-center text-neutral-300 hidden md:table-cell">
                    {player.posicion}
                  </td>

                  {/* Rendimiento (T/T/C) */}
                  <td className="py-3.5 px-4 text-center hidden lg:table-cell font-mono text-xs">
                    {avg ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-neutral-700 bg-neutral-950 text-white font-bold">
                        <span>★ {avg}</span>
                        <span className="text-neutral-400 text-[10px]">
                          ({player.tecnica ?? '-'}/{player.tactica ?? '-'}/{player.condicional ?? '-'})
                        </span>
                      </span>
                    ) : (
                      <span className="text-neutral-500 text-xs">Sin evaluar</span>
                    )}
                  </td>

                  {/* Botón Acción Ficha */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      id={`btn-ver-ficha-${player.dorsal}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPlayerModal(player);
                      }}
                      className="px-3 py-1.5 bg-neutral-950 border border-neutral-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black hover:border-white transition-all inline-flex items-center gap-1 shadow-sm"
                    >
                      <span>Ver Ficha</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Summary */}
      <div className="p-3 border border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-400 gap-2">
        <div>
          Mostrando <strong>{sortedList.length}</strong> futbolistas del primer equipo de la SD Gernika
        </div>
        <div className="text-[11px] text-neutral-400">
          Haz clic en cualquier fila para editar las notas de rendimiento y foto
        </div>
      </div>
    </div>
  );
};
