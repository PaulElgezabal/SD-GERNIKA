import React, { useState, useEffect, useRef } from 'react';
import { Player, HabilidadesConBalon, HabilidadesSinBalon } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  X,
  Edit3,
  Save,
  Trash2,
  Check,
  AlertTriangle,
  Phone,
  Mail,
  Calendar,
  Compass,
  BarChart2,
  Upload,
  User,
  Shield,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { getPlayerCardData } from './Plantilla';
import { PentagonoHabilidades, PentagonoItem } from './PentagonoHabilidades';
import { CampoSelectorPosiciones } from './CampoSelectorPosiciones';
import {
  OFFICIAL_TACTICAL_POSITIONS,
  getTacticalPositionByCode,
} from '../data/tacticalPositions';

interface FichaModalProps {
  player: Player | null;
  isOpen?: boolean;
  onClose: () => void;
  onEdit?: (player: Player) => void;
  onSave?: (player: Player) => Promise<void> | void;
  onDelete?: (player: Player) => void;
}

const TACTICAL_OPTIONS: { code: string; label: string; linea: string }[] = [
  { code: 'POR', label: 'Portero (Atezaina)', linea: 'porteros' },
  { code: 'LD', label: 'Lateral Derecho (Eskuin Atzelaria)', linea: 'defensas' },
  { code: 'DFC', label: 'Defensa Central (Zentrala)', linea: 'defensas' },
  { code: 'DFC1', label: 'Central Derecho (Eskuin Zentrala)', linea: 'defensas' },
  { code: 'DFC2', label: 'Central Izquierdo (Ezker Zentrala)', linea: 'defensas' },
  { code: 'LI', label: 'Lateral Izquierdo (Ezker Atzelaria)', linea: 'defensas' },
  { code: 'MCD', label: 'Pivote Defensivo (Euskarria)', linea: 'mediocentros' },
  { code: 'MC', label: 'Mediocentro (Erdilaria)', linea: 'mediocentros' },
  { code: 'MCO', label: 'Mediapunta (Puntaerdia)', linea: 'mediocentros' },
  { code: 'MI', label: 'Medio Izquierdo', linea: 'mediocentros' },
  { code: 'MD', label: 'Medio Derecho', linea: 'mediocentros' },
  { code: 'ED', label: 'Extremo Derecho (Eskuin Hegalekoa)', linea: 'delanteros' },
  { code: 'EI', label: 'Extremo Izquierdo (Ezker Hegalekoa)', linea: 'delanteros' },
  { code: 'DC', label: 'Delantero Centro (Aurrelaria)', linea: 'delanteros' },
];

