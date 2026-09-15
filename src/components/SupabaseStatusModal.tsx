import React, { useState, useEffect } from 'react';
import { supabase, SB_URL } from '../lib/supabase';
import { Player } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  UploadCloud,
  DownloadCloud,
  ExternalLink,
} from 'lucide-react';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  onReloadFromSupabase: () => Promise<void>;
  onPlayersUpdated: (newPlayers: Player[]) => void;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({
  isOpen,
  onClose,
  players,
  onReloadFromSupabase,
  onPlayersUpdated,
  showToast,
}) => {
  const { theme } = useTheme();
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Diagnostic state
  const [readOk, setReadOk] = useState<boolean | null>(null);
  const [rowCount, setRowCount] = useState<number>(0);
  const [writeOk, setWriteOk] = useState<boolean | null>(null);
  const [writeError, setWriteError] = useState<string | null>(null);

  const sqlScript = `-- =========================================================================
-- SD GERNIKA JUVENIL NACIONAL (TEMPORADA 2026/2027)
-- SCRIPT COMPLETO DE BASE DE DATOS: TABLA 'jugadores' Y PLANTILLA OFICIAL
-- =========================================================================

-- 1. Crear tabla 'jugadores' si no existe
CREATE TABLE IF NOT EXISTS public.jugadores (
    id bigint PRIMARY KEY,
    nombre text NOT NULL,
    dorsal integer NOT NULL,
    nacimiento integer DEFAULT 2008,
    fecha_nacimiento text,
    minutos_jugados integer DEFAULT 0,
    partidos_jugados integer DEFAULT 0,
    partidos_titular integer DEFAULT 0,
    lateralidad text DEFAULT 'Diestro',
    posicion text DEFAULT 'Futbolista',
    posicion_tactico text,
    posicion_euskera text,
    tecnica integer DEFAULT 3,
    tactica integer DEFAULT 3,
    condicional integer DEFAULT 3,
    toma_decision integer DEFAULT 3,
    actitud integer DEFAULT 3,
    wellness integer DEFAULT 3,
    rpe integer DEFAULT 6,
    foto_url text DEFAULT '',
    telefono text DEFAULT '',
    email text DEFAULT '',
    posicion_x double precision DEFAULT 50,
    posicion_y double precision DEFAULT 50,
    es_titular boolean DEFAULT false,
    en_campo boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. Asegurar columnas de la plantilla
ALTER TABLE public.jugadores ADD COLUMN IF NOT EXISTS fecha_nacimiento text;
ALTER TABLE public.jugadores ADD COLUMN IF NOT EXISTS minutos_jugados integer DEFAULT 0;
ALTER TABLE public.jugadores ADD COLUMN IF NOT EXISTS partidos_jugados integer DEFAULT 0;
ALTER TABLE public.jugadores ADD COLUMN IF NOT EXISTS partidos_titular integer DEFAULT 0;
ALTER TABLE public.jugadores ADD COLUMN IF NOT EXISTS foto_url text DEFAULT '';
ALTER TABLE public.jugadores ADD COLUMN IF NOT EXISTS posicion_tactico text;
ALTER TABLE public.jugadores ADD COLUMN IF NOT EXISTS posicion_euskera text;
ALTER TABLE public.jugadores ADD COLUMN IF NOT EXISTS toma_decision integer DEFAULT 3;
ALTER TABLE public.jugadores ADD COLUMN IF NOT EXISTS actitud integer DEFAULT 3;
ALTER TABLE public.jugadores ADD COLUMN IF NOT EXISTS wellness integer DEFAULT 3;
ALTER TABLE public.jugadores ADD COLUMN IF NOT EXISTS rpe integer DEFAULT 6;
ALTER TABLE public.jugadores ADD COLUMN IF NOT EXISTS posicion_x double precision DEFAULT 50;
ALTER TABLE public.jugadores ADD COLUMN IF NOT EXISTS posicion_y double precision DEFAULT 50;
ALTER TABLE public.jugadores ADD COLUMN IF NOT EXISTS es_titular boolean DEFAULT false;
ALTER TABLE public.jugadores ADD COLUMN IF NOT EXISTS en_campo boolean DEFAULT false;

-- 3. Desactivar RLS para permitir lectura y escritura directa desde la aplicación
ALTER TABLE public.jugadores DISABLE ROW LEVEL SECURITY;

-- 4. Inserción de los 27 jugadores oficiales con actualización automática si ya existen
INSERT INTO public.jugadores (
    id, dorsal, nombre, nacimiento, fecha_nacimiento, minutos_jugados, partidos_jugados, partidos_titular,
    lateralidad, posicion, posicion_tactico, posicion_euskera,
    tecnica, tactica, condicional, toma_decision, actitud, wellness, rpe,
    telefono, email, posicion_x, posicion_y, es_titular, en_campo
) VALUES
(1, 1, 'Gurutz Toña', 2008, '12/02/2008', 360, 4, 4, 'Diestro', 'Portero', 'POR', 'Atezaina', 4, 4, 4, 4, 5, 4, 6, '+34 610 33 44 01', 'g.tona@gernikaclub.eus', 50, 90, true, true),
(2, 2, 'Alain Urrutia', 2008, '05/04/2008', 345, 4, 4, 'Diestro', 'Lateral Derecho', 'LD', 'Eskuineko Laterala', 4, 4, 5, 4, 5, 4, 7, '+34 620 33 44 02', 'a.urrutia@gernikaclub.eus', 80, 76, true, true),
(3, 3, 'Aretx Martitegi', 2008, '18/06/2008', 330, 4, 4, 'Zurdo', 'Lateral Izquierdo', 'LI', 'Ezkerreko Laterala', 4, 4, 5, 4, 5, 4, 6, '+34 630 33 44 03', 'a.martitegi@gernikaclub.eus', 20, 76, true, true),
(4, 4, 'Urki Martija', 2008, '23/01/2008', 360, 4, 4, 'Diestro', 'Defensa Central', 'DFC1', 'Erdiko Atzelaria', 4, 5, 5, 4, 5, 5, 7, '+34 640 33 44 04', 'u.martija@gernikaclub.eus', 62, 80, true, true),
(5, 5, 'Haritz Atxalandabasoa', 2008, '14/09/2008', 360, 4, 4, 'Diestro', 'Defensa Central', 'DFC2', 'Erdiko Atzelaria', 4, 4, 5, 4, 5, 4, 7, '+34 650 33 44 05', 'h.atxalandabasoa@gernikaclub.eus', 38, 80, true, true),
(6, 6, 'Luken Marmol', 2008, '03/05/2008', 320, 4, 4, 'Diestro', 'Pivote Defensivo', 'MCD', 'Euskarria', 4, 5, 4, 5, 5, 4, 7, '+34 660 33 44 06', 'l.marmol@gernikaclub.eus', 50, 62, true, true),
(7, 7, 'Dani Urrutia', 2008, '11/11/2008', 290, 4, 4, 'Diestro', 'Extremo Derecho', 'ED', 'Eskuineko Hegalekoa', 5, 4, 5, 4, 5, 4, 7, '+34 670 33 44 07', 'd.urrutia@gernikaclub.eus', 82, 32, true, true),
(8, 8, 'Xabi López', 2008, '29/03/2008', 315, 4, 4, 'Diestro', 'Mediocentro Interior', 'MC', 'Barruko Erdilaria', 5, 5, 4, 5, 5, 4, 6, '+34 680 33 44 08', 'x.lopez@gernikaclub.eus', 65, 50, true, true),
(9, 9, 'Ager Kortabitarte', 2008, '07/08/2008', 335, 4, 4, 'Diestro', 'Delantero Centro', 'DC', 'Aurrelaria', 4, 4, 5, 4, 5, 5, 8, '+34 690 33 44 09', 'a.kortabitarte@gernikaclub.eus', 50, 22, true, true),
(10, 10, 'Aimar Carvajal', 2009, '19/02/2009', 280, 4, 3, 'Zurdo', 'Mediapunta / Interior', 'MC', 'Puntaerdia', 5, 4, 4, 5, 5, 4, 6, '+34 611 33 44 10', 'a.carvajal@gernikaclub.eus', 35, 50, true, true),
(11, 11, 'Antton Urzelai', 2008, '30/10/2008', 305, 4, 4, 'Zurdo', 'Extremo Izquierdo', 'EI', 'Ezkerreko Hegalekoa', 4, 4, 5, 4, 5, 4, 7, '+34 622 33 44 11', 'a.urzelai@gernikaclub.eus', 18, 32, true, true),
(12, 12, 'Oihan Fernández', 2009, '15/05/2009', 45, 1, 0, 'Diestro', 'Portero', 'POR', 'Atezaina', 4, 4, 4, 4, 4, 4, 6, '+34 633 33 44 12', 'o.fernandez@gernikaclub.eus', 50, 90, false, false),
(13, 13, 'Aratz Mendez', 2010, '20/04/2010', 0, 0, 0, 'Diestro', 'Portero', 'POR', 'Atezaina', 3, 3, 4, 4, 5, 4, 6, '+34 644 33 44 13', 'a.mendez@gernikaclub.eus', 50, 90, false, false),
(14, 14, 'Ugaitz Urrutia', 2009, '08/01/2009', 110, 3, 0, 'Diestro', 'Lateral Polivalente', 'LD', 'Laterala', 4, 4, 4, 4, 5, 4, 6, '+34 655 33 44 14', 'u.urrutia@gernikaclub.eus', 80, 76, false, false),
(15, 15, 'Enaitz Alberdi', 2008, '16/07/2008', 95, 2, 0, 'Diestro', 'Defensa Central', 'DFC1', 'Erdiko Atzelaria', 3, 4, 5, 4, 5, 4, 7, '+34 666 33 44 15', 'e.alberdi@gernikaclub.eus', 62, 80, false, false),
(16, 16, 'Luken Aranguena', 2009, '25/08/2009', 125, 3, 0, 'Diestro', 'Mediocentro', 'MC', 'Erdilaria', 4, 4, 4, 4, 5, 4, 6, '+34 677 33 44 16', 'l.aranguena@gernikaclub.eus', 65, 50, false, false),
(17, 17, 'Enaitz Isasi', 2009, '04/12/2009', 85, 2, 0, 'Zurdo', 'Pivote / Mediocentro', 'MCD', 'Euskarria', 4, 4, 4, 4, 5, 4, 6, '+34 688 33 44 17', 'e.isasi@gernikaclub.eus', 50, 62, false, false),
(18, 18, 'Markel Gorostiaga', 2008, '10/06/2008', 140, 3, 1, 'Diestro', 'Extremo', 'ED', 'Hegalekoa', 4, 4, 5, 4, 5, 4, 7, '+34 699 33 44 18', 'm.gorostiaga@gernikaclub.eus', 82, 32, false, false),
(19, 19, 'Samuel Correa', 2008, '14/04/2008', 115, 3, 0, 'Diestro', 'Delantero Centro', 'DC', 'Aurrelaria', 4, 4, 5, 4, 5, 5, 7, '+34 612 33 44 19', 's.correa@gernikaclub.eus', 50, 22, false, false),
(20, 20, 'Ouissam Chkairi', 2009, '02/03/2009', 90, 3, 0, 'Zurdo', 'Extremo Rápido', 'EI', 'Hegalekoa', 5, 4, 5, 4, 5, 4, 7, '+34 623 33 44 20', 'o.chkairi@gernikaclub.eus', 18, 32, false, false),
(21, 21, 'Joaquín Vázquez', 2009, '18/09/2009', 130, 3, 1, 'Diestro', 'Mediapunta Creativo', 'MC', 'Puntaerdia', 5, 4, 4, 5, 4, 4, 6, '+34 634 33 44 21', 'j.vazquez@gernikaclub.eus', 35, 50, false, false),
(22, 22, 'Iker Larruzea', 2009, '27/05/2009', 70, 2, 0, 'Diestro', 'Lateral Derecho', 'LD', 'Eskuineko Laterala', 4, 4, 4, 4, 5, 4, 6, '+34 645 33 44 22', 'i.larruzea@gernikaclub.eus', 80, 76, false, false),
(23, 23, 'Aratz Areskurrinaga', 2008, '11/10/2008', 65, 2, 0, 'Diestro', 'Defensa Central', 'DFC2', 'Erdiko Atzelaria', 3, 4, 5, 4, 5, 4, 7, '+34 656 33 44 23', 'a.areskurrinaga@gernikaclub.eus', 38, 80, false, false),
(24, 24, 'Aimar Zautua', 2009, '14/03/2009', 80, 2, 0, 'Diestro', 'Mediocentro Organizador', 'MC', 'Erdilaria', 4, 4, 4, 4, 5, 4, 6, '+34 667 33 44 24', 'a.zautua@gernikaclub.eus', 65, 50, false, false),
(25, 25, 'Mikel Estévez', 2009, '19/08/2009', 75, 2, 0, 'Zurdo', 'Extremo Izquierdo', 'EI', 'Ezkerreko Hegalekoa', 4, 4, 4, 4, 5, 4, 6, '+34 678 33 44 25', 'm.estevez@gernikaclub.eus', 18, 32, false, false),
(26, 26, 'Urko Arriaga', 2010, '02/01/2010', 40, 1, 0, 'Diestro', 'Defensa Polivalente', 'DFC1', 'Atzelaria', 3, 4, 4, 4, 5, 4, 6, '+34 689 33 44 26', 'u.arriaga@gernikaclub.eus', 62, 80, false, false),
(27, 27, 'Aimar Beraza', 2010, '15/07/2010', 50, 2, 0, 'Diestro', 'Delantero / Segunda Punta', 'DC', 'Aurrelaria', 4, 4, 4, 4, 5, 4, 6, '+34 691 33 44 27', 'a.beraza@gernikaclub.eus', 50, 22, false, false)
ON CONFLICT (id) DO UPDATE SET
    dorsal = EXCLUDED.dorsal,
    nombre = EXCLUDED.nombre,
    nacimiento = EXCLUDED.nacimiento,
    fecha_nacimiento = EXCLUDED.fecha_nacimiento,
    minutos_jugados = EXCLUDED.minutos_jugados,
    partidos_jugados = EXCLUDED.partidos_jugados,
    partidos_titular = EXCLUDED.partidos_titular,
    lateralidad = EXCLUDED.lateralidad,
    posicion = EXCLUDED.posicion,
    posicion_tactico = EXCLUDED.posicion_tactico,
    posicion_euskera = EXCLUDED.posicion_euskera,
    tecnica = EXCLUDED.tecnica,
    tactica = EXCLUDED.tactica,
    condicional = EXCLUDED.condicional,
    toma_decision = EXCLUDED.toma_decision,
    actitud = EXCLUDED.actitud,
    wellness = EXCLUDED.wellness,
    rpe = EXCLUDED.rpe,
    telefono = EXCLUDED.telefono,
    email = EXCLUDED.email,
    posicion_x = EXCLUDED.posicion_x,
    posicion_y = EXCLUDED.posicion_y,
    es_titular = EXCLUDED.es_titular,
    en_campo = EXCLUDED.en_campo;`;

  const runDiagnostics = async () => {
    setTesting(true);
    setWriteError(null);

    try {
      // 1. Test SELECT on lowercase 'jugadores'
      const { data, error: readErr } = await supabase
        .from('jugadores')
        .select('*')
        .order('dorsal', { ascending: true });

      if (readErr) {
        setReadOk(false);
        setRowCount(0);
      } else {
        setReadOk(true);
        setRowCount(data?.length || 0);
      }

      // 2. Test UPDATE or probe write permission
      // We probe with an UPDATE for a non-existent or first ID, or an upsert test
      const testProbe = await supabase
        .from('jugadores')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', -99999);

      // If testProbe has an error about RLS or unauthorized:
      if (testProbe.error) {
        setWriteOk(false);
        setWriteError(testProbe.error.message);
      } else {
        // Try testing an actual insert or update if rows exist
        if (data && data.length > 0) {
          const first = data[0];
          const updateFirst = await supabase
            .from('jugadores')
            .update({ nombre: first.nombre })
            .eq('id', first.id);
          if (updateFirst.error) {
            setWriteOk(false);
            setWriteError(updateFirst.error.message);
          } else {
            setWriteOk(true);
          }
        } else {
          // Try inserting a test row and deleting it immediately
          const testRow = { id: 99999, nombre: '__test_probe__', dorsal: 99 };
          const insertRes = await supabase.from('jugadores').insert([testRow]);
          if (insertRes.error) {
            setWriteOk(false);
            setWriteError(insertRes.error.message);
          } else {
            setWriteOk(true);
            await supabase.from('jugadores').delete().eq('id', 99999);
          }
        }
      }
    } catch (err: any) {
      setReadOk(false);
      setWriteOk(false);
      setWriteError(err.message || 'Error desconocido');
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runDiagnostics();
    }
  }, [isOpen]);

  const copySql = async () => {
    try {
      await navigator.clipboard.writeText(sqlScript);
      setCopied(true);
      showToast('Código SQL copiado al portapapeles', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Por favor copia el código manualmente', 'info');
    }
  };

  const handleUploadAll = async () => {
    if (players.length === 0) return;
    setSyncing(true);

    try {
      const payloads = players.map((p) => {
        const item: Record<string, any> = {
          id: Number(p.id) || 99,
          nombre: p.nombre,
          dorsal: Number(p.dorsal),
          nacimiento: Number(p.nacimiento) || 2008,
          lateralidad: p.lateralidad || 'Diestro',
          posicion: p.posicion || 'Futbolista',
          posicion_tactico: p.posicionTactico || null,
          posicion_euskera: p.posicionEuskera || null,
          tecnica: Number(p.tecnica) || 3,
          tactica: Number(p.tactica) || 3,
          condicional: Number(p.condicional) || 3,
          toma_decision: Number(p.tomaDecision) || 3,
          actitud: Number(p.actitud) || 3,
          wellness: Number(p.wellness) || 3,
          rpe: Number(p.rpe) || 6,
          telefono: p.telefono || '',
          email: p.email || p.correo || '',
          posicion_x: Number(p.posicion_x) || 50,
          posicion_y: Number(p.posicion_y) || 50,
          es_titular: Boolean(p.esTitular),
        };

        if (p.fechaNacimiento) item.fecha_nacimiento = p.fechaNacimiento;
        if (p.minutosJugados !== undefined) item.minutos_jugados = Number(p.minutosJugados);
        if (p.partidosJugados !== undefined) item.partidos_jugados = Number(p.partidosJugados);
        if (p.partidosTitular !== undefined) item.partidos_titular = Number(p.partidosTitular);
        return item;
      });

      // Intento 1: Batch upsert directo con todos los campos
      let batchRes = await supabase.from('jugadores').upsert(payloads);

      // Si falla por columnas aún no agregadas en postgres:
      if (batchRes.error && batchRes.error.message.includes('schema cache')) {
        const basePayloads = payloads.map((item) => {
          const copy = { ...item };
          delete copy.fecha_nacimiento;
          delete copy.minutos_jugados;
          delete copy.partidos_jugados;
          delete copy.partidos_titular;
          return copy;
        });
        batchRes = await supabase.from('jugadores').upsert(basePayloads);
      }

      if (!batchRes.error) {
        showToast(`¡Los ${players.length} jugadores de la SD Gernika se han volcado en Supabase con éxito!`, 'success');
        setWriteOk(true);
        setWriteError(null);
        await runDiagnostics();
      } else {
        // Fallback por jugador individual
        let successCount = 0;
        let lastErr: string | null = batchRes.error.message;

        for (const item of payloads) {
          let singleRes = await supabase.from('jugadores').upsert([item]);
          if (singleRes.error && singleRes.error.message.includes('schema cache')) {
            const baseItem = { ...item };
            delete baseItem.fecha_nacimiento;
            delete baseItem.minutos_jugados;
            delete baseItem.partidos_jugados;
            delete baseItem.partidos_titular;
            singleRes = await supabase.from('jugadores').upsert([baseItem]);
          }

          if (!singleRes.error) {
            successCount++;
          } else {
            lastErr = singleRes.error.message;
          }
        }

        if (successCount === players.length) {
          showToast(`¡Los ${successCount} jugadores se han guardado en Supabase!`, 'success');
          setWriteOk(true);
          setWriteError(null);
          await runDiagnostics();
        } else if (successCount > 0) {
          showToast(`Se subieron ${successCount} de ${players.length} jugadores. ${lastErr || ''}`, 'info');
          await runDiagnostics();
        } else {
          showToast(`Supabase bloqueó la subida: ${lastErr || 'Error RLS'}. Ejecuta el script en SQL Editor.`, 'error');
          setWriteOk(false);
          setWriteError(lastErr);
        }
      }
    } catch (err: any) {
      showToast('Error al sincronizar con Supabase: ' + err.message, 'error');
    } finally {
      setSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="overlay-supabase-status"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !testing && !syncing) onClose();
      }}
    >
      <div
        id="modal-supabase-status"
        className={`border-2 w-full max-w-xl p-6 max-h-[92vh] overflow-y-auto shadow-2xl relative transition-colors ${
          theme === 'dark'
            ? 'bg-[#111111] border-white text-white'
            : 'bg-white border-black text-neutral-900 shadow-neutral-500/30'
        }`}
        role="dialog"
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between pb-3 border-b mb-5 transition-colors ${
            theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-tight">
                Estado y Conexión de Supabase
              </h2>
              <p className="text-[11px] font-mono text-neutral-400">
                Sincronización remota de la plantilla SD Gernika Juvenil
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`transition-colors p-1 ${
              theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-black'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Connection Status Box */}
        <div className="space-y-4 font-mono text-xs mb-6">
          <div
            className={`p-3.5 border rounded transition-colors ${
              theme === 'dark' ? 'bg-black/60 border-neutral-800' : 'bg-neutral-50 border-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                Proyecto Supabase
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                Conectado
              </span>
            </div>
            <div className="text-xs break-all font-semibold mb-1">
              {SB_URL}
            </div>
            <div className="text-[11px] text-neutral-400">
              Tabla objetivo: <span className="font-bold text-white">public.jugadores</span> (PostgreSQL)
            </div>
          </div>

          {/* Diagnostic results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Reading Status */}
            <div
              className={`p-3 border rounded ${
                readOk
                  ? 'border-emerald-700/50 bg-emerald-950/20'
                  : 'border-red-700/50 bg-red-950/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                {readOk ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span className="font-bold text-xs uppercase">
                  Lectura (SELECT)
                </span>
              </div>
              <p className="text-[11px] text-neutral-300">
                {readOk
                  ? `Correcto: ${rowCount} jugadores registrados en la nube.`
                  : 'Error de consulta en Supabase.'}
              </p>
            </div>

            {/* Writing Status */}
            <div
              className={`p-3 border rounded ${
                writeOk === true
                  ? 'border-emerald-700/50 bg-emerald-950/20'
                  : writeOk === false
                  ? 'border-amber-700/60 bg-amber-950/20'
                  : 'border-neutral-700 bg-neutral-900/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                {writeOk === true ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : writeOk === false ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-neutral-400 animate-spin shrink-0" />
                )}
                <span className="font-bold text-xs uppercase">
                  Escritura (INSERT/UPDATE)
                </span>
              </div>
              <p className="text-[11px] text-neutral-300">
                {writeOk === true
                  ? 'Permisos activos: Puedes editar y crear jugadores.'
                  : writeOk === false
                  ? 'Bloqueado por RLS: Los cambios se guardan localmente.'
                  : 'Verificando permisos de escritura...'}
              </p>
            </div>
          </div>

          {/* RLS Warning & Instructions */}
          {writeOk === false && (
            <div
              className={`p-4 border border-amber-500/40 rounded transition-colors ${
                theme === 'dark' ? 'bg-amber-950/20 text-amber-200' : 'bg-amber-50 text-amber-900'
              }`}
            >
              <div className="flex items-start gap-2.5 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider">
                    ¿Por qué no se actualizan en Supabase?
                  </h4>
                  <p className="text-[11px] leading-relaxed mt-1 opacity-90">
                    Tu base de datos tiene activa la seguridad <strong>Row-Level Security (RLS)</strong> en la tabla <code className="px-1 py-0.5 bg-black/40 rounded">jugadores</code>, lo que rechaza las escrituras anónimas (<code className="px-1 py-0.5 bg-black/40 rounded">error 42501</code>).
                  </p>
                  <p className="text-[11px] leading-relaxed mt-1 opacity-90">
                    <strong>Tus cambios están 100% seguros y guardados en tu navegador</strong>. Para que también se guarden en Supabase, ejecuta este comando en el <strong>SQL Editor</strong> de Supabase:
                  </p>
                </div>
              </div>

              {/* SQL Snippet with Copy Button */}
              <div className="mt-3 relative">
                <pre
                  className={`p-3 text-[11px] font-mono rounded overflow-x-auto border ${
                    theme === 'dark' ? 'bg-black text-neutral-200 border-neutral-800' : 'bg-white text-neutral-900 border-neutral-300'
                  }`}
                >
                  {sqlScript}
                </pre>
                <button
                  type="button"
                  onClick={copySql}
                  className="absolute top-2 right-2 px-2.5 py-1 text-[10px] font-mono uppercase font-bold bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar SQL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[10px]">
                <span className="opacity-75">
                  1. Entra a Supabase &gt; SQL Editor &gt; Nuevo query &gt; Pega y presiona Run.
                </span>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-bold flex items-center gap-1 hover:opacity-80"
                >
                  <span>Abrir Supabase</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Paso 2: Volcar plantilla completa */}
              <div
                className={`mt-3 p-3 border rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  theme === 'dark'
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                }`}
              >
                <div>
                  <p className="text-xs font-bold flex items-center gap-1.5 font-mono text-emerald-400">
                    <UploadCloud className="w-4 h-4" />
                    <span>Paso 2: Volcar los {players.length} Jugadores a Supabase</span>
                  </p>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    Una vez ejecutado el script en el SQL Editor, pulsa este botón para volcar la plantilla completa de la SD Gernika a la base de datos con un solo clic.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleUploadAll}
                  disabled={syncing || testing}
                  className="w-full sm:w-auto px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black border border-emerald-400 rounded flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <UploadCloud className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? 'Volcando...' : `Subir ${players.length} Jugadores`}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={runDiagnostics}
            disabled={testing}
            className={`w-full sm:w-auto px-3.5 py-2 border font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-neutral-900 border-neutral-700 text-white hover:border-white'
                : 'bg-neutral-100 border-neutral-300 text-black hover:border-black'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>Diagnosticar</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={async () => {
                await onReloadFromSupabase();
                await runDiagnostics();
              }}
              disabled={testing || syncing}
              className={`flex-1 sm:flex-initial px-3.5 py-2 border font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-700 text-white hover:border-white'
                  : 'bg-neutral-100 border-neutral-300 text-black hover:border-black'
              }`}
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>Cargar de Nube</span>
            </button>

            <button
              type="button"
              onClick={handleUploadAll}
              disabled={syncing || testing}
              className="flex-1 sm:flex-initial px-4 py-2 border font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 border-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Subiendo...' : `Subir ${players.length} Jugadores`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
