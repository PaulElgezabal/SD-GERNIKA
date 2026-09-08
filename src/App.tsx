import React, { useState, useEffect, useCallback } from 'react';
import { Player } from './types';
import { INITIAL_PLAYERS } from './data/initialPlayers';
import { Campograma } from './components/Campograma';
import { Plantilla } from './components/Plantilla';
import { FichaModal } from './components/FichaModal';
import { PlayerEditorModal } from './components/PlayerEditorModal';
import { supabase } from './lib/supabase';
import {
  Layout,
  Users,
  UserPlus,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
} from 'lucide-react';

const STORAGE_KEY_PLAYERS = 'sd_gernika_players_supabase_v1';

export default function App() {
  // Tab state: 'campo' | 'lista'
  const [activeTab, setActiveTab] = useState<'campo' | 'lista'>('campo');

  // Players state
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PLAYERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error parsing local storage:', e);
      }
    }
    return INITIAL_PLAYERS;
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

  // Notification Toast
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(
    null
  );

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync to local storage
  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(players));
    }
  }, [players]);

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
        setStatusMessage(`Supabase: ${error.message} (usando caché local)`);
      } else if (data && data.length > 0) {
        // Map database records to Player objects
        const formatted: Player[] = data.map((d: any) => ({
          id: d.id,
          nombre: d.nombre || 'Sin nombre',
          dorsal: Number(d.dorsal) || 0,
          nacimiento: Number(d.nacimiento) || 2000,
          lateralidad: d.lateralidad || 'Diestro',
          foto_url: d.foto_url || '',
          fotoUrl: d.foto_url || '',
          telefono: d.telefono || '',
          email: d.email || d.correo || '',
          correo: d.correo || d.email || '',
          tecnica: d.tecnica ?? 0,
          tactica: d.tactica ?? 0,
          condicional: d.condicional ?? 0,
          posicion_x: typeof d.posicion_x === 'number' ? d.posicion_x : 50,
          posicion_y: typeof d.posicion_y === 'number' ? d.posicion_y : 50,
          posicion: d.posicion || 'Jugador',
        }));

        setPlayers(formatted);
        setSupabaseStatus('connected');
        setStatusMessage('Supabase conectado • Base de datos sincronizada');
      } else {
        // Table exists but is empty
        setSupabaseStatus('connected');
        setStatusMessage('Supabase conectado • Tabla "jugadores" lista (vacía)');
      }
    } catch (err: any) {
      console.error('Error al conectar con Supabase:', err);
      setSupabaseStatus('offline');
      setStatusMessage('Modo sin conexión • Datos guardados localmente');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Run initial data fetch
  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Save (Insert / Update) Player
  const guardarJugador = async (playerData: Partial<Player>) => {
    const payloadWithContact: Record<string, any> = {
      nombre: playerData.nombre,
      dorsal: playerData.dorsal,
      nacimiento: playerData.nacimiento,
      lateralidad: playerData.lateralidad,
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
        // Try update with contact fields
        let { error } = await supabase
          .from('jugadores')
          .update(payloadWithContact)
          .eq('id', playerData.id);

        // If remote table lacks telefono/email columns, retry with basic payload
        if (error && error.message && (error.message.includes('column') || error.code === 'PGRST204')) {
          const { telefono, email, ...basicPayload } = payloadWithContact;
          const retry = await supabase.from('jugadores').update(basicPayload).eq('id', playerData.id);
          error = retry.error;
        }

        if (error) throw error;
        showToast(`Jugador ${playerData.nombre} actualizado en Supabase`, 'success');
      } else {
        // Try insert with contact fields
        let { error } = await supabase.from('jugadores').insert([payloadWithContact]);

        if (error && error.message && (error.message.includes('column') || error.code === 'PGRST204')) {
          const { telefono, email, ...basicPayload } = payloadWithContact;
          const retry = await supabase.from('jugadores').insert([basicPayload]);
          error = retry.error;
        }

        if (error) throw error;
        showToast(`Jugador ${playerData.nombre} guardado en Supabase`, 'success');
      }
    } catch (dbErr: any) {
      console.warn('Fallo Supabase, guardando localmente:', dbErr.message);
      showToast(`Guardado en almacenamiento local (${dbErr.message})`, 'info');
    }

    // Always update local state immediately for snappy response
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
        };
        return [...prev, newPlayer];
      }
    });

    // Refresh from Supabase in background
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

  // Seed default squad into Supabase if empty
  const sembrarEnSupabase = async () => {
    setIsSyncing(true);
    try {
      const payloadsWithContact = INITIAL_PLAYERS.map((j) => ({
        nombre: j.nombre,
        dorsal: j.dorsal,
        nacimiento: j.nacimiento,
        lateralidad: j.lateralidad,
        foto_url: j.foto_url || '',
        telefono: j.telefono || '',
        email: j.email || j.correo || '',
        tecnica: j.tecnica || 3,
        tactica: j.tactica || 3,
        condicional: j.condicional || 3,
        posicion_x: j.posicion_x || 50,
        posicion_y: j.posicion_y || 50,
      }));

      let { error } = await supabase.from('jugadores').insert(payloadsWithContact);

      // If remote table doesn't have telefono/email columns yet, fallback gracefully
      if (error && error.message && (error.message.includes('column') || error.code === 'PGRST204')) {
        const basicPayloads = payloadsWithContact.map(({ telefono, email, ...rest }) => rest);
        const retry = await supabase.from('jugadores').insert(basicPayloads);
        error = retry.error;
      }

      if (error) throw error;
      showToast('¡Plantilla del Gernika sembrada con éxito en Supabase!', 'success');
      cargarDatos();
    } catch (err: any) {
      console.error('Error al sembrar en Supabase:', err);
      showToast(`Error al subir a Supabase: ${err.message}`, 'error');
    } finally {
      setIsSyncing(false);
    }
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

  const showTab = (tab: 'campo' | 'lista') => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col font-sans pb-12">
      {/* Header */}
      <header className="p-5 text-center border-b border-[#222222] bg-[#0a0a0a]">
        <div className="flex items-center justify-center gap-3">
          <div className="w-9 h-9 border-2 border-white flex items-center justify-center font-black font-mono text-sm bg-black text-white">
            SDG
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white m-0">
            SD GERNIKA CLUB
          </h1>
        </div>
        <p className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-wider">
          Gestión Total • Urbieta Zelaia (1922)
        </p>

        {/* Database Status indicator bar */}
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-black border border-neutral-800 text-[11px] font-mono rounded-full">
          <span
            className={`w-2 h-2 rounded-full ${
              supabaseStatus === 'connected'
                ? 'bg-emerald-400 animate-pulse'
                : supabaseStatus === 'connecting'
                ? 'bg-amber-400 animate-spin'
                : 'bg-neutral-500'
            }`}
          />
          <span className="text-neutral-300">{statusMessage}</span>
          <button
            onClick={cargarDatos}
            disabled={isSyncing}
            className="ml-1 text-neutral-400 hover:text-white transition-colors"
            title="Sincronizar ahora"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Navigation Bar */}
      <div className="nav flex flex-wrap justify-center gap-2.5 my-5 px-4">
        {/* Campograma */}
        <button
          type="button"
          onClick={() => showTab('campo')}
          className={`cursor-pointer px-4 py-2.5 font-bold font-mono text-xs uppercase tracking-wider border transition-all ${
            activeTab === 'campo'
              ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
              : 'bg-transparent text-white border-neutral-700 hover:border-white'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5" />
            Campograma
          </span>
        </button>

        {/* Plantilla */}
        <button
          type="button"
          onClick={() => showTab('lista')}
          className={`cursor-pointer px-4 py-2.5 font-bold font-mono text-xs uppercase tracking-wider border transition-all ${
            activeTab === 'lista'
              ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
              : 'bg-transparent text-white border-neutral-700 hover:border-white'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Plantilla
          </span>
        </button>

        {/* + Añadir Jugador */}
        <button
          type="button"
          onClick={() => abrirEditor(null)}
          className="cursor-pointer px-4 py-2.5 font-bold font-mono text-xs uppercase tracking-wider border border-white bg-transparent text-white hover:bg-white hover:text-black transition-all flex items-center gap-1.5"
        >
          <UserPlus className="w-3.5 h-3.5" />
          + Añadir Jugador
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="max-w-md mx-auto px-4 mb-4 w-full">
          <div
            className={`p-3 border-2 font-mono text-xs flex items-center justify-between shadow-xl ${
              toast.type === 'error'
                ? 'bg-red-950/90 border-red-500 text-red-100'
                : 'bg-neutral-950 border-white text-white'
            }`}
          >
            <span>{toast.text}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-neutral-400 hover:text-white uppercase text-[10px]"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="container max-w-4xl mx-auto px-4 flex-1">
        {/* VISTA CAMPO */}
        <div id="tab-campo" className={activeTab === 'campo' ? 'block' : 'hidden'}>
          <Campograma
            players={players}
            onOpenPlayerModal={(p) => verFicha(p)}
            onEditPlayer={(p) => abrirEditor(p)}
            onAddPlayer={() => abrirEditor(null)}
          />
        </div>

        {/* VISTA LISTA */}
        <div id="tab-lista" className={activeTab === 'lista' ? 'block' : 'hidden'}>
          <Plantilla
            players={players}
            onOpenPlayerModal={(p) => verFicha(p)}
            onEditPlayer={(p) => abrirEditor(p)}
            onDeletePlayer={(id) => borrarJugador(id)}
            onAddNewPlayer={() => abrirEditor(null)}
          />
        </div>

        {/* Optional Supabase seed banner if table is empty or for easy test */}
        {players.length > 0 && supabaseStatus === 'connected' && (
          <div className="mt-8 p-3 bg-neutral-950 border border-neutral-800 text-neutral-400 font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-white shrink-0" />
              <span>
                Base de datos en tiempo real Supabase activa con {players.length} futbolistas.
              </span>
            </div>
            <button
              type="button"
              onClick={sembrarEnSupabase}
              disabled={isSyncing}
              className="px-3 py-1 text-[11px] font-bold uppercase border border-neutral-700 hover:border-white text-white transition-colors shrink-0"
            >
              Subir Plantilla Inicial a Supabase
            </button>
          </div>
        )}
      </main>

      {/* MODAL EDITOR (Añadir / Editar) */}
      <PlayerEditorModal
        player={editingPlayer}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={guardarJugador}
      />

      {/* MODAL FICHA (Ver Detalles) */}
      <FichaModal
        player={selectedPlayer}
        isOpen={isFichaOpen}
        onClose={() => setIsFichaOpen(false)}
        onEdit={(p) => {
          setIsFichaOpen(false);
          abrirEditor(p);
        }}
      />
    </div>
  );
}