export const FichaModal: React.FC<FichaModalProps> = ({
  player,
  isOpen = true,
  onClose,
  onEdit,
  onSave,
  onDelete,
}) => {
  const { theme } = useTheme();

  // Mode: View or Edit
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeTab, setActiveTab] = useState<'pentagonos' | 'barras'>('pentagonos');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states for inline editing
  const [nombre, setNombre] = useState('');
  const [dorsal, setDorsal] = useState<number | ''>('');
  const [posicion, setPosicion] = useState('');
  const [posicionTactico, setPosicionTactico] = useState('');
  const [posicionEuskera, setPosicionEuskera] = useState('');
  const [posicionAlternativa, setPosicionAlternativa] = useState('');
  const [posicionAlternativaEuskera, setPosicionAlternativaEuskera] = useState('');
  const [posicionX, setPosicionX] = useState<number | undefined>(undefined);
  const [posicionY, setPosicionY] = useState<number | undefined>(undefined);
  const [posicionAltX, setPosicionAltX] = useState<number | undefined>(undefined);
  const [posicionAltY, setPosicionAltY] = useState<number | undefined>(undefined);
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [nacimiento, setNacimiento] = useState<number | ''>(2008);
  const [lateralidad, setLateralidad] = useState<'Diestro' | 'Zurdo' | 'Ambidiestro'>('Diestro');
  const [minutosJugados, setMinutosJugados] = useState<number | ''>('');
  const [partidosJugados, setPartidosJugados] = useState<number | ''>('');
  const [partidosTitular, setPartidosTitular] = useState<number | ''>('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [tecnica, setTecnica] = useState<number>(3);
  const [tactica, setTactica] = useState<number>(3);
  const [condicional, setCondicional] = useState<number>(3);

  const [itemsConBalon, setItemsConBalon] = useState<PentagonoItem[]>([]);
  const [itemsSinBalon, setItemsSinBalon] = useState<PentagonoItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state whenever player changes
  useEffect(() => {
    if (player) {
      setNombre(player.nombre || '');
      setDorsal(player.dorsal ?? '');
      setPosicion(player.posicion || 'Futbolista');
      setPosicionTactico(player.posicionTactico || 'MC');
      setPosicionEuskera(player.posicionEuskera || '');
      setPosicionAlternativa(player.posicionAlternativa || '');
      setPosicionAlternativaEuskera(player.posicionAlternativaEuskera || '');
      setPosicionX(player.posicion_x);
      setPosicionY(player.posicion_y);
      setPosicionAltX(player.posicion_alt_x);
      setPosicionAltY(player.posicion_alt_y);
      setFechaNacimiento(player.fechaNacimiento || '');
      setNacimiento(player.nacimiento ?? 2008);
      setLateralidad(
        (player.lateralidad as 'Diestro' | 'Zurdo' | 'Ambidiestro') || 'Diestro'
      );
      setMinutosJugados(player.minutosJugados ?? '');
      setPartidosJugados(player.partidosJugados ?? '');
      setPartidosTitular(player.partidosTitular ?? '');
      setTelefono(player.telefono || '');
      setEmail(player.email || player.correo || '');
      setFotoUrl(player.foto_url || player.fotoUrl || '');

      const t = player.tecnica ?? 3;
      const tc = player.tactica ?? 3;
      const c = player.condicional ?? 3;
      setTecnica(t);
      setTactica(tc);
      setCondicional(c);

      const cb = player.habilidadesConBalon;
      setItemsConBalon([
        { key: 'control', label: 'Control', value: cb?.control ?? t },
        { key: 'regate', label: 'Regate', value: cb?.regate ?? t },
        { key: 'disparo', label: 'Disparo', value: cb?.disparo ?? t },
        { key: 'conduccion', label: 'Conducción', value: cb?.conduccion ?? t },
        { key: 'pase', label: 'Pase', value: cb?.pase ?? t },
      ]);

      const sb = player.habilidadesSinBalon;
      setItemsSinBalon([
        { key: 'presion', label: 'Presión', value: sb?.presion ?? tc },
        { key: 'desmarque', label: 'Desmarque', value: sb?.desmarque ?? tc },
        { key: 'colocacion', label: 'Posición', value: sb?.colocacion ?? tc },
        { key: 'anticipacion', label: 'Anticipación', value: sb?.anticipacion ?? tc },
        { key: 'sacrificio', label: 'Sacrificio', value: sb?.sacrificio ?? tc },
      ]);

      setIsEditing(false);
      setConfirmDelete(false);
      setSaveStatus('idle');
      setErrorMessage(null);
    }
  }, [player]);

  if (!isOpen || !player) return null;

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor selecciona un archivo de imagen válido');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFotoUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Build current updated player object
  const buildUpdatedPlayer = (): Player => {
    const cbObj: HabilidadesConBalon = {
      control: itemsConBalon.find((i) => i.key === 'control')?.value ?? tecnica,
      regate: itemsConBalon.find((i) => i.key === 'regate')?.value ?? tecnica,
      disparo: itemsConBalon.find((i) => i.key === 'disparo')?.value ?? tecnica,
      conduccion: itemsConBalon.find((i) => i.key === 'conduccion')?.value ?? tecnica,
      pase: itemsConBalon.find((i) => i.key === 'pase')?.value ?? tecnica,
    };

    const sbObj: HabilidadesSinBalon = {
      presion: itemsSinBalon.find((i) => i.key === 'presion')?.value ?? tactica,
      desmarque: itemsSinBalon.find((i) => i.key === 'desmarque')?.value ?? tactica,
      colocacion: itemsSinBalon.find((i) => i.key === 'colocacion')?.value ?? tactica,
      anticipacion: itemsSinBalon.find((i) => i.key === 'anticipacion')?.value ?? tactica,
      sacrificio: itemsSinBalon.find((i) => i.key === 'sacrificio')?.value ?? tactica,
    };

    return {
      ...player,
      nombre: nombre.trim() || player.nombre,
      dorsal: dorsal !== '' ? Number(dorsal) : player.dorsal,
      nacimiento: nacimiento !== '' ? Number(nacimiento) : player.nacimiento,
      fechaNacimiento: fechaNacimiento || player.fechaNacimiento,
      posicion: posicion || player.posicion,
      posicionTactico: posicionTactico || player.posicionTactico,
      posicionEuskera: posicionEuskera || player.posicionEuskera,
      posicionAlternativa: posicionAlternativa || undefined,
      posicionAlternativaEuskera: posicionAlternativaEuskera || undefined,
      posicion_x: posicionX !== undefined ? posicionX : player.posicion_x,
      posicion_y: posicionY !== undefined ? posicionY : player.posicion_y,
      posicion_alt_x: posicionAltX !== undefined ? posicionAltX : player.posicion_alt_x,
      posicion_alt_y: posicionAltY !== undefined ? posicionAltY : player.posicion_alt_y,
      lateralidad,
      minutosJugados: minutosJugados !== '' ? Number(minutosJugados) : player.minutosJugados,
      partidosJugados: partidosJugados !== '' ? Number(partidosJugados) : player.partidosJugados,
      partidosTitular: partidosTitular !== '' ? Number(partidosTitular) : player.partidosTitular,
      telefono,
      email,
      correo: email,
      fotoUrl,
      foto_url: fotoUrl,
      tecnica,
      tactica,
      condicional,
      habilidadesConBalon: cbObj,
      habilidadesSinBalon: sbObj,
    };
  };

  // Save changes handler
  const handleSave = async () => {
    if (!nombre.trim()) {
      setErrorMessage('El nombre del futbolista no puede estar vacío');
      return;
    }

    setSaveStatus('saving');
    setErrorMessage(null);

    try {
      const updated = buildUpdatedPlayer();
      if (onSave) {
        await onSave(updated);
      }
      setSaveStatus('success');
      setIsEditing(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      console.error('Error saving player in FichaModal:', err);
      setErrorMessage(err.message || 'Error al guardar los datos');
      setSaveStatus('error');
    }
  };

  // Delete player handler
  const handleDelete = () => {
    if (onDelete) {
      onDelete(player);
    }
    setConfirmDelete(false);
    onClose();
  };

  // Revert changes back to original
  const handleCancelEdit = () => {
    setNombre(player.nombre || '');
    setDorsal(player.dorsal ?? '');
    setPosicion(player.posicion || 'Futbolista');
    setPosicionTactico(player.posicionTactico || 'MC');
    setFechaNacimiento(player.fechaNacimiento || '');
    setNacimiento(player.nacimiento ?? 2008);
    setLateralidad((player.lateralidad as any) || 'Diestro');
    setMinutosJugados(player.minutosJugados ?? '');
    setPartidosJugados(player.partidosJugados ?? '');
    setPartidosTitular(player.partidosTitular ?? '');
    setTelefono(player.telefono || '');
    setEmail(player.email || player.correo || '');
    setFotoUrl(player.foto_url || player.fotoUrl || '');
    setTecnica(player.tecnica ?? 3);
    setTactica(player.tactica ?? 3);
    setCondicional(player.condicional ?? 3);
    setIsEditing(false);
    setErrorMessage(null);
  };

  const currentStats = getPlayerCardData(player);

  return (
    <div
      id="overlay-ficha"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !confirmDelete) onClose();
      }}
    >
      <div
        id="modal-ficha"
        className={`border-2 w-full max-h-[92vh] overflow-y-auto ${
          activeTab === 'pentagonos' || isEditing ? 'max-w-2xl' : 'max-w-lg'
        } p-5 sm:p-6 shadow-2xl relative font-sans transition-all rounded-xl my-auto ${
          theme === 'dark'
            ? 'bg-[#0f0f0f] border-neutral-700 text-white'
            : 'bg-white border-neutral-300 text-neutral-900 shadow-neutral-500/20'
        }`}
        role="dialog"
      >
        {/* ========================================================================= */}
        {/* TOP BAR: TITULO + BOTONES PRINCIPALES (EDITAR, GUARDAR, BORRAR) + CERRAR */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded font-mono font-black text-xs border ${
                theme === 'dark'
                  ? 'bg-neutral-900 text-emerald-400 border-emerald-500/40'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}
            >
              FICHA TÉCNICA
            </span>
            {isEditing && (
              <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                Modo Edición
              </span>
            )}
          </div>

          {/* BOTONES ACCIÓN SOLICITADOS: EDITAR, GUARDAR Y BORRAR */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* 1. BOTÓN EDITAR */}
            <button
              id="btn-ficha-editar"
              type="button"
              onClick={() => {
                setIsEditing(!isEditing);
                setConfirmDelete(false);
                setErrorMessage(null);
                if (onEdit && !isEditing) {
                  // Notification or toggle
                }
              }}
              className={`px-2.5 py-1.5 rounded-lg border font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isEditing
                  ? 'bg-amber-500 text-black border-amber-400 shadow-xs'
                  : theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-700 text-neutral-200 hover:text-white hover:border-neutral-500 hover:bg-neutral-800'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:text-black hover:border-neutral-400 hover:bg-neutral-200'
              }`}
              title={isEditing ? 'Cancelar o salir de edición' : 'Editar datos de este futbolista'}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Editando' : 'Editar'}</span>
            </button>

            {/* 2. BOTÓN GUARDAR */}
            <button
              id="btn-ficha-guardar"
              type="button"
              disabled={saveStatus === 'saving'}
              onClick={handleSave}
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                saveStatus === 'success'
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                  : isEditing
                  ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500 shadow-sm animate-pulse'
                  : theme === 'dark'
                  ? 'bg-neutral-900 border-emerald-600/60 text-emerald-400 hover:bg-emerald-950/60 hover:border-emerald-400'
                  : 'bg-emerald-50 border-emerald-600 text-emerald-800 hover:bg-emerald-100'
              }`}
              title="Guardar cambios de la ficha"
            >
              {saveStatus === 'success' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Guardado!</span>
                </>
              ) : saveStatus === 'saving' ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar</span>
                </>
              )}
            </button>

            {/* 3. BOTÓN BORRAR */}
            <button
              id="btn-ficha-borrar"
              type="button"
              onClick={() => setConfirmDelete(!confirmDelete)}
              className={`px-2.5 py-1.5 rounded-lg border font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                confirmDelete
                  ? 'bg-red-600 text-white border-red-500 shadow-md'
                  : 'border-red-900/40 text-red-400 hover:bg-red-950/40 hover:border-red-500'
              }`}
              title="Eliminar este futbolista de la plantilla"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Borrar</span>
            </button>

            {/* CERRAR (X) */}
            <button
              id="btn-ficha-cerrar-x"
              type="button"
              onClick={onClose}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ml-1 ${
                theme === 'dark'
                  ? 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                  : 'border-neutral-200 text-neutral-500 hover:text-black hover:bg-neutral-100'
              }`}
              title="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* FEEDBACK DE ERROR O ÉXITO */}
        {errorMessage && (
          <div className="mb-4 p-2.5 bg-red-950/60 border border-red-800 rounded-lg text-red-200 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* BANNER DE CONFIRMACIÓN DE BORRADO DE SEGURIDAD */}
        {confirmDelete && (
          <div className="mb-5 p-4 rounded-xl border-2 border-red-500 bg-red-950/70 text-white font-mono animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-600 rounded-full text-white shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h4 className="font-black text-sm uppercase tracking-wide text-red-200">
                  ¿Eliminar a {player.nombre} (#{player.dorsal})?
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Esta acción eliminará permanentemente la ficha de este futbolista de la plantilla de la SD Gernika y de la base de datos.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-black text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                  >
                    Sí, Eliminar Definitivamente
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VISTA 1: MODO EDICIÓN COMPLETO (EDITAR / GUARDAR / BORRAR) */}
        {/* ========================================================================= */}
        {isEditing ? (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Foto y carga en edición */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-xl border border-neutral-800 bg-black/40">
              <div className="relative group shrink-0">
                <img
                  src={fotoUrl || 'https://via.placeholder.com/100?text=SDG'}
                  alt={nombre}
                  className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow-md"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://via.placeholder.com/100?text=SDG';
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] text-white font-mono transition-opacity cursor-pointer"
                >
                  <Upload className="w-4 h-4 mb-0.5" />
                  <span>Subir</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>

              <div className="flex-1 w-full space-y-1.5 font-mono text-xs">
                <label className="text-neutral-400 block font-bold uppercase text-[10px]">
                  URL de Fotografía o Subir Imagen
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={fotoUrl}
                    onChange={(e) => setFotoUrl(e.target.value)}
                    placeholder="https://ejemplo.com/foto.jpg"
                    className={`flex-1 px-2.5 py-1.5 rounded border text-xs ${
                      theme === 'dark'
                        ? 'bg-neutral-900 border-neutral-700 text-white'
                        : 'bg-neutral-50 border-neutral-300 text-black'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 bg-neutral-800 text-white rounded text-xs font-bold uppercase hover:bg-neutral-700 cursor-pointer shrink-0"
                  >
                    Examinar
                  </button>
                </div>
              </div>
            </div>

            {/* Datos Básicos: Dorsal, Nombre, Posición, Táctica */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 font-mono text-xs">
              {/* Dorsal */}
              <div className="sm:col-span-3 space-y-1">
                <label className="text-neutral-400 block font-bold uppercase text-[10px]">
                  Dorsal #
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={dorsal}
                  onChange={(e) => setDorsal(e.target.value === '' ? '' : Number(e.target.value))}
                  className={`w-full px-2.5 py-1.5 rounded border font-black text-sm text-center ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-700 text-white'
                      : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              {/* Nombre */}
              <div className="sm:col-span-9 space-y-1">
                <label className="text-neutral-400 block font-bold uppercase text-[10px]">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. GURUTZ TOSTADO"
                  className={`w-full px-2.5 py-1.5 rounded border font-bold text-xs uppercase ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-700 text-white'
                      : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              {/* Posición Habitual */}
              <div className="sm:col-span-6 space-y-1">
                <label className="text-neutral-400 block font-bold uppercase text-[10px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-pulse" />
                  <span>Posición Principal (Rojo Fuerte)</span>
                </label>
                <select
                  value={posicionTactico}
                  onChange={(e) => {
                    const code = e.target.value;
                    setPosicionTactico(code);
                    const match = OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === code);
                    if (match) {
                      setPosicion(match.label);
                      setPosicionEuskera(match.labelEuskera);
                      setPosicionX(match.x);
                      setPosicionY(match.y);
                    }
                  }}
                  className={`w-full px-2.5 py-1.5 rounded border text-xs font-bold ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-700 text-white'
                      : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                >
                  {OFFICIAL_TACTICAL_POSITIONS.map((t) => (
                    <option key={t.code} value={t.code}>
                      {t.code} - {t.label} ({t.labelEuskera})
                    </option>
                  ))}
                </select>
              </div>

              {/* Posición Alternativa / Secundaria (Rojo Suave) */}
              <div className="sm:col-span-6 space-y-1">
                <label className="text-neutral-400 block font-bold uppercase text-[10px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
                  <span>Posición Alternativa (Rojo Suave)</span>
                </label>
                <select
                  value={posicionAlternativa || ''}
                  onChange={(e) => {
                    const code = e.target.value;
                    if (!code) {
                      setPosicionAlternativa('');
                      setPosicionAlternativaEuskera('');
                      setPosicionAltX(undefined);
                      setPosicionAltY(undefined);
                    } else {
                      const match = OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === code);
                      if (match) {
                        setPosicionAlternativa(match.code);
                        setPosicionAlternativaEuskera(match.labelEuskera);
                        setPosicionAltX(match.x);
                        setPosicionAltY(match.y);
                      }
                    }
                  }}
                  className={`w-full px-2.5 py-1.5 rounded border text-xs font-bold ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-700 text-white'
                      : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                >
                  <option value="">(Sin posición alternativa / secundaria)</option>
                  {OFFICIAL_TACTICAL_POSITIONS.filter((t) => t.code !== posicionTactico).map((t) => (
                    <option key={`alt-opt-${t.code}`} value={t.code}>
                      {t.code} - {t.label} ({t.labelEuskera})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector Visual del Campo de Fútbol Exacto (Principal Rojo Fuerte / Alternativa Rojo Suave) */}
              <div className="sm:col-span-12 pt-2 pb-1">
                <CampoSelectorPosiciones
                  posicionPrincipalCode={posicionTactico}
                  onSelectPrincipal={(pos) => {
                    setPosicionTactico(pos.code);
                    setPosicion(pos.label);
                    setPosicionEuskera(pos.labelEuskera);
                    setPosicionX(pos.x);
                    setPosicionY(pos.y);
                  }}
                  posicionAlternativaCode={posicionAlternativa}
                  onSelectAlternativa={(pos) => {
                    if (pos) {
                      setPosicionAlternativa(pos.code);
                      setPosicionAlternativaEuskera(pos.labelEuskera);
                      setPosicionAltX(pos.x);
                      setPosicionAltY(pos.y);
                    } else {
                      setPosicionAlternativa('');
                      setPosicionAlternativaEuskera('');
                      setPosicionAltX(undefined);
                      setPosicionAltY(undefined);
                    }
                  }}
                  dorsal={dorsal}
                  nombre={nombre}
                />
              </div>

              {/* Fecha Nacimiento */}
              <div className="sm:col-span-4 space-y-1">
                <label className="text-neutral-400 block font-bold uppercase text-[10px]">
                  Fecha Nacimiento
                </label>
                <input
                  type="text"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className={`w-full px-2.5 py-1.5 rounded border text-xs ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-700 text-white'
                      : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              {/* Año Nacimiento */}
              <div className="sm:col-span-4 space-y-1">
                <label className="text-neutral-400 block font-bold uppercase text-[10px]">
                  Año Nacimiento
                </label>
                <input
                  type="number"
                  value={nacimiento}
                  onChange={(e) =>
                    setNacimiento(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  placeholder="2008"
                  className={`w-full px-2.5 py-1.5 rounded border text-xs ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-700 text-white'
                      : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              {/* Lateralidad */}
              <div className="sm:col-span-4 space-y-1">
                <label className="text-neutral-400 block font-bold uppercase text-[10px]">
                  Lateralidad
                </label>
                <select
                  value={lateralidad}
                  onChange={(e) => setLateralidad(e.target.value as any)}
                  className={`w-full px-2.5 py-1.5 rounded border text-xs ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-700 text-white'
                      : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                >
                  <option value="Diestro">Diestro</option>
                  <option value="Zurdo">Zurdo</option>
                  <option value="Ambidiestro">Ambidiestro</option>
                </select>
              </div>

              {/* Estadísticas de Temporada: Minutos, Partidos, Titular */}
              <div className="sm:col-span-4 space-y-1">
                <label className="text-neutral-400 block font-bold uppercase text-[10px]">
                  Minutos Jugados
                </label>
                <input
                  type="number"
                  min="0"
                  value={minutosJugados}
                  onChange={(e) =>
                    setMinutosJugados(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  placeholder="0"
                  className={`w-full px-2.5 py-1.5 rounded border text-xs text-center font-bold ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-700 text-white'
                      : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              <div className="sm:col-span-4 space-y-1">
                <label className="text-neutral-400 block font-bold uppercase text-[10px]">
                  Partidos Jugados
                </label>
                <input
                  type="number"
                  min="0"
                  value={partidosJugados}
                  onChange={(e) =>
                    setPartidosJugados(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  placeholder="0"
                  className={`w-full px-2.5 py-1.5 rounded border text-xs text-center font-bold ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-700 text-white'
                      : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              <div className="sm:col-span-4 space-y-1">
                <label className="text-neutral-400 block font-bold uppercase text-[10px]">
                  Partidos Titular
                </label>
                <input
                  type="number"
                  min="0"
                  value={partidosTitular}
                  onChange={(e) =>
                    setPartidosTitular(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  placeholder="0"
                  className={`w-full px-2.5 py-1.5 rounded border text-xs text-center font-bold ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-700 text-white'
                      : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              {/* Teléfono */}
              <div className="sm:col-span-6 space-y-1">
                <label className="text-neutral-400 block font-bold uppercase text-[10px]">
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+34 600 000 000"
                  className={`w-full px-2.5 py-1.5 rounded border text-xs ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-700 text-white'
                      : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              {/* Correo */}
              <div className="sm:col-span-6 space-y-1">
                <label className="text-neutral-400 block font-bold uppercase text-[10px]">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jugador@sdgernika.com"
                  className={`w-full px-2.5 py-1.5 rounded border text-xs ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-700 text-white'
                      : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>
            </div>

            {/* Sliders de Valoración: Técnica, Táctica, Condicional */}
            <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950/40 space-y-3 font-mono text-xs">
              <span className="font-bold uppercase text-[11px] text-neutral-300 block">
                Valoración del Futbolista (1 al 5)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">Técnica:</span>
                    <strong className="text-emerald-400">{tecnica} / 5</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={tecnica}
                    onChange={(e) => setTecnica(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">Táctica:</span>
                    <strong className="text-rose-400">{tactica} / 5</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={tactica}
                    onChange={(e) => setTactica(parseFloat(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">Condicional:</span>
                    <strong className="text-amber-400">{condicional} / 5</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={condicional}
                    onChange={(e) => setCondicional(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Pentágonos interactivos en modo edición */}
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-neutral-400 uppercase">
                Ajuste Fino de Habilidades Táctico-Técnicas:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <PentagonoHabilidades
                  tipo="con_balon"
                  titulo="CON BALÓN (Técnica)"
                  items={itemsConBalon}
                  onChange={(newItems) => setItemsConBalon(newItems)}
                  readOnly={false}
                />
                <PentagonoHabilidades
                  tipo="sin_balon"
                  titulo="SIN BALÓN (Táctica)"
                  items={itemsSinBalon}
                  onChange={(newItems) => setItemsSinBalon(newItems)}
                  readOnly={false}
                />
              </div>
            </div>

            {/* BOTONES INFERIORES EN MODO EDICIÓN */}
            <div className="flex items-center gap-2 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black font-mono text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>{saveStatus === 'saving' ? 'Guardando...' : 'Guardar Cambios'}</span>
              </button>

              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2.5 border border-neutral-700 hover:border-neutral-500 text-neutral-300 font-mono text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="px-3.5 py-2.5 border border-red-900/50 text-red-400 hover:bg-red-950/40 rounded-lg font-mono text-xs transition-colors cursor-pointer"
                title="Eliminar futbolista"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* VISTA 2: MODO LECTURA ELEGANTE DE LA FICHA TÉCNICA */
          /* ========================================================================= */
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Circular Player Photo */}
            <div className="flex justify-center mb-1">
              <div className="relative">
                <img
                  id="f-foto"
                  src={
                    player.foto_url ||
                    player.fotoUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
                  }
                  alt={player.nombre}
                  className={`w-24 h-24 rounded-full object-cover border-2 block shadow-md ${
                    theme === 'dark' ? 'border-white bg-black' : 'border-black bg-neutral-100'
                  }`}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://via.placeholder.com/100?text=SDG';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow cursor-pointer"
                  title="Cambiar foto o editar"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Player Name and Dorsal */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span
                  className={`px-2.5 py-0.5 rounded font-black font-mono text-sm border ${
                    theme === 'dark'
                      ? 'bg-black text-white border-neutral-700'
                      : 'bg-neutral-100 text-black border-neutral-300'
                  }`}
                >
                  #{player.dorsal}
                </span>
                <h2
                  id="f-nombre"
                  className={`text-xl font-black uppercase tracking-tight ${
                    theme === 'dark' ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {player.nombre}
                </h2>
              </div>

              {/* Posiciones: Principal (Rojo Fuerte) y Alternativa (Rojo Suave) */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2.5">
                {/* Posición Principal */}
                <div
                  id="f-posicion-principal"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-600 text-white font-mono text-xs font-bold uppercase shadow-sm border border-red-500"
                  title="Posición Principal en el Campo (Rojo Fuerte)"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>{player.posicion || 'Futbolista'}</span>
                  {player.posicionTactico && (
                    <span className="bg-black/35 px-1.5 py-0.2 rounded text-[10px] font-black">
                      {player.posicionTactico}
                    </span>
                  )}
                  {player.posicionEuskera && (
                    <span className="text-[10px] opacity-85 font-normal italic lowercase">
                      ({player.posicionEuskera})
                    </span>
                  )}
                </div>

                {/* Posición Alternativa (Rojo Suave) */}
                {player.posicionAlternativa ? (
                  <div
                    id="f-posicion-alternativa"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-400 text-black font-mono text-xs font-black uppercase shadow-sm border border-rose-300"
                    title="Posición Alternativa / Polivalencia (Rojo Suave)"
                  >
                    <span className="w-2 h-2 rounded-full bg-black/60" />
                    <span>Alt: {player.posicionAlternativa}</span>
                    {player.posicionAlternativaEuskera && (
                      <span className="text-[10px] font-bold opacity-80 lowercase">
                        ({player.posicionAlternativaEuskera})
                      </span>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-dashed border-neutral-600 hover:border-rose-400 text-neutral-400 hover:text-rose-300 font-mono text-[10px] transition-colors cursor-pointer"
                    title="Asignar posición secundaria"
                  >
                    <span>+ Asignar Alternativa</span>
                  </button>
                )}

                {/* Botón rápido para Modificar Posiciones */}
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-mono text-xs font-bold border border-amber-500/40 transition-colors cursor-pointer shadow-xs"
                  title="Modificar posiciones exactas de este jugador en el campo de fútbol"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Editar Posición</span>
                </button>
              </div>

              {/* Fecha de Nacimiento y Lateralidad */}
              <div
                className={`text-xs font-mono text-center mb-3.5 flex items-center justify-center gap-1.5 ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 opacity-70" />
                <span>
                  {currentStats.fechaNacimiento} ({currentStats.edad} años) • Lateralidad:{' '}
                  <strong>{player.lateralidad || 'Diestro'}</strong>
                </span>
              </div>
            </div>

            {/* Minutos jugados, Partidos jugados y Titular */}
            <div
              className={`grid grid-cols-3 gap-1.5 py-2.5 px-3 rounded-lg border font-mono text-center transition-colors ${
                theme === 'dark'
                  ? 'bg-black/60 border-neutral-800'
                  : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <div>
                <span className="text-[9px] text-neutral-400 uppercase font-semibold block mb-0.5 tracking-wider">
                  Minutos
                </span>
                <span
                  className={`text-sm font-black ${
                    theme === 'dark' ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {currentStats.minutos}’
                </span>
              </div>
              <div
                className={`border-x ${
                  theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
                }`}
              >
                <span className="text-[9px] text-neutral-400 uppercase font-semibold block mb-0.5 tracking-wider">
                  Partidos
                </span>
                <span
                  className={`text-sm font-black ${
                    theme === 'dark' ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {currentStats.partidosJugados}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-neutral-400 uppercase font-semibold block mb-0.5 tracking-wider">
                  Titular
                </span>
                <span
                  className={`text-sm font-black ${
                    theme === 'dark' ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {currentStats.partidosTitular}
                </span>
              </div>
            </div>

            {/* Contact Info (Teléfono & Correo) */}
            <div
              className={`p-3 rounded-lg space-y-2 font-mono text-xs border transition-colors ${
                theme === 'dark'
                  ? 'bg-black border-neutral-800 text-neutral-300'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex items-center gap-1.5 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
                >
                  <Phone
                    className={`w-3.5 h-3.5 shrink-0 ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}
                  />
                  <span>Teléfono:</span>
                </span>
                {player.telefono ? (
                  <a
                    href={`tel:${player.telefono}`}
                    className={`font-bold hover:underline ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}
                  >
                    {player.telefono}
                  </a>
                ) : (
                  <span
                    className={`italic ${
                      theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                    }`}
                  >
                    No asignado
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`flex items-center gap-1.5 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
                >
                  <Mail
                    className={`w-3.5 h-3.5 shrink-0 ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}
                  />
                  <span>Correo:</span>
                </span>
                {player.email || player.correo ? (
                  <a
                    href={`mailto:${player.email || player.correo}`}
                    className={`truncate max-w-[200px] font-bold hover:underline ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}
                    title={player.email || player.correo}
                  >
                    {player.email || player.correo}
                  </a>
                ) : (
                  <span
                    className={`italic ${
                      theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                    }`}
                  >
                    No asignado
                  </span>
                )}
              </div>
            </div>

            {/* Tab Switcher: Pentágonos vs Barras */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                Evaluación Táctico-Técnica
              </span>
              <div className="flex items-center gap-1 font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => setActiveTab('pentagonos')}
                  className={`px-2 py-1 rounded flex items-center gap-1 border transition-colors cursor-pointer ${
                    activeTab === 'pentagonos'
                      ? theme === 'dark'
                        ? 'bg-white text-black border-white font-black'
                        : 'bg-black text-white border-black font-black'
                      : theme === 'dark'
                      ? 'bg-black/50 text-neutral-400 border-neutral-700 hover:text-white'
                      : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:text-black'
                  }`}
                >
                  <Compass className="w-3 h-3" />
                  <span>Pentágonos</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('barras')}
                  className={`px-2 py-1 rounded flex items-center gap-1 border transition-colors cursor-pointer ${
                    activeTab === 'barras'
                      ? theme === 'dark'
                        ? 'bg-white text-black border-white font-black'
                        : 'bg-black text-white border-black font-black'
                      : theme === 'dark'
                      ? 'bg-black/50 text-neutral-400 border-neutral-700 hover:text-white'
                      : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:text-black'
                  }`}
                >
                  <BarChart2 className="w-3 h-3" />
                  <span>Barras</span>
                </button>
              </div>
            </div>

            {/* Contenido Pentágonos vs Barras */}
            {activeTab === 'pentagonos' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <PentagonoHabilidades
                    tipo="con_balon"
                    titulo="CON BALÓN (Técnica)"
                    items={itemsConBalon}
                    onChange={() => {}}
                    readOnly={true}
                  />
                  <PentagonoHabilidades
                    tipo="sin_balon"
                    titulo="SIN BALÓN (Táctica)"
                    items={itemsSinBalon}
                    onChange={() => {}}
                    readOnly={true}
                  />
                </div>

                {/* Condicional Pill */}
                <div
                  className={`p-2.5 rounded-lg border font-mono text-xs flex items-center justify-between ${
                    theme === 'dark'
                      ? 'bg-[#141414] border-neutral-800 text-neutral-300'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                  }`}
                >
                  <span className="font-bold flex items-center gap-1.5 uppercase">
                    <span>⚡</span>
                    <span>Condicional / Físico:</span>
                  </span>
                  <span className="font-black text-amber-500">
                    {condicional} / 5 ({condicional * 20}%)
                  </span>
                </div>
              </div>
            ) : (
              /* Performance Stats Bars */
              <div className="space-y-3.5 font-mono text-xs">
                <div>
                  <div
                    className={`flex justify-between mb-1 ${
                      theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                    }`}
                  >
                    <label className="font-bold uppercase">Técnica</label>
                    <span>
                      {tecnica} / 5 ({tecnica * 20}%)
                    </span>
                  </div>
                  <div
                    className={`h-2.5 w-full rounded-full overflow-hidden ${
                      theme === 'dark' ? 'bg-[#333333]' : 'bg-neutral-200'
                    }`}
                  >
                    <div
                      id="bar-tecnica"
                      className={`h-full rounded-full transition-all duration-300 ${
                        theme === 'dark' ? 'bg-emerald-400' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${tecnica * 20}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div
                    className={`flex justify-between mb-1 ${
                      theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                    }`}
                  >
                    <label className="font-bold uppercase">Táctica</label>
                    <span>
                      {tactica} / 5 ({tactica * 20}%)
                    </span>
                  </div>
                  <div
                    className={`h-2.5 w-full rounded-full overflow-hidden ${
                      theme === 'dark' ? 'bg-[#333333]' : 'bg-neutral-200'
                    }`}
                  >
                    <div
                      id="bar-tactica"
                      className={`h-full rounded-full transition-all duration-300 ${
                        theme === 'dark' ? 'bg-rose-400' : 'bg-rose-600'
                      }`}
                      style={{ width: `${tactica * 20}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div
                    className={`flex justify-between mb-1 ${
                      theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                    }`}
                  >
                    <label className="font-bold uppercase">Condicional</label>
                    <span>
                      {condicional} / 5 ({condicional * 20}%)
                    </span>
                  </div>
                  <div
                    className={`h-2.5 w-full rounded-full overflow-hidden ${
                      theme === 'dark' ? 'bg-[#333333]' : 'bg-neutral-200'
                    }`}
                  >
                    <div
                      id="bar-condicional"
                      className={`h-full rounded-full transition-all duration-300 ${
                        theme === 'dark' ? 'bg-amber-400' : 'bg-amber-600'
                      }`}
                      style={{ width: `${condicional * 20}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* BOTONES INFERIORES: EDITAR, GUARDAR, BORRAR Y CERRAR */}
            <div className="pt-4 border-t border-neutral-800 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className={`py-2 px-3 font-mono text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-1.5 border rounded-lg cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-700 hover:border-white text-white hover:bg-neutral-800'
                      : 'bg-neutral-100 border-neutral-300 hover:border-black text-black hover:bg-neutral-200'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar Ficha</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className={`py-2 px-3 font-mono text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-1.5 border rounded-lg cursor-pointer ${
                    saveStatus === 'success'
                      ? 'bg-emerald-500 text-black border-emerald-400'
                      : theme === 'dark'
                      ? 'bg-neutral-900 border-emerald-600/70 text-emerald-400 hover:bg-emerald-950/60'
                      : 'bg-emerald-50 border-emerald-600 text-emerald-900 hover:bg-emerald-100'
                  }`}
                >
                  {saveStatus === 'success' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Guardado!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardar</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="py-2 px-3 font-mono text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-1.5 border rounded-lg border-red-900/50 text-red-400 hover:bg-red-950/40 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Borrar</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className={`w-full py-2.5 font-black uppercase tracking-wider font-mono text-xs border rounded-lg transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-white text-black border-white hover:bg-black hover:text-white'
                    : 'bg-black text-white border-black hover:bg-white hover:text-black shadow-md'
                }`}
              >
                CERRAR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
