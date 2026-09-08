import React, { useState } from 'react';
import { Player } from '../types';
import { Eye, Edit2, Trash2, Search, Plus, UserPlus, Phone, Mail } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = players
    .filter((j) => {
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

  return (
    <div id="tab-lista" className="w-full max-w-4xl mx-auto space-y-4">
      {/* Top Search & Actions bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#111111] p-3 border border-neutral-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por dorsal, nombre, teléfono o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-neutral-700 pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-white"
          />
        </div>

        <button
          onClick={onAddNewPlayer}
          className="bg-white text-black hover:bg-neutral-200 px-4 py-2 text-xs font-bold uppercase tracking-wider font-mono border border-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          + Añadir Jugador
        </button>
      </div>

      {/* Tabla Oficial */}
      <div className="border border-neutral-800 overflow-x-auto bg-[#0a0a0a]">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-700 bg-neutral-900 text-neutral-300 uppercase tracking-wider">
              <th className="py-3 px-4 w-20 text-center font-bold">Dorsal</th>
              <th className="py-3 px-4 font-bold">Nombre</th>
              <th className="py-3 px-4 hidden md:table-cell text-neutral-400">Contacto</th>
              <th className="py-3 px-4 hidden lg:table-cell text-neutral-400">Año</th>
              <th className="py-3 px-4 hidden sm:table-cell text-neutral-400">Lateral</th>
              <th className="py-3 px-4 hidden xl:table-cell text-neutral-400">Val. (T-T-C)</th>
              <th className="py-3 px-4 text-right font-bold w-36">Acciones</th>
            </tr>
          </thead>
          <tbody id="tabla-cuerpo" className="divide-y divide-neutral-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-500">
                  No se encontraron jugadores registrados.
                </td>
              </tr>
            ) : (
              filtered.map((j) => {
                const tec = j.tecnica ?? '-';
                const tac = j.tactica ?? '-';
                const con = j.condicional ?? '-';

                return (
                  <tr
                    key={`row-${j.id || j.dorsal}`}
                    className="hover:bg-neutral-900/60 transition-colors"
                  >
                    <td className="py-3 px-4 text-center font-black text-sm text-white">
                      <b>{j.dorsal}</b>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{j.nombre}</div>
                      <div className="text-[11px] text-neutral-400 flex flex-wrap gap-x-2">
                        <span>{j.posicion || 'Jugador'}</span>
                        {/* On small screens, show quick phone / mail icon if available */}
                        {j.telefono && (
                          <span className="md:hidden text-neutral-300">· 📞 {j.telefono}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-neutral-300">
                      <div className="flex flex-col gap-0.5 text-[11px]">
                        {j.telefono && (
                          <a
                            href={`tel:${j.telefono}`}
                            className="hover:text-white flex items-center gap-1 text-neutral-300 hover:underline"
                          >
                            <Phone className="w-3 h-3 text-neutral-400 shrink-0" />
                            <span>{j.telefono}</span>
                          </a>
                        )}
                        {(j.email || j.correo) && (
                          <a
                            href={`mailto:${j.email || j.correo}`}
                            className="hover:text-white flex items-center gap-1 text-neutral-400 hover:underline truncate max-w-[150px]"
                            title={j.email || j.correo}
                          >
                            <Mail className="w-3 h-3 text-neutral-400 shrink-0" />
                            <span>{j.email || j.correo}</span>
                          </a>
                        )}
                        {!j.telefono && !j.email && !j.correo && (
                          <span className="text-neutral-600 italic">-</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-neutral-300">
                      {j.nacimiento || '-'}
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell text-neutral-300">
                      {j.lateralidad || '-'}
                    </td>
                    <td className="py-3 px-4 hidden xl:table-cell text-neutral-300">
                      <span className="bg-neutral-900 px-2 py-0.5 border border-neutral-800 text-[11px]">
                        {tec} / {tac} / {con}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="actions inline-flex items-center gap-1.5 justify-end">
                        {/* 👁️ Ver Ficha */}
                        <button
                          type="button"
                          onClick={() => onOpenPlayerModal(j)}
                          title="Ver Ficha Completa"
                          className="px-2.5 py-1.5 bg-transparent text-white border border-white hover:bg-white hover:text-black font-bold text-xs transition-colors"
                        >
                          👁️
                        </button>
                        {/* ✏️ Editar */}
                        <button
                          type="button"
                          onClick={() => onEditPlayer(j)}
                          title="Editar Jugador"
                          className="px-2.5 py-1.5 bg-transparent text-white border border-white hover:bg-white hover:text-black font-bold text-xs transition-colors"
                        >
                          ✏️
                        </button>
                        {/* 🗑️ Borrar */}
                        <button
                          type="button"
                          onClick={() => onDeletePlayer(j.id)}
                          title="Eliminar Jugador"
                          className="px-2.5 py-1.5 bg-[#cc0000] text-white border-none hover:bg-red-700 font-bold text-xs transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="text-right text-xs font-mono text-neutral-500 pr-1">
        Mostrando {filtered.length} de {players.length} futbolistas
      </div>
    </div>
  );
};
