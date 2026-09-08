import React, { useState, useEffect, useCallback } from 'react';
import { Player, TabType, InformeJugador, Partido } from './types';
import { INITIAL_PLAYERS } from './data/initialPlayers';
import { INITIAL_REPORTS } from './data/initialReports';
import { INITIAL_MATCHES } from './data/initialMatches';
import { Plantilla } from './components/Plantilla';
import { CampoPizarra } from './components/CampoPizarra';
import { InformesView } from './components/InformesView';
import { PartidosView } from './components/PartidosView';
import { FichaModal } from './components/FichaModal';
import { PlayerEditorModal } from './components/PlayerEditorModal';
import { supabase } from './lib/supabase';
import { useTheme } from './context/ThemeContext';
import escudoGernika from './assets/escudo-gernika.png';
import {
  Users,
  Layout,
  ClipboardCheck,
  Trophy,
  RefreshCw,
  UploadCloud,
  Sun,
  Moon,
  Shield,
  UserPlus,
} from 'lucide-react';

const STORAGE_KEY_PLAYERS = 'sd_gernika_plantilla_25_26_v2';
const STORAGE_KEY_REPORTS = 'sd_gernika_informes_25_26_v1';
const STORAGE_KEY_MATCHES = 'sd_gernika_partidos_25_26_v1';

// Dorsales del último once titular 25-26
const ONCE_TITULAR_DORSALES = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

