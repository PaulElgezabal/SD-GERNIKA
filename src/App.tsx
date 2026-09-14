import React, { useState, useEffect, useCallback } from 'react';
import {
  Player,
  TabType,
  InformeJugador,
  Partido,
  EventoCalendario,
  PlanPartidoSemanal,
  PrincipioGrupal,
  ReunionGrupal,
  PlanDesarrolloIndividual,
  RegistroWellnessRPE,
  EquipoClasificacion,
  JugadaABP,
  VideoClipMarca,
  MiembroStaff,
  ParteMedico,
  LogisticaViaje,
} from './types';
import { INITIAL_PLAYERS } from './data/initialPlayers';
import { INITIAL_REPORTS } from './data/initialReports';
import { INITIAL_MATCHES } from './data/initialMatches';
import {
  INITIAL_CALENDAR,
  INITIAL_WEEKLY_PLAN,
  INITIAL_GROUP_PRINCIPLES,
  INITIAL_GROUP_MEETINGS,
  INITIAL_INDIVIDUAL_PLANS,
  INITIAL_WELLNESS_RPE,
  INITIAL_STANDINGS,
  INITIAL_ABP,
  INITIAL_VIDEO_CLIPS,
  INITIAL_STAFF,
  INITIAL_MEDICAL,
  INITIAL_LOGISTICS,
} from './data/initialSectionData';

// Component Views
import { InicioView } from './components/InicioView';
import { Plantilla } from './components/Plantilla';
import { CalendarioView } from './components/CalendarioView';
import { PlanPartidoView } from './components/PlanPartidoView';
import { DesarrolloGrupalView } from './components/DesarrolloGrupalView';
import { DesarrolloIndividualView } from './components/DesarrolloIndividualView';
import { WellnessRpeView } from './components/WellnessRpeView';
import { EstadisticasView } from './components/EstadisticasView';
import { ResultadosClasifView } from './components/ResultadosClasifView';
import { RepositorioAbpView } from './components/RepositorioAbpView';
import { EditorVideoView } from './components/EditorVideoView';
import { OtrasInfoView } from './components/OtrasInfoView';
import { CampoPizarra } from './components/CampoPizarra';
import { InformesView } from './components/InformesView';
import { PartidosView } from './components/PartidosView';

// Modals
import { FichaModal } from './components/FichaModal';
import { PlayerEditorModal } from './components/PlayerEditorModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { SupabaseStatusModal } from './components/SupabaseStatusModal';
import { supabase } from './lib/supabase';
import { useTheme } from './context/ThemeContext';
import escudoGernika from './assets/escudo-gernika.png';

import {
  Home,
  Users,
  Calendar,
  ClipboardList,
  Target,
  UserCheck,
  Activity,
  BarChart3,
  Trophy,
  BookOpen,
  Video,
  Info,
  Layout,
  ClipboardCheck,
  RefreshCw,
  UploadCloud,
  Sun,
  Moon,
  Menu,
  X,
  Shield,
  CheckCircle2,
  AlertCircle,
  Database,
} from 'lucide-react';