export default function App() {
  const { theme, toggleTheme } = useTheme();

  // Tab state: 'plantilla' | 'campo' | 'informes' | 'partidos'
  const [activeTab, setActiveTab] = useState<TabType>('plantilla');

  // Players state - 2025-26 squad with Starting 11
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PLAYERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const isSeason2526 =
          Array.isArray(parsed) &&
          parsed.some(
            (p: Player) =>
              p.nombre?.toLowerCase().includes('manex') ||
              p.nombre?.toLowerCase().includes('san nicolás') ||
              p.nombre?.toLowerCase().includes('izan')
          );
        if (isSeason2526) return parsed;
      } catch (e) {
        console.error('Error parsing local players:', e);
      }
    }
    return INITIAL_PLAYERS;
  });

  // Reports state (Técnica, Táctica, Condicional, Toma Decisión, Actitud, Wellness, RPE)
  const [informes, setInformes] = useState<InformeJugador[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_REPORTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing local reports:', e);
      }
    }
    return INITIAL_REPORTS;
  });

  // Matches state
  const [partidos, setPartidos] = useState<Partido[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MATCHES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing local matches:', e);
      }
    }
    return INITIAL_MATCHES;
  });

  // Supabase status
  const [supabaseStatus, setSupabaseStatus] = useState<
    'connecting' | 'connected' | 'offline' | 'error'
  >('connecting');
  const [statusMessage, setStatusMessage] = useState<string>('Conectando con Supabase...');
  const [isSyncing, setIsSyncing] = useState(false);

  // Modal states
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isFichaOpen, setIsFichaOpen] = useState(false);

  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(
    null
  );

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Persist state to local storage
  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(players));
    }
  }, [players]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(informes));
  }, [informes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(partidos));
  }, [partidos]);

  // Seed default 2025-26 squad into Supabase
  const sembrarPlantilla2526 = async () => {
    setIsSyncing(true);
    setStatusMessage('Sincronizando plantilla 25-26 en Supabase...');
    try {
      await supabase.from('jugadores').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      const payloadsWithContact = INITIAL_PLAYERS.map((j) => ({
        nombre: j.nombre,
        dorsal: j.dorsal,
        nacimiento: j.nacimiento,
        lateralidad: j.lateralidad,
        posicion: j.posicion,
        foto_url: j.foto_url || '',
        telefono: j.telefono || '',
        email: j.email || j.correo || '',
        tecnica: j.tecnica || 4,
        tactica: j.tactica || 4,
        condicional: j.condicional || 4,
        posicion_x: j.posicion_x ?? 50,
        posicion_y: j.posicion_y ?? 50,
      }));

      let { error } = await supabase.from('jugadores').insert(payloadsWithContact);

      if (error && error.message && (error.message.includes('column') || error.code === 'PGRST204')) {
        const basicPayloads = payloadsWithContact.map(({ telefono, email, ...rest }) => rest);
        const retry = await supabase.from('jugadores').insert(basicPayloads);
        error = retry.error;
      }

      if (error) throw error;
      setPlayers(INITIAL_PLAYERS);
      showToast('¡Plantilla 25-26 sincronizada en Supabase con éxito!', 'success');
      setStatusMessage('Supabase conectado • Temporada 2025-26');
    } catch (err: any) {
      console.error('Error al sembrar en Supabase:', err);
      showToast(`Error al subir a Supabase: ${err.message}`, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Load data from Supabase
  const cargarDatos = useCallback(async () => {
    setIsSyncing(true);
    setStatusMessage('Cargando datos de Supabase...');
    try {
      const { data, error } = await supabase
        .from('jugadores')
        .select('*')
        .order('dorsal', { ascending: true });

      if (error) {
        console.warn('Supabase query error:', error.message);
        setSupabaseStatus('error');
        setStatusMessage(`Supabase: ${error.message} (usando caché local 25-26)`);
      } else if (data && data.length > 0) {
        const isSeason2526 = data.some(
          (d: any) =>
            d.nombre?.toLowerCase().includes('manex') ||
            d.nombre?.toLowerCase().includes('san nicolás') ||
            d.nombre?.toLowerCase().includes('auzmendi') ||
            d.nombre?.toLowerCase().includes('lorente')
        );

        if (!isSeason2526 || data.length < 12) {
          await sembrarPlantilla2526();
          return;
        }

        const formatted: Player[] = data.map((d: any) => {
          const numDorsal = Number(d.dorsal) || 0;
          const initialMatch = INITIAL_PLAYERS.find((ip) => ip.dorsal === numDorsal);

          return {
            id: d.id,
            nombre: d.nombre || initialMatch?.nombre || 'Sin nombre',
            dorsal: numDorsal,
            nacimiento: Number(d.nacimiento) || initialMatch?.nacimiento || 2000,
            lateralidad: d.lateralidad || initialMatch?.lateralidad || 'Diestro',
            foto_url: d.foto_url || '',
            fotoUrl: d.foto_url || '',
            telefono: d.telefono || initialMatch?.telefono || '',
            email: d.email || d.correo || initialMatch?.email || '',
            correo: d.correo || d.email || initialMatch?.correo || '',
            tecnica: d.tecnica ?? initialMatch?.tecnica ?? 4,
            tactica: d.tactica ?? initialMatch?.tactica ?? 4,
            condicional: d.condicional ?? initialMatch?.condicional ?? 4,
            posicion_x: typeof d.posicion_x === 'number' ? d.posicion_x : initialMatch?.posicion_x ?? 50,
            posicion_y: typeof d.posicion_y === 'number' ? d.posicion_y : initialMatch?.posicion_y ?? 50,
            posicion: d.posicion || initialMatch?.posicion || 'Futbolista',
            posicionEuskera: initialMatch?.posicionEuskera,
            posicionTactico: initialMatch?.posicionTactico,
            esTitular: initialMatch?.esTitular ?? ONCE_TITULAR_DORSALES.has(numDorsal),
            enCampo: typeof initialMatch?.enCampo === 'boolean' ? initialMatch.enCampo : ONCE_TITULAR_DORSALES.has(numDorsal),
          };
        });

        setPlayers(formatted);
        setSupabaseStatus('connected');
        setStatusMessage('Supabase conectado • Temporada 2025-26');
      } else {
        await sembrarPlantilla2526();
        setSupabaseStatus('connected');
      }
    } catch (err: any) {
      console.error('Error al conectar con Supabase:', err);
      setSupabaseStatus('offline');
      setStatusMessage('Modo sin conexión • Datos 25-26 guardados localmente');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Update Player Pitch Position
  const handleUpdatePlayerPosition = (id: string | number, posX: number, posY: number) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isOffPitch = posX < 0 || posY < 0;
          return {
            ...p,
            posicion_x: isOffPitch ? -1 : posX,
            posicion_y: isOffPitch ? -1 : posY,
            enCampo: !isOffPitch,
            esTitular: !isOffPitch,
          };
        }
        return p;
      })
    );

    // Sync to Supabase in background if connected
    if (posX >= 0 && posY >= 0) {
      Promise.resolve(
        supabase
          .from('jugadores')
          .update({ posicion_x: posX, posicion_y: posY })
          .eq('id', id)
      ).catch(() => {});
    }
  };

  // Save (Insert / Update) Player
  const guardarJugador = async (playerData: Partial<Player>) => {
    const payloadWithContact: Record<string, any> = {
      nombre: playerData.nombre,
      dorsal: playerData.dorsal,
      nacimiento: playerData.nacimiento,
      lateralidad: playerData.lateralidad,
      posicion: playerData.posicion,
      foto_url: playerData.foto_url || playerData.fotoUrl || '',
      telefono: playerData.telefono || '',
      email: playerData.email || playerData.correo || '',
      tecnica: playerData.tecnica ?? 0,
      tactica: playerData.tactica ?? 0,
      condicional: playerData.condicional ?? 0,
      posicion_x: playerData.posicion_x ?? 50,
      posicion_y: playerData.posicion_y ?? 50,
    };

    const isEdit = Boolean(playerData.id);

    try {
      if (isEdit) {
        let { error } = await supabase
          .from('jugadores')
          .update(payloadWithContact)
          .eq('id', playerData.id);

        if (error && (error.message?.includes('column') || error.code === 'PGRST204')) {
          const { telefono, email, ...basicPayload } = payloadWithContact;
          const retry = await supabase
            .from('jugadores')
            .update(basicPayload)
            .eq('id', playerData.id);
          error = retry.error;
        }

        if (error) throw error;
        showToast(`Jugador ${playerData.nombre} actualizado en Supabase`, 'success');
      } else {
        let { error } = await supabase.from('jugadores').insert([payloadWithContact]);

        if (error && (error.message?.includes('column') || error.code === 'PGRST204')) {
          const { telefono, email, ...basicPayload } = payloadWithContact;
          const retry = await supabase.from('jugadores').insert([basicPayload]);
          error = retry.error;
        }

        if (error) throw error;
        showToast(`Jugador ${playerData.nombre} añadido en Supabase`, 'success');
      }
    } catch (dbErr: any) {
      console.warn('Fallo Supabase, guardando localmente:', dbErr.message);
      showToast(`Guardado en almacenamiento local`, 'info');
    }

    setPlayers((prev) => {
      if (isEdit) {
        return prev.map((p) =>
          p.id === playerData.id ? ({ ...p, ...playerData } as Player) : p
        );
      } else {
        const newPlayer: Player = {
          id: playerData.id || Date.now(),
          nombre: playerData.nombre || 'Nuevo Jugador',
          dorsal: playerData.dorsal || 99,
          nacimiento: playerData.nacimiento || 2000,
          lateralidad: playerData.lateralidad || 'Diestro',
          posicion: playerData.posicion || 'Futbolista',
          foto_url: playerData.foto_url || '',
          fotoUrl: playerData.foto_url || '',
          telefono: playerData.telefono || '',
          email: playerData.email || playerData.correo || '',
          correo: playerData.correo || playerData.email || '',
          tecnica: playerData.tecnica ?? 0,
          tactica: playerData.tactica ?? 0,
          condicional: playerData.condicional ?? 0,
          posicion_x: playerData.posicion_x ?? 50,
          posicion_y: playerData.posicion_y ?? 50,
          esTitular: playerData.esTitular ?? false,
          enCampo: playerData.esTitular ?? false,
        };
        return [...prev, newPlayer];
      }
    });

    setTimeout(() => {
      cargarDatos();
    }, 500);
  };

  // Delete Player
  const borrarJugador = async (id: string | number) => {
    const playerToDelete = players.find((p) => p.id === id);
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar a ${playerToDelete?.nombre || 'este jugador'} (#${
        playerToDelete?.dorsal || ''
      })?`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase.from('jugadores').delete().eq('id', id);
      if (error) throw error;
      showToast('Jugador eliminado de Supabase', 'success');
    } catch (err: any) {
      console.warn('Fallo al borrar en Supabase:', err.message);
      showToast('Eliminado de lista local', 'info');
    }

    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  // Report Handlers
  const handleAddInforme = (nuevoInforme: Omit<InformeJugador, 'id'>) => {
    const reportWithId: InformeJugador = {
      ...nuevoInforme,
      id: `rep-${Date.now()}`,
    };
    setInformes((prev) => [reportWithId, ...prev]);
    showToast(`Informe registrado para ${nuevoInforme.jugadorNombre}`, 'success');
  };

  const handleDeleteInforme = (id: string) => {
    setInformes((prev) => prev.filter((inf) => inf.id !== id));
    showToast('Informe eliminado', 'info');
  };

  // Match Handlers
  const handleAddPartido = (nuevoPartido: Omit<Partido, 'id'>) => {
    const partidoWithId: Partido = {
      ...nuevoPartido,
      id: `partido-${Date.now()}`,
    };
    setPartidos((prev) => [...prev, partidoWithId]);
    showToast(`Partido contra ${nuevoPartido.rival} añadido`, 'success');
  };

  const handleUpdatePartido = (partidoActualizado: Partido) => {
    setPartidos((prev) =>
      prev.map((p) => (p.id === partidoActualizado.id ? partidoActualizado : p))
    );
    showToast(`Partido contra ${partidoActualizado.rival} actualizado`, 'success');
  };

  const handleDeletePartido = (id: string) => {
    const match = partidos.find((p) => p.id === id);
    const confirmed = window.confirm(`¿Eliminar partido contra ${match?.rival || 'rival'}?`);
    if (!confirmed) return;

    setPartidos((prev) => prev.filter((p) => p.id !== id));
    showToast('Partido eliminado', 'info');
  };

  // Open modals
  const verFicha = (player: Player) => {
    setSelectedPlayer(player);
    setIsFichaOpen(true);
  };

  const abrirEditor = (player: Player | null = null) => {
    setEditingPlayer(player);
    setIsEditorOpen(true);
  };

  return (
    <div
      className={`min-h-screen ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-900'
      } selection:bg-neutral-500 selection:text-white flex flex-col font-sans pb-12 transition-colors duration-200`}
    >
      {/* Header */}
      <header
        className={`px-4 sm:px-6 py-4 border-b transition-colors ${
          theme === 'dark'
            ? 'border-[#222222] bg-[#0a0a0a] text-white'
            : 'border-neutral-300 bg-white text-black shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Club Brand: Escudo a la izquierda del todo y a continuación SD GERNIKA */}
          <div className="flex items-center gap-3.5 sm:gap-4 w-full md:w-auto justify-start">
            <img
              src={escudoGernika}
              alt="Escudo SD Gernika"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0 drop-shadow-md"
              referrerPolicy="no-referrer"
            />
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h1
                  className={`text-2xl sm:text-3xl font-black uppercase tracking-tight m-0 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}
                >
                  SD GERNIKA
                </h1>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border uppercase tracking-wider ${
                    theme === 'dark'
                      ? 'border-neutral-700 bg-neutral-900 text-neutral-300'
                      : 'border-neutral-300 bg-neutral-100 text-neutral-700'
                  }`}
                >
                  Club
                </span>
              </div>
              <p
                className={`text-xs font-mono mt-0.5 uppercase tracking-wider transition-colors ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                Temporada 2025-2026 • Segunda Federación • Estadio Urbieta
              </p>
            </div>
          </div>

          {/* Right Controls: Database status, sync, and theme toggle */}
          <div className="flex flex-wrap items-center justify-end gap-2 w-full md:w-auto">
            {/* Database Status indicator bar */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 border text-[11px] font-mono rounded-full transition-colors ${
                theme === 'dark'
                  ? 'bg-black border-neutral-800 text-neutral-300'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  supabaseStatus === 'connected'
                    ? 'bg-emerald-400 animate-pulse'
                    : supabaseStatus === 'connecting'
                    ? 'bg-amber-400 animate-spin'
                    : 'bg-neutral-500'
                }`}
              />
              <span className="truncate max-w-[150px] sm:max-w-none">{statusMessage}</span>
              <button
                onClick={cargarDatos}
                disabled={isSyncing}
                className={`ml-1 transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'text-neutral-400 hover:text-white'
                    : 'text-neutral-500 hover:text-black'
                }`}
                title="Sincronizar ahora"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <button
              type="button"
              onClick={sembrarPlantilla2526}
              disabled={isSyncing}
              className={`cursor-pointer px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all rounded-sm ${
                theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-700 hover:border-emerald-500 text-neutral-300 hover:text-emerald-400'
                  : 'bg-neutral-100 border-neutral-300 hover:border-emerald-600 text-neutral-800 hover:text-emerald-700 shadow-xs'
              }`}
              title="Recargar plantilla oficial 25-26 en Supabase"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restaurar 25-26</span>
            </button>

            <button
              id="btn-tema"
              type="button"
              onClick={toggleTheme}
              className={`cursor-pointer px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider border flex items-center gap-2 transition-all rounded-sm ${
                theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-700 hover:border-white text-white hover:bg-neutral-800'
                  : 'bg-neutral-100 border-neutral-300 hover:border-black text-neutral-900 hover:bg-neutral-200 shadow-xs'
              }`}
              title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Modo Claro ⚪</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-neutral-800" />
                  <span>Modo Oscuro ⚫</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Tab Navigation Bar (Plantilla, Campo, Informes, Partidos) */}
      <nav aria-label="Secciones principales" className="flex flex-wrap justify-center gap-2 my-5 px-4">
        {/* 1. Plantilla */}
        <button
          type="button"
          onClick={() => setActiveTab('plantilla')}
          className={`cursor-pointer px-4 py-2.5 font-bold font-mono text-xs uppercase tracking-wider border transition-all ${
            activeTab === 'plantilla'
              ? theme === 'dark'
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                : 'bg-black text-white border-black shadow-md'
              : theme === 'dark'
              ? 'bg-transparent text-white border-neutral-700 hover:border-white'
              : 'bg-white text-neutral-800 border-neutral-300 hover:border-black'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Plantilla & Fichas ({players.length})
          </span>
        </button>

        {/* 2. Campo */}
        <button
          type="button"
          onClick={() => setActiveTab('campo')}
          className={`cursor-pointer px-4 py-2.5 font-bold font-mono text-xs uppercase tracking-wider border transition-all ${
            activeTab === 'campo'
              ? theme === 'dark'
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                : 'bg-black text-white border-black shadow-md'
              : theme === 'dark'
              ? 'bg-transparent text-white border-neutral-700 hover:border-white'
              : 'bg-white text-neutral-800 border-neutral-300 hover:border-black'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5" />
            Campo (Pizarra & Colocación)
          </span>
        </button>

        {/* 3. Informes */}
        <button
          type="button"
          onClick={() => setActiveTab('informes')}
          className={`cursor-pointer px-4 py-2.5 font-bold font-mono text-xs uppercase tracking-wider border transition-all ${
            activeTab === 'informes'
              ? theme === 'dark'
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                : 'bg-black text-white border-black shadow-md'
              : theme === 'dark'
              ? 'bg-transparent text-white border-neutral-700 hover:border-white'
              : 'bg-white text-neutral-800 border-neutral-300 hover:border-black'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <ClipboardCheck className="w-3.5 h-3.5" />
            Informes ({informes.length})
          </span>
        </button>

        {/* 4. Partidos */}
        <button
          type="button"
          onClick={() => setActiveTab('partidos')}
          className={`cursor-pointer px-4 py-2.5 font-bold font-mono text-xs uppercase tracking-wider border transition-all ${
            activeTab === 'partidos'
              ? theme === 'dark'
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                : 'bg-black text-white border-black shadow-md'
              : theme === 'dark'
              ? 'bg-transparent text-white border-neutral-700 hover:border-white'
              : 'bg-white text-neutral-800 border-neutral-300 hover:border-black'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            Partidos ({partidos.length})
          </span>
        </button>
      </nav>

      {/* Toast Notification */}
      {toast && (
        <div className="max-w-md mx-auto px-4 mb-4 w-full">
          <div
            className={`p-3 border-2 font-mono text-xs flex items-center justify-between shadow-xl ${
              toast.type === 'error'
                ? 'bg-red-950/90 border-red-500 text-red-100'
                : theme === 'dark'
                ? 'bg-neutral-950 border-white text-white'
                : 'bg-white border-black text-black'
            }`}
          >
            <span>{toast.text}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-3 font-bold hover:underline cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Views Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6">
        {/* Pestaña 1: Plantilla con las fichas de jugadores */}
        {activeTab === 'plantilla' && (
          <Plantilla
            players={players}
            onOpenPlayerModal={verFicha}
            onEditPlayer={abrirEditor}
            onDeletePlayer={borrarJugador}
            onAddNewPlayer={() => abrirEditor(null)}
          />
        )}

        {/* Pestaña 2: Campo de fútbol con listado para situar jugadores */}
        {activeTab === 'campo' && (
          <CampoPizarra
            players={players}
            onUpdatePlayerPosition={handleUpdatePlayerPosition}
            onOpenPlayerModal={verFicha}
          />
        )}

        {/* Pestaña 3: Informes (Técnica, Táctica, Condicional, Toma Decisión, Actitud 1-5, Wellness, RPE) */}
        {activeTab === 'informes' && (
          <InformesView
            players={players}
            informes={informes}
            onAddInforme={handleAddInforme}
            onDeleteInforme={handleDeleteInforme}
            onOpenPlayerModal={verFicha}
          />
        )}

        {/* Pestaña 4: Partidos */}
        {activeTab === 'partidos' && (
          <PartidosView
            partidos={partidos}
            players={players}
            onAddPartido={handleAddPartido}
            onUpdatePartido={handleUpdatePartido}
            onDeletePartido={handleDeletePartido}
            onOpenPlayerModal={verFicha}
          />
        )}
      </main>

      {/* Modals */}
      {isFichaOpen && selectedPlayer && (
        <FichaModal
          player={selectedPlayer}
          onClose={() => setIsFichaOpen(false)}
          onEdit={() => {
            setIsFichaOpen(false);
            abrirEditor(selectedPlayer);
          }}
        />
      )}

      {isEditorOpen && (
        <PlayerEditorModal
          player={editingPlayer}
          onClose={() => setIsEditorOpen(false)}
          onSave={(data) => {
            guardarJugador(data);
            setIsEditorOpen(false);
          }}
        />
      )}
    </div>
  );
}