const STORAGE_KEY_PLAYERS = 'sd_gernika_juvenil_plantilla_26_27_v1';
const STORAGE_KEY_REPORTS = 'sd_gernika_juvenil_informes_26_27_v1';
const STORAGE_KEY_MATCHES = 'sd_gernika_juvenil_partidos_26_27_v2';
const STORAGE_KEY_CALENDAR = 'sd_gernika_juvenil_calendario_26_27_v2';
const STORAGE_KEY_ABP = 'sd_gernika_juvenil_abp_26_27_v1';
const STORAGE_KEY_WELLNESS = 'sd_gernika_juvenil_wellness_26_27_v1';
const STORAGE_KEY_STANDINGS = 'sd_gernika_juvenil_clasificacion_26_27_v2';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  // Navigation tab state: Default 'inicio' as requested
  const [activeTab, setActiveTab] = useState<TabType>('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. Players state
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PLAYERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error parsing local players:', e);
      }
    }
    return INITIAL_PLAYERS;
  });

  // 2. Reports state
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

  // 3. Matches state
  const [partidos, setPartidos] = useState<Partido[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MATCHES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 34) return parsed;
      } catch (e) {
        console.error('Error parsing local matches:', e);
      }
    }
    return INITIAL_MATCHES;
  });

  // 4. Calendario state
  const [eventos, setEventos] = useState<EventoCalendario[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CALENDAR);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing calendar:', e);
      }
    }
    return INITIAL_CALENDAR;
  });

  // 5. Plan semanal state
  const [planSemanal, setPlanSemanal] = useState<PlanPartidoSemanal>(INITIAL_WEEKLY_PLAN);

  // 6. Desarrollo grupal state
  const [principiosGrupales, setPrincipiosGrupales] = useState<PrincipioGrupal[]>(INITIAL_GROUP_PRINCIPLES);
  const [reunionesGrupales, setReunionesGrupales] = useState<ReunionGrupal[]>(INITIAL_GROUP_MEETINGS);

  // 7. Desarrollo individual state
  const [planesIndividuales, setPlanesIndividuales] = useState<PlanDesarrolloIndividual[]>(INITIAL_INDIVIDUAL_PLANS);

  // 8. Wellness y RPE state
  const [registrosWellness, setRegistrosWellness] = useState<RegistroWellnessRPE[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_WELLNESS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing wellness:', e);
      }
    }
    return INITIAL_WELLNESS_RPE;
  });

  // 9. Resultados y Clasif.
  const [clasificacion, setClasificacion] = useState<EquipoClasificacion[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STANDINGS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 18) return parsed;
      } catch (e) {
        console.error('Error parsing standings:', e);
      }
    }
    return INITIAL_STANDINGS;
  });

  // 10. Repositorio ABP state
  const [jugadasABP, setJugadasABP] = useState<JugadaABP[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ABP);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing ABP:', e);
      }
    }
    return INITIAL_ABP;
  });

  // 11. Editor de vídeo state
  const [videoClips, setVideoClips] = useState<VideoClipMarca[]>(INITIAL_VIDEO_CLIPS);

  // 12. Otras informaciones state
  const [staff] = useState<MiembroStaff[]>(INITIAL_STAFF);
  const [partesMedicos] = useState<ParteMedico[]>(INITIAL_MEDICAL);
  const [logistica] = useState<LogisticaViaje>(INITIAL_LOGISTICS);

  // Supabase status
  const [supabaseStatus, setSupabaseStatus] = useState<
    'connecting' | 'connected' | 'offline' | 'error'
  >('connecting');
  const [statusMessage, setStatusMessage] = useState<string>('Conectando con Supabase...');
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isFichaOpen, setIsFichaOpen] = useState(false);

  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Dedicated Delete Confirmation Modal
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);

  // Supabase Status / Diagnostics Modal
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Local persistence sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(informes));
  }, [informes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(partidos));
  }, [partidos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CALENDAR, JSON.stringify(eventos));
  }, [eventos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ABP, JSON.stringify(jugadasABP));
  }, [jugadasABP]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WELLNESS, JSON.stringify(registrosWellness));
  }, [registrosWellness]);

  // Initial Supabase Sync
  const cargarJugadoresSupabase = useCallback(async () => {
    setIsSyncing(true);
    try {
      // 1. Consultar tabla en minúsculas 'jugadores'
      let { data, error } = await supabase
        .from('jugadores')
        .select('*')
        .order('dorsal', { ascending: true });

      // Fallback a mayúsculas si hiciera falta
      if (error && error.message.includes('schema cache')) {
        const retry = await supabase.from('JUGADORES').select('*').order('dorsal', { ascending: true });
        if (!retry.error) {
          data = retry.data;
          error = null;
        }
      }

      if (error) {
        console.warn('Supabase fetch error:', error.message);
        setSupabaseStatus('offline');
        setStatusMessage('Supabase: ' + error.message);
        return;
      }

      if (data && data.length > 0) {
        setPlayers((prevLocal) => {
          const mapped: Player[] = data!.map((d: any) => {
            const localMatch = prevLocal.find(
              (p) => String(p.id) === String(d.id) || p.dorsal === Number(d.dorsal)
            );
            return {
              id: d.id,
              nombre: d.nombre || localMatch?.nombre || 'Sin nombre',
              dorsal: d.dorsal !== null && d.dorsal !== undefined ? Number(d.dorsal) : (localMatch?.dorsal ?? 99),
              nacimiento: d.nacimiento ? Number(d.nacimiento) : (localMatch?.nacimiento ?? 2008),
              fechaNacimiento: d.fecha_nacimiento || d.fechaNacimiento || localMatch?.fechaNacimiento,
              minutosJugados: d.minutos_jugados ?? d.minutosJugados ?? localMatch?.minutosJugados,
              partidosJugados: d.partidos_jugados ?? d.partidosJugados ?? localMatch?.partidosJugados,
              partidosTitular: d.partidos_titular ?? d.partidosTitular ?? localMatch?.partidosTitular,
              lateralidad: d.lateralidad || localMatch?.lateralidad || 'Diestro',
              posicion: d.posicion || localMatch?.posicion || 'Futbolista',
              posicionTactico: d.posicion_tactico || d.posicionTactico || localMatch?.posicionTactico,
              posicionEuskera: d.posicion_euskera || d.posicionEuskera || localMatch?.posicionEuskera,
              posicionAlternativa: d.posicion_alternativa || d.posicionAlternativa || localMatch?.posicionAlternativa,
              posicionAlternativaEuskera: d.posicion_alternativa_euskera || d.posicionAlternativaEuskera || localMatch?.posicionAlternativaEuskera,
              posicion_x: d.posicion_x !== undefined && d.posicion_x !== null ? Number(d.posicion_x) : (localMatch?.posicion_x ?? 50),
              posicion_y: d.posicion_y !== undefined && d.posicion_y !== null ? Number(d.posicion_y) : (localMatch?.posicion_y ?? 50),
              posicion_alt_x: d.posicion_alt_x !== undefined && d.posicion_alt_x !== null ? Number(d.posicion_alt_x) : localMatch?.posicion_alt_x,
              posicion_alt_y: d.posicion_alt_y !== undefined && d.posicion_alt_y !== null ? Number(d.posicion_alt_y) : localMatch?.posicion_alt_y,
              tecnica: d.tecnica !== null && d.tecnica !== undefined ? Number(d.tecnica) : (localMatch?.tecnica ?? 3),
              tactica: d.tactica !== null && d.tactica !== undefined ? Number(d.tactica) : (localMatch?.tactica ?? 3),
              condicional: d.condicional !== null && d.condicional !== undefined ? Number(d.condicional) : (localMatch?.condicional ?? 3),
              tomaDecision: d.toma_decision || d.tomaDecision || localMatch?.tomaDecision || 3,
              actitud: d.actitud || localMatch?.actitud || 3,
              wellness: d.wellness || localMatch?.wellness || 3,
              rpe: d.rpe || localMatch?.rpe || 6,
              fotoUrl: d.foto_url || d.fotoUrl || localMatch?.fotoUrl || '',
              telefono: d.telefono || localMatch?.telefono || '',
              email: d.email || d.correo || localMatch?.email || '',
              esTitular: Boolean(d.es_titular ?? d.esTitular ?? localMatch?.esTitular),
              enCampo: Boolean(d.en_campo ?? d.enCampo ?? localMatch?.enCampo),
            };
          });
          localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(mapped));
          return mapped;
        });

        setSupabaseStatus('connected');
        setStatusMessage(`Supabase: ${data.length} juveniles sincronizados`);
      } else {
        setSupabaseStatus('connected');
        setStatusMessage('Supabase conectado (tabla vacía, usando plantilla local)');
      }
    } catch (err: any) {
      console.warn('Supabase exception:', err.message);
      setSupabaseStatus('offline');
      setStatusMessage('Modo local activo');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    cargarJugadoresSupabase();
  }, [cargarJugadoresSupabase]);

  // Player CRUD Handlers
  const guardarJugador = async (playerData: Partial<Player>) => {
    let jugadorFinal: Player;
    const targetPlayer =
      (playerData.id ? players.find((p) => String(p.id) === String(playerData.id)) : null) ||
      editingPlayer;

    if (targetPlayer) {
      jugadorFinal = {
        ...targetPlayer,
        ...playerData,
        id: targetPlayer.id,
      };

      setPlayers((prev) => {
        const updated = prev.map((p) => (String(p.id) === String(targetPlayer.id) ? jugadorFinal : p));
        localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(updated));
        return updated;
      });
      showToast(`Jugador ${jugadorFinal.nombre} (#${jugadorFinal.dorsal}) actualizado`, 'success');
    } else {
      const maxId = players.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
      const newId = maxId + 1;

      jugadorFinal = {
        id: newId,
        nombre: playerData.nombre || 'Nuevo Futbolista',
        dorsal: playerData.dorsal !== undefined ? Number(playerData.dorsal) : 99,
        nacimiento: playerData.nacimiento !== undefined ? Number(playerData.nacimiento) : 2008,
        fechaNacimiento: playerData.fechaNacimiento,
        minutosJugados: playerData.minutosJugados !== undefined ? Number(playerData.minutosJugados) : 0,
        partidosJugados: playerData.partidosJugados !== undefined ? Number(playerData.partidosJugados) : 0,
        partidosTitular: playerData.partidosTitular !== undefined ? Number(playerData.partidosTitular) : 0,
        lateralidad: playerData.lateralidad || 'Diestro',
        posicion: playerData.posicion || 'Futbolista',
        posicionTactico: playerData.posicionTactico,
        posicionEuskera: playerData.posicionEuskera,
        posicionAlternativa: playerData.posicionAlternativa,
        posicionAlternativaEuskera: playerData.posicionAlternativaEuskera,
        tecnica: playerData.tecnica !== undefined ? Number(playerData.tecnica) : 3,
        tactica: playerData.tactica !== undefined ? Number(playerData.tactica) : 3,
        condicional: playerData.condicional !== undefined ? Number(playerData.condicional) : 3,
        tomaDecision: 3,
        actitud: 3,
        wellness: 3,
        rpe: 6,
        fotoUrl: playerData.fotoUrl || '',
        telefono: playerData.telefono || '',
        email: playerData.email || '',
        posicion_x: playerData.posicion_x ?? 50,
        posicion_y: playerData.posicion_y ?? 50,
        posicion_alt_x: playerData.posicion_alt_x,
        posicion_alt_y: playerData.posicion_alt_y,
        esTitular: Boolean(playerData.esTitular),
        enCampo: false,
        habilidadesConBalon: playerData.habilidadesConBalon,
        habilidadesSinBalon: playerData.habilidadesSinBalon,
      };

      setPlayers((prev) => {
        const updated = [...prev, jugadorFinal];
        localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(updated));
        return updated;
      });
      showToast(`Jugador ${jugadorFinal.nombre} (#${jugadorFinal.dorsal}) creado con éxito`, 'success');
    }

    // Sincronización con Supabase (tabla 'jugadores')
    try {
      const basePayload: Record<string, any> = {
        nombre: jugadorFinal.nombre,
        dorsal: Number(jugadorFinal.dorsal),
        nacimiento: Number(jugadorFinal.nacimiento) || 2008,
        lateralidad: jugadorFinal.lateralidad || 'Diestro',
        posicion: jugadorFinal.posicion || 'Futbolista',
        posicion_tactico: jugadorFinal.posicionTactico || null,
        posicion_euskera: jugadorFinal.posicionEuskera || null,
        tecnica: Number(jugadorFinal.tecnica) || 3,
        tactica: Number(jugadorFinal.tactica) || 3,
        condicional: Number(jugadorFinal.condicional) || 3,
        toma_decision: Number(jugadorFinal.tomaDecision) || 3,
        actitud: Number(jugadorFinal.actitud) || 3,
        wellness: Number(jugadorFinal.wellness) || 3,
        rpe: Number(jugadorFinal.rpe) || 6,
        telefono: jugadorFinal.telefono || '',
        email: jugadorFinal.email || '',
        posicion_x: Number(jugadorFinal.posicion_x) || 50,
        posicion_y: Number(jugadorFinal.posicion_y) || 50,
        es_titular: Boolean(jugadorFinal.esTitular),
      };

      const fullPayload = { ...basePayload };
      if (jugadorFinal.posicionAlternativa) fullPayload.posicion_alternativa = jugadorFinal.posicionAlternativa;
      if (jugadorFinal.posicionAlternativaEuskera) fullPayload.posicion_alternativa_euskera = jugadorFinal.posicionAlternativaEuskera;
      if (jugadorFinal.posicion_alt_x !== undefined) fullPayload.posicion_alt_x = Number(jugadorFinal.posicion_alt_x);
      if (jugadorFinal.posicion_alt_y !== undefined) fullPayload.posicion_alt_y = Number(jugadorFinal.posicion_alt_y);
      if (jugadorFinal.fechaNacimiento) fullPayload.fecha_nacimiento = jugadorFinal.fechaNacimiento;
      if (jugadorFinal.minutosJugados !== undefined) fullPayload.minutos_jugados = Number(jugadorFinal.minutosJugados);
      if (jugadorFinal.partidosJugados !== undefined) fullPayload.partidos_jugados = Number(jugadorFinal.partidosJugados);
      if (jugadorFinal.partidosTitular !== undefined) fullPayload.partidos_titular = Number(jugadorFinal.partidosTitular);

      const attemptSave = async (payloadToSave: Record<string, any>) => {
        if (targetPlayer) {
          const numId = Number(targetPlayer.id);
          if (!isNaN(numId)) {
            return await supabase.from('jugadores').update(payloadToSave).eq('id', numId);
          }
        } else {
          return await supabase.from('jugadores').insert([{ ...payloadToSave, id: jugadorFinal.id }]);
        }
        return { error: null };
      };

      let result = await attemptSave(fullPayload);
      if (result?.error && result.error.message.includes('schema cache')) {
        result = await attemptSave(basePayload);
      }

      if (result?.error) {
        console.warn('Supabase save error:', result.error.message);
        if (result.error.code === '42501' || result.error.message.includes('policy')) {
          showToast('Guardado localmente. Supabase bloqueó la escritura por política RLS (ver Estado Supabase).', 'info');
        } else {
          showToast(`Guardado localmente. Supabase: ${result.error.message}`, 'info');
        }
      } else {
        setSupabaseStatus('connected');
        setStatusMessage('Sincronizado con Supabase');
      }
    } catch (err: any) {
      console.warn('Error saving to Supabase:', err.message);
    }

    setIsEditorOpen(false);
    setEditingPlayer(null);
  };

  const borrarJugador = (target: Player | string | number) => {
    if (typeof target === 'object' && target !== null) {
      setPlayerToDelete(target);
    } else {
      const found = players.find((p) => String(p.id) === String(target));
      if (found) setPlayerToDelete(found);
    }
  };

  const handleQuickUpdatePlayer = async (updatedPlayer: Player) => {
    setPlayers((prev) => {
      const next = prev.map((p) => (String(p.id) === String(updatedPlayer.id) ? { ...p, ...updatedPlayer } : p));
      localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(next));
      return next;
    });

    try {
      const numId = Number(updatedPlayer.id);
      if (!isNaN(numId)) {
        await supabase
          .from('jugadores')
          .update({
            posicion: updatedPlayer.posicion,
            posicion_tactico: updatedPlayer.posicionTactico,
            posicion_euskera: updatedPlayer.posicionEuskera,
            posicion_alternativa: updatedPlayer.posicionAlternativa || null,
            posicion_alternativa_euskera: updatedPlayer.posicionAlternativaEuskera || null,
            posicion_x: updatedPlayer.posicion_x,
            posicion_y: updatedPlayer.posicion_y,
            posicion_alt_x: updatedPlayer.posicion_alt_x ?? null,
            posicion_alt_y: updatedPlayer.posicion_alt_y ?? null,
          })
          .eq('id', numId);
      }
    } catch (err: any) {
      console.warn('Silent sync error on quick player update:', err.message);
    }
  };

  const ejecutarBorrado = async () => {
    if (!playerToDelete) return;
    const target = playerToDelete;

    setPlayers((prev) => {
      const updated = prev.filter((p) => String(p.id) !== String(target.id));
      localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(updated));
      return updated;
    });
    showToast(`Jugador ${target.nombre} (#${target.dorsal}) eliminado`, 'info');

    try {
      const numId = Number(target.id);
      if (!isNaN(numId)) {
        const { error } = await supabase.from('jugadores').delete().eq('id', numId);
        if (error) console.warn('Error deleting in Supabase:', error.message);
      }
    } catch (err: any) {
      console.warn('Error connecting to Supabase for delete:', err.message);
    }

    setPlayerToDelete(null);
  };

  const handleUpdatePlayerPosition = (id: string | number, x: number, y: number) => {
    setPlayers((prev) =>
      prev.map((p) => (String(p.id) === String(id) ? { ...p, posicion_x: x, posicion_y: y } : p))
    );
  };

  // Section Handlers
  const handleAddEvento = (nuevo: Omit<EventoCalendario, 'id'>) => {
    const conId: EventoCalendario = { ...nuevo, id: `cal-${Date.now()}` };
    setEventos((prev) => [conId, ...prev]);
    showToast(`Evento "${nuevo.titulo}" añadido al Calendario`, 'success');
  };

  const handleToggleEvento = (id: string) => {
    setEventos((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completado: !e.completado } : e))
    );
  };

  const handleAddPrincipio = (nuevo: Omit<PrincipioGrupal, 'id'>) => {
    const conId: PrincipioGrupal = { ...nuevo, id: `pg-${Date.now()}` };
    setPrincipiosGrupales((prev) => [conId, ...prev]);
    showToast('Principio grupal guardado en el Modelo de Juego', 'success');
  };

  const handleAddReunion = (nueva: Omit<ReunionGrupal, 'id'>) => {
    const conId: ReunionGrupal = { ...nueva, id: `rg-${Date.now()}` };
    setReunionesGrupales((prev) => [conId, ...prev]);
    showToast('Acta de reunión registrada', 'success');
  };

  const handleAddNotaIndividual = (jugadorId: string | number, nota: string, autor: string) => {
    const fecha = new Date().toISOString().split('T')[0];
    setPlanesIndividuales((prev) => {
      const exists = prev.find((p) => String(p.jugadorId) === String(jugadorId));
      if (exists) {
        return prev.map((p) =>
          String(p.jugadorId) === String(jugadorId)
            ? {
                ...p,
                notasSeguimiento: [{ fecha, nota, autor }, ...p.notasSeguimiento],
              }
            : p
        );
      } else {
        const playerObj = players.find((p) => String(p.id) === String(jugadorId));
        const newPlan: PlanDesarrolloIndividual = {
          id: `pdi-${jugadorId}`,
          jugadorId,
          jugadorNombre: playerObj?.nombre || 'Jugador',
          dorsal: playerObj?.dorsal || 99,
          posicion: playerObj?.posicion || 'Futbolista',
          objetivosTecnicos: ['Precisión técnica', 'Control orientado'],
          objetivosTacticos: ['Perfilado corporal', 'Vigilancias defensivas'],
          objetivosFisicos: ['Resistencia neuromuscular'],
          puntosMejoraClave: ['Velocidad de ejecución'],
          puntosFuertes: ['Compromiso y actitud'],
          evaluacionStaff: { tecnica: 4, tactica: 4, fisico: 4, tomaDecision: 4, mental: 5 },
          notasSeguimiento: [{ fecha, nota, autor }],
        };
        return [newPlan, ...prev];
      }
    });
    showToast('Nota de seguimiento individual guardada', 'success');
  };

  const handleAddRegistroWellness = (nuevo: Omit<RegistroWellnessRPE, 'id'>) => {
    const conId: RegistroWellnessRPE = { ...nuevo, id: `w-${Date.now()}` };
    setRegistrosWellness((prev) => [conId, ...prev]);
    showToast(`Wellness y RPE registrados para ${nuevo.jugadorNombre}`, 'success');
  };

  const handleAddJugadaABP = (nueva: Omit<JugadaABP, 'id'>) => {
    const conId: JugadaABP = { ...nueva, id: `abp-${Date.now()}` };
    setJugadasABP((prev) => [conId, ...prev]);
    showToast(`Jugada ABP "${nueva.nombre}" añadida al Repositorio`, 'success');
  };

  const handleAddClipVideo = (nuevo: Omit<VideoClipMarca, 'id'>) => {
    const conId: VideoClipMarca = { ...nuevo, id: `vc-${Date.now()}` };
    setVideoClips((prev) => [conId, ...prev]);
    showToast(`Corte de vídeo "${nuevo.titulo}" añadido`, 'success');
  };

  // Informes & Partidos Handlers
  const handleAddInforme = (nuevoInforme: Omit<InformeJugador, 'id'>) => {
    const reportWithId: InformeJugador = { ...nuevoInforme, id: `rep-${Date.now()}` };
    setInformes((prev) => [reportWithId, ...prev]);
    showToast(`Informe registrado para ${nuevoInforme.jugadorNombre}`, 'success');
  };

  const handleDeleteInforme = (id: string) => {
    setInformes((prev) => prev.filter((inf) => inf.id !== id));
    showToast('Informe eliminado', 'info');
  };

  const handleAddPartido = (nuevoPartido: Omit<Partido, 'id'>) => {
    const partidoWithId: Partido = { ...nuevoPartido, id: `partido-${Date.now()}` };
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
    setPartidos((prev) => prev.filter((p) => p.id !== id));
    showToast('Partido eliminado del calendario', 'info');
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

  // The 12 Main Navigation Sections requested by the user
  const navItems = [
    {
      id: 'inicio' as TabType,
      label: 'Inicio',
      count: null,
      icon: Home,
      description: 'Panel general con todos los apartados',
    },
    {
      id: 'plantilla' as TabType,
      label: 'Plantilla',
      count: players.length,
      icon: Users,
      description: 'Fichas, alineación y gestión',
    },
    {
      id: 'calendario' as TabType,
      label: 'Calendario',
      count: eventos.length,
      icon: Calendar,
      description: 'Microciclo, entrenos y descanso',
    },
    {
      id: 'plan_partido' as TabType,
      label: 'Plan de Partido Semanal',
      count: null,
      icon: ClipboardList,
      description: 'Microciclo MD-4 a MD+1 y rival',
    },
    {
      id: 'desarrollo_grupal' as TabType,
      label: 'Desarrollo Grupal',
      count: principiosGrupales.length,
      icon: Target,
      description: 'Modelo de juego y bitácora',
    },
    {
      id: 'desarrollo_individual' as TabType,
      label: 'Desarrollo Individual',
      count: planesIndividuales.length,
      icon: UserCheck,
      description: 'Planes técnicos y seguimiento',
    },
    {
      id: 'wellness_rpe' as TabType,
      label: 'Wellness y RPE',
      count: registrosWellness.length,
      icon: Activity,
      description: 'Control matinal y carga sRPE',
    },
    {
      id: 'estadisticas' as TabType,
      label: 'Estadísticas',
      count: null,
      icon: BarChart3,
      description: 'Métricas colectivas e individuales',
    },
    {
      id: 'resultados_clasif' as TabType,
      label: 'Resultados y Clasif.',
      count: null,
      icon: Trophy,
      description: 'Tabla 2ª RFEF y marcadores',
    },
    {
      id: 'abp' as TabType,
      label: 'Repositorio ABP',
      count: jugadasABP.length,
      icon: BookOpen,
      description: 'Estrategia a balón parado',
    },
    {
      id: 'editor_video' as TabType,
      label: 'Editor de Vídeo',
      count: videoClips.length,
      icon: Video,
      description: 'Cortes tácticos y telestrator',
    },
    {
      id: 'otras_info' as TabType,
      label: 'Otras Informaciones',
      count: null,
      icon: Info,
      description: 'Staff, enfermería, viajes y normas',
    },
  ];

  const currentTabInfo = navItems.find((n) => n.id === activeTab) || navItems[0];

  return (
    <div
      className={`min-h-screen ${
        theme === 'dark' ? 'bg-[#000000] text-white' : 'bg-[#f6f6f6] text-neutral-900'
      } flex flex-col md:flex-row font-sans transition-colors duration-200`}
    >
      {/* ========================================================================= */}
      {/* MOBILE TOP BAR (Visible only on small screens) */}
      {/* ========================================================================= */}
      <div
        className={`md:hidden flex items-center justify-between p-3 border-b sticky top-0 z-30 transition-colors ${
          theme === 'dark' ? 'bg-black border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <img
            src={escudoGernika}
            alt="Escudo SD Gernika"
            className="w-8 h-8 object-contain shrink-0"
          />
          <div className="text-left">
            <span className="font-black text-sm uppercase tracking-tight block">SD GERNIKA JUVENIL</span>
            <span className="text-[10px] font-mono text-neutral-400 uppercase">
              2026-27 · {currentTabInfo.label}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`p-2 border transition-colors cursor-pointer ${
            theme === 'dark' ? 'border-neutral-700 text-white' : 'border-neutral-300 text-black'
          }`}
          aria-label="Abrir menú de navegación vertical"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VERTICAL SIDEBAR (On Left: permanent on desktop, drawer on mobile) */}
      {/* ========================================================================= */}
      <aside
        id="sidebar-vertical-navegacion"
        className={`fixed md:sticky top-0 left-0 h-screen w-72 shrink-0 z-40 border-r flex flex-col justify-between transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-[#0a0a0a] border-neutral-800 text-white'
            : 'bg-white border-neutral-300 text-neutral-900 shadow-md'
        } ${
          mobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0 pointer-events-none md:pointer-events-auto'
        }`}
      >
        {/* Top Club Branding in Sidebar */}
        <div className="overflow-y-auto flex-1">
          <div className="p-4 border-b border-neutral-800/80">
            <div className="flex items-center gap-3">
              <img
                src={escudoGernika}
                alt="Escudo SD Gernika"
                className="w-10 h-10 object-contain shrink-0"
              />
              <div className="text-left">
                <h1 className="font-black text-base uppercase tracking-tight leading-none">
                  SD GERNIKA JUVENIL
                </h1>
                <p className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">
                  Liga Nacional 2026-2027
                </p>
                <p className="text-[9px] font-mono text-neutral-500 uppercase">
                  Estadio Urbieta Zelaia
                </p>
              </div>
            </div>
          </div>

          {/* Decorative Monochrome Striped Divider */}
          <div className="h-0.5 w-full bg-repeating-linear-gradient(45deg, #333, #333 4px, #000 4px, #000 8px) opacity-40" />

          {/* Vertical Sections Navigation */}
          <nav aria-label="Apartados principales" className="p-2.5 space-y-1">
            <div className="px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400">
              Apartados Principales
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 font-mono text-xs uppercase tracking-wider border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-white text-black font-black border-white shadow-xs'
                        : 'bg-black text-white font-black border-black shadow-xs'
                      : theme === 'dark'
                      ? 'bg-transparent text-neutral-300 border-transparent hover:border-neutral-800 hover:bg-neutral-900/80 hover:text-white'
                      : 'bg-transparent text-neutral-700 border-transparent hover:border-neutral-300 hover:bg-neutral-100 hover:text-black'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.count !== null && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 border shrink-0 ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-white'
                          : theme === 'dark'
                          ? 'bg-neutral-900 text-neutral-400 border-neutral-800'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Tactical Sub-views (Pizarra y Exportación PDF) */}
            <div className="px-3 pt-3 pb-1 text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-500">
              Herramientas Adicionales
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab('campo');
                setMobileMenuOpen(false);
              }}
              className={`w-full px-3 py-1.5 font-mono text-xs uppercase tracking-wider border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'campo'
                  ? theme === 'dark'
                    ? 'bg-white text-black font-black border-white'
                    : 'bg-black text-white font-black border-black'
                  : 'bg-transparent text-neutral-400 border-transparent hover:text-white'
              }`}
            >
              <Layout className="w-3.5 h-3.5 shrink-0" />
              <span>Campo (Pizarra)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('informes');
                setMobileMenuOpen(false);
              }}
              className={`w-full px-3 py-1.5 font-mono text-xs uppercase tracking-wider border text-left flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'informes'
                  ? theme === 'dark'
                    ? 'bg-white text-black font-black border-white'
                    : 'bg-black text-white font-black border-black'
                  : 'bg-transparent text-neutral-400 border-transparent hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <ClipboardCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Informes (PDF)</span>
              </div>
              <span className="text-[9px] border px-1 border-neutral-700">PDF</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Tools (Theme, Supabase Sync) */}
        <div className="p-3 border-t border-neutral-800/80 space-y-2 shrink-0">
          {/* Database Connection Pill */}
          <div
            className={`p-2 border text-[11px] font-mono flex items-center justify-between transition-colors cursor-pointer group ${
              theme === 'dark' ? 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-600' : 'bg-neutral-50 border-neutral-300 text-neutral-800 hover:border-neutral-400'
            }`}
            onClick={() => setIsSupabaseModalOpen(true)}
            title="Haz clic para ver diagnóstico o sincronizar con Supabase"
          >
            <div className="flex items-center gap-2 truncate">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  supabaseStatus === 'connected'
                    ? 'bg-white animate-pulse'
                    : supabaseStatus === 'connecting'
                    ? 'bg-neutral-400 animate-spin'
                    : 'bg-neutral-600'
                }`}
              />
              <span className="truncate font-semibold group-hover:underline">{statusMessage}</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cargarJugadoresSupabase();
              }}
              disabled={isSyncing}
              className="p-1 border border-neutral-700 hover:border-white transition-colors cursor-pointer disabled:opacity-50"
              title="Recargar desde Supabase"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`w-full px-3 py-1.5 font-mono text-xs uppercase tracking-wider border flex items-center justify-center gap-2 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-500 hover:text-white'
                : 'bg-neutral-100 border-neutral-300 text-neutral-700 hover:border-black hover:text-black'
            }`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5" />
                <span>Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span>Modo Oscuro</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <header
          className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between sticky top-0 md:static z-20 transition-colors ${
            theme === 'dark'
              ? 'bg-[#000000]/95 backdrop-blur-sm border-neutral-800'
              : 'bg-white/95 backdrop-blur-sm border-neutral-300'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400">
              <span>SD GERNIKA JUVENIL</span>
              <span>/</span>
              <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                {currentTabInfo.label}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-tight mt-0.5">
              {currentTabInfo.label}
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-2.5">
            <span
              className={`px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider border ${
                theme === 'dark'
                  ? 'border-neutral-800 bg-neutral-900 text-neutral-300'
                  : 'border-neutral-300 bg-neutral-100 text-neutral-800'
              }`}
            >
              Liga Nacional Juvenil • Temporada 2026/2027
            </span>
          </div>
        </header>

        {/* Toast Alert */}
        {toast && (
          <div className="px-6 pt-4 w-full animate-in fade-in duration-150">
            <div
              className={`p-3 border-2 font-mono text-xs flex items-center justify-between shadow-xl ${
                toast.type === 'error'
                  ? 'bg-red-950/90 border-red-500 text-red-100'
                  : theme === 'dark'
                  ? 'bg-black border-white text-white'
                  : 'bg-white border-black text-black'
              }`}
            >
              <div className="flex items-center gap-2">
                {toast.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                )}
                <span>{toast.text}</span>
              </div>
              <button
                onClick={() => setToast(null)}
                className="ml-3 font-bold hover:underline cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Main Workspace View */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {/* 1. Inicio (Hub with buttons for ALL sections) */}
          {activeTab === 'inicio' && (
            <InicioView
              onNavigate={(tab) => setActiveTab(tab)}
              playersCount={players.length}
              partidosCount={partidos.length}
              informesCount={informes.length}
            />
          )}

          {/* 2. Plantilla */}
          {activeTab === 'plantilla' && (
            <Plantilla
              players={players}
              onOpenPlayerModal={verFicha}
              onEditPlayer={abrirEditor}
              onDeletePlayer={borrarJugador}
              onAddNewPlayer={() => abrirEditor(null)}
              onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
              onUpdatePlayer={handleQuickUpdatePlayer}
              onUpdatePlayerPosition={handleUpdatePlayerPosition}
            />
          )}

          {/* 3. Calendario */}
          {activeTab === 'calendario' && (
            <CalendarioView
              eventos={eventos}
              onAddEvento={handleAddEvento}
              onToggleCompletado={handleToggleEvento}
            />
          )}

          {/* 4. Plan de Partido Semanal */}
          {activeTab === 'plan_partido' && (
            <PlanPartidoView plan={planSemanal} onUpdatePlan={setPlanSemanal} />
          )}

          {/* 5. Desarrollo Grupal */}
          {activeTab === 'desarrollo_grupal' && (
            <DesarrolloGrupalView
              principios={principiosGrupales}
              reuniones={reunionesGrupales}
              onAddPrincipio={handleAddPrincipio}
              onAddReunion={handleAddReunion}
            />
          )}

          {/* 6. Desarrollo Individual */}
          {activeTab === 'desarrollo_individual' && (
            <DesarrolloIndividualView
              players={players}
              planes={planesIndividuales}
              onAddNota={handleAddNotaIndividual}
            />
          )}

          {/* 7. Wellness y RPE */}
          {activeTab === 'wellness_rpe' && (
            <WellnessRpeView
              players={players}
              registros={registrosWellness}
              onAddRegistro={handleAddRegistroWellness}
            />
          )}

          {/* 8. Estadísticas */}
          {activeTab === 'estadisticas' && (
            <EstadisticasView players={players} />
          )}

          {/* 9. Resultados y Clasif. */}
          {activeTab === 'resultados_clasif' && (
            <ResultadosClasifView clasificacion={clasificacion} partidos={partidos} />
          )}

          {/* 10. Repositorio ABP */}
          {activeTab === 'abp' && (
            <RepositorioAbpView jugadas={jugadasABP} onAddJugada={handleAddJugadaABP} />
          )}

          {/* 11. Editor de Vídeo */}
          {activeTab === 'editor_video' && (
            <EditorVideoView clips={videoClips} onAddClip={handleAddClipVideo} />
          )}

          {/* 12. Otras Informaciones */}
          {activeTab === 'otras_info' && (
            <OtrasInfoView staff={staff} partesMedicos={partesMedicos} logistica={logistica} />
          )}

          {/* Additional Tool: Campo (Pizarra) */}
          {activeTab === 'campo' && (
            <CampoPizarra
              players={players}
              onUpdatePlayerPosition={handleUpdatePlayerPosition}
              onOpenPlayerModal={verFicha}
            />
          )}

          {/* Additional Tool: Informes (con Exportar a PDF) */}
          {activeTab === 'informes' && (
            <InformesView
              players={players}
              informes={informes}
              onAddInforme={handleAddInforme}
              onDeleteInforme={handleDeleteInforme}
              onOpenPlayerModal={verFicha}
            />
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* Player Card Modal (Ficha Técnica con Editar, Guardar y Borrar) */}
      {isFichaOpen && selectedPlayer && (
        <FichaModal
          player={selectedPlayer}
          isOpen={isFichaOpen}
          onClose={() => setIsFichaOpen(false)}
          onEdit={() => {
            // Permite abrir editor extendido si se desea
            setIsFichaOpen(false);
            abrirEditor(selectedPlayer);
          }}
          onSave={async (updatedData) => {
            await guardarJugador(updatedData);
            setSelectedPlayer((prev) => (prev ? { ...prev, ...updatedData } : null));
          }}
          onDelete={(playerToDelete) => {
            setIsFichaOpen(false);
            borrarJugador(playerToDelete);
          }}
        />
      )}

      {/* Player Add/Edit Modal */}
      {isEditorOpen && (
        <PlayerEditorModal
          player={editingPlayer}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={async (data) => {
            await guardarJugador(data);
            setIsEditorOpen(false);
          }}
        />
      )}

      {/* Dedicated Player Delete Confirmation Modal */}
      {playerToDelete && (
        <ConfirmDeleteModal
          player={playerToDelete}
          isOpen={Boolean(playerToDelete)}
          onClose={() => setPlayerToDelete(null)}
          onConfirm={ejecutarBorrado}
        />
      )}

      {/* Supabase Status & Synchronization Diagnostics Modal */}
      <SupabaseStatusModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        players={players}
        onReloadFromSupabase={cargarJugadoresSupabase}
        onPlayersUpdated={(newPlayers) => {
          setPlayers(newPlayers);
          localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(newPlayers));
        }}
        showToast={showToast}
      />
    </div>
  );
}
