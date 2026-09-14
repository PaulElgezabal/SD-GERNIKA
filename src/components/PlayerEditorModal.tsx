import React, { useState, useEffect, useRef } from 'react';
import { Player, HabilidadesConBalon, HabilidadesSinBalon } from '../types';
import { useTheme } from '../context/ThemeContext';
import { X, Upload, Check, AlertCircle } from 'lucide-react';
import { PentagonoHabilidades, PentagonoItem } from './PentagonoHabilidades';
import { CampoSelectorPosiciones } from './CampoSelectorPosiciones';
import { getTacticalPositionByCode } from '../data/tacticalPositions';

interface PlayerEditorModalProps {
  player: Player | null; // null means "Nuevo Jugador"
  isOpen?: boolean;
  onClose: () => void;
  onSave: (playerData: Partial<Player>) => Promise<void> | void;
}

const defaultItemsConBalon = (p?: Player | null, baseVal: number = 3): PentagonoItem[] => {
  const cb = p?.habilidadesConBalon;
  return [
    { key: 'control', label: 'Control de balón', sublabel: 'Primer toque', value: cb?.control ?? baseVal },
    { key: 'regate', label: 'Regate', sublabel: '1v1 / Desborde', value: cb?.regate ?? baseVal },
    { key: 'disparo', label: 'Disparo', sublabel: 'Finalización', value: cb?.disparo ?? baseVal },
    { key: 'conduccion', label: 'Conducción', sublabel: 'Progresión', value: cb?.conduccion ?? baseVal },
    { key: 'pase', label: 'Pase', sublabel: 'Precisión', value: cb?.pase ?? baseVal },
  ];
};

const defaultItemsSinBalon = (p?: Player | null, baseVal: number = 3): PentagonoItem[] => {
  const sb = p?.habilidadesSinBalon;
  return [
    { key: 'presion', label: 'Presión', sublabel: 'Acoso tras pérdida', value: sb?.presion ?? baseVal },
    { key: 'desmarque', label: 'Desmarque', sublabel: 'Apoyos y movilidad', value: sb?.desmarque ?? baseVal },
    { key: 'colocacion', label: 'Posicionamiento', sublabel: 'Sentido táctico', value: sb?.colocacion ?? baseVal },
    { key: 'anticipacion', label: 'Anticipación', sublabel: 'Lectura e intercepción', value: sb?.anticipacion ?? baseVal },
    { key: 'sacrificio', label: 'Sacrificio', sublabel: 'Repliegue defensivo', value: sb?.sacrificio ?? baseVal },
  ];
};

export const PlayerEditorModal: React.FC<PlayerEditorModalProps> = ({
  player,
  isOpen = true,
  onClose,
  onSave,
}) => {
  const { theme } = useTheme();
  if (!isOpen) return null;

  const [nombre, setNombre] = useState('');
  const [dorsal, setDorsal] = useState<number | ''>('');
  const [nacimiento, setNacimiento] = useState<number | ''>(1998);
  const [lateralidad, setLateralidad] = useState<'Diestro' | 'Zurdo'>('Diestro');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [tecnica, setTecnica] = useState<number>(3);
  const [tactica, setTactica] = useState<number>(3);
  const [condicional, setCondicional] = useState<number>(3);
  const [posicionX, setPosicionX] = useState<number>(50);
  const [posicionY, setPosicionY] = useState<number>(50);
  const [posicion, setPosicion] = useState('Futbolista');
  const [posicionTactico, setPosicionTactico] = useState<string>('MC_DCH');
  const [posicionEuskera, setPosicionEuskera] = useState<string>('');
  const [posicionAlternativa, setPosicionAlternativa] = useState<string>('');
  const [posicionAlternativaEuskera, setPosicionAlternativaEuskera] = useState<string>('');
  const [posicionAltX, setPosicionAltX] = useState<number | undefined>(undefined);
  const [posicionAltY, setPosicionAltY] = useState<number | undefined>(undefined);
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [minutosJugados, setMinutosJugados] = useState<number | ''>('');
  const [partidosJugados, setPartidosJugados] = useState<number | ''>('');
  const [partidosTitular, setPartidosTitular] = useState<number | ''>('');
  const [esTitular, setEsTitular] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [itemsConBalon, setItemsConBalon] = useState<PentagonoItem[]>(() =>
    defaultItemsConBalon(player, player?.tecnica ?? 3)
  );
  const [itemsSinBalon, setItemsSinBalon] = useState<PentagonoItem[]>(() =>
    defaultItemsSinBalon(player, player?.tactica ?? 3)
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (player) {
      setNombre(player.nombre || '');
      setDorsal(player.dorsal ?? '');
      setNacimiento(player.nacimiento ?? 2008);
      setFechaNacimiento(player.fechaNacimiento || '');
      setMinutosJugados(player.minutosJugados ?? '');
      setPartidosJugados(player.partidosJugados ?? '');
      setPartidosTitular(player.partidosTitular ?? '');
      setLateralidad((player.lateralidad as 'Diestro' | 'Zurdo') || 'Diestro');
      setPosicion(player.posicion || 'Futbolista');
      setPosicionTactico(player.posicionTactico || 'MC_DCH');
      setPosicionEuskera(player.posicionEuskera || '');
      setPosicionAlternativa(player.posicionAlternativa || '');
      setPosicionAlternativaEuskera(player.posicionAlternativaEuskera || '');
      setEsTitular(Boolean(player.esTitular));
      setTelefono(player.telefono || '');
      setEmail(player.email || player.correo || '');
      setFotoUrl(player.foto_url || player.fotoUrl || '');
      setTecnica(player.tecnica ?? 3);
      setTactica(player.tactica ?? 3);
      setCondicional(player.condicional ?? 3);
      setPosicionX(player.posicion_x ?? 50);
      setPosicionY(player.posicion_y ?? 50);
      setPosicionAltX(player.posicion_alt_x);
      setPosicionAltY(player.posicion_alt_y);
      setItemsConBalon(defaultItemsConBalon(player, player.tecnica ?? 3));
      setItemsSinBalon(defaultItemsSinBalon(player, player.tactica ?? 3));
    } else {
      setNombre('');
      setDorsal('');
      setNacimiento(2008);
      setFechaNacimiento('');
      setMinutosJugados('');
      setPartidosJugados('');
      setPartidosTitular('');
      setLateralidad('Diestro');
      setPosicion('Futbolista');
      setPosicionTactico('MC_DCH');
      setPosicionEuskera('');
      setPosicionAlternativa('');
      setPosicionAlternativaEuskera('');
      setEsTitular(false);
      setTelefono('');
      setEmail('');
      setFotoUrl('');
      setTecnica(3);
      setTactica(3);
      setCondicional(3);
      setPosicionX(50);
      setPosicionY(50);
      setPosicionAltX(undefined);
      setPosicionAltY(undefined);
      setItemsConBalon(defaultItemsConBalon(null, 3));
      setItemsSinBalon(defaultItemsSinBalon(null, 3));
    }
    setErrorMsg(null);
  }, [player, isOpen]);

  const handleConBalonChange = (newItems: PentagonoItem[]) => {
    setItemsConBalon(newItems);
    const avg = newItems.reduce((acc, it) => acc + it.value, 0) / (newItems.length || 1);
    setTecnica(Math.round(avg * 10) / 10);
  };

  const handleSinBalonChange = (newItems: PentagonoItem[]) => {
    setItemsSinBalon(newItems);
    const avg = newItems.reduce((acc, it) => acc + it.value, 0) / (newItems.length || 1);
    setTactica(Math.round(avg * 10) / 10);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFotoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorMsg('El nombre es obligatorio');
      return;
    }
    if (dorsal === '' || isNaN(Number(dorsal))) {
      setErrorMsg('El dorsal es obligatorio y debe ser un número');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      const habConBalon: HabilidadesConBalon = {
        control: itemsConBalon.find((i) => i.key === 'control')?.value ?? 3,
        regate: itemsConBalon.find((i) => i.key === 'regate')?.value ?? 3,
        disparo: itemsConBalon.find((i) => i.key === 'disparo')?.value ?? 3,
        conduccion: itemsConBalon.find((i) => i.key === 'conduccion')?.value ?? 3,
        pase: itemsConBalon.find((i) => i.key === 'pase')?.value ?? 3,
      };

      const habSinBalon: HabilidadesSinBalon = {
        presion: itemsSinBalon.find((i) => i.key === 'presion')?.value ?? 3,
        desmarque: itemsSinBalon.find((i) => i.key === 'desmarque')?.value ?? 3,
        colocacion: itemsSinBalon.find((i) => i.key === 'colocacion')?.value ?? 3,
        anticipacion: itemsSinBalon.find((i) => i.key === 'anticipacion')?.value ?? 3,
        sacrificio: itemsSinBalon.find((i) => i.key === 'sacrificio')?.value ?? 3,
      };

      await onSave({
        ...(player?.id ? { id: player.id } : {}),
        nombre: nombre.trim(),
        dorsal: Number(dorsal),
        nacimiento: Number(nacimiento) || 2008,
        fechaNacimiento: fechaNacimiento.trim() || undefined,
        minutosJugados: minutosJugados === '' ? undefined : Number(minutosJugados),
        partidosJugados: partidosJugados === '' ? undefined : Number(partidosJugados),
        partidosTitular: partidosTitular === '' ? undefined : Number(partidosTitular),
        lateralidad,
        posicion: posicion.trim(),
        posicionTactico,
        posicionEuskera,
        posicionAlternativa: posicionAlternativa || undefined,
        posicionAlternativaEuskera: posicionAlternativaEuskera || undefined,
        esTitular,
        telefono: telefono.trim(),
        email: email.trim(),
        correo: email.trim(),
        foto_url: fotoUrl.trim(),
        fotoUrl: fotoUrl.trim(),
        tecnica: Number(tecnica) || 0,
        tactica: Number(tactica) || 0,
        condicional: Number(condicional) || 0,
        posicion_x: Number(posicionX) || 50,
        posicion_y: Number(posicionY) || 50,
        posicion_alt_x: posicionAltX,
        posicion_alt_y: posicionAltY,
        habilidadesConBalon: habConBalon,
        habilidadesSinBalon: habSinBalon,
      });
      onClose();
    } catch (err: any) {
      console.error('Error guardando jugador:', err);
      setErrorMsg(err.message || 'Error al guardar en base de datos');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      id="overlay-editor"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div
        id="modal-editor"
        className={`border-2 w-full max-w-4xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto shadow-2xl relative transition-colors ${
          theme === 'dark'
            ? 'bg-[#111111] border-white text-white'
            : 'bg-white border-black text-neutral-900 shadow-neutral-500/30'
        }`}
        role="dialog"
      >
        <div
          className={`flex items-center justify-between pb-3 border-b mb-4 transition-colors ${
            theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
          }`}
        >
          <h2
            id="editor-titulo"
            className={`text-lg font-black uppercase tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}
          >
            {player ? 'Editar Jugador' : 'Nuevo Jugador'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={`transition-colors ${
              theme === 'dark'
                ? 'text-neutral-400 hover:text-white'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 mb-4 bg-red-950/80 border border-red-500 text-red-200 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
          <div>
            <label
              className={`block font-bold mb-1 uppercase ${
                theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
              }`}
            >
              Nombre y Apellido
            </label>
            <input
              id="edit-nombre"
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Mikel Arzalluz"
              className={`w-full px-3 py-2 text-sm transition-colors focus:outline-none ${
                theme === 'dark'
                  ? 'bg-black text-white border border-neutral-700 focus:border-white'
                  : 'bg-neutral-50 text-neutral-900 border border-neutral-300 focus:border-black'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label
                className={`block font-bold mb-1 uppercase ${
                  theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                }`}
              >
                Dorsal
              </label>
              <input
                id="edit-dorsal"
                type="number"
                required
                min="1"
                max="99"
                value={dorsal}
                onChange={(e) => setDorsal(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ej: 7"
                className={`w-full px-3 py-2 text-sm transition-colors focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-black text-white border border-neutral-700 focus:border-white'
                    : 'bg-neutral-50 text-neutral-900 border border-neutral-300 focus:border-black'
                }`}
              />
            </div>

            <div>
              <label
                className={`block font-bold mb-1 uppercase ${
                  theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                }`}
              >
                Año Nac.
              </label>
              <input
                id="edit-nacimiento"
                type="number"
                min="1970"
                max="2030"
                value={nacimiento}
                onChange={(e) => setNacimiento(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ej: 2008"
                className={`w-full px-3 py-2 text-sm transition-colors focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-black text-white border border-neutral-700 focus:border-white'
                    : 'bg-neutral-50 text-neutral-900 border border-neutral-300 focus:border-black'
                }`}
              />
            </div>

            <div>
              <label
                className={`block font-bold mb-1 uppercase ${
                  theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                }`}
              >
                Fecha Nacimiento
              </label>
              <input
                id="edit-fechanacimiento"
                type="text"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                placeholder="DD/MM/AAAA"
                className={`w-full px-3 py-2 text-sm transition-colors focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-black text-white border border-neutral-700 focus:border-white'
                    : 'bg-neutral-50 text-neutral-900 border border-neutral-300 focus:border-black'
                }`}
              />
            </div>
          </div>

          {/* Estadísticas de Competición */}
          <div
            className={`p-3 border rounded transition-colors ${
              theme === 'dark'
                ? 'bg-neutral-950 border-neutral-800'
                : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <span
              className={`block font-bold text-xs uppercase tracking-wider mb-2 ${
                theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
              }`}
            >
              Estadísticas en Competición
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-neutral-400 uppercase font-mono mb-1">
                  Minutos
                </label>
                <input
                  id="edit-minutos"
                  type="number"
                  min="0"
                  value={minutosJugados}
                  onChange={(e) =>
                    setMinutosJugados(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  placeholder="Ej: 360"
                  className={`w-full px-2.5 py-1.5 text-xs font-mono transition-colors focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-black text-white border border-neutral-700 focus:border-white'
                      : 'bg-white text-neutral-900 border border-neutral-300 focus:border-black'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[10px] text-neutral-400 uppercase font-mono mb-1">
                  Partidos (PJ)
                </label>
                <input
                  id="edit-partidos"
                  type="number"
                  min="0"
                  value={partidosJugados}
                  onChange={(e) =>
                    setPartidosJugados(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  placeholder="Ej: 4"
                  className={`w-full px-2.5 py-1.5 text-xs font-mono transition-colors focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-black text-white border border-neutral-700 focus:border-white'
                      : 'bg-white text-neutral-900 border border-neutral-300 focus:border-black'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[10px] text-neutral-400 uppercase font-mono mb-1">
                  Titularidades
                </label>
                <input
                  id="edit-titularidades"
                  type="number"
                  min="0"
                  value={partidosTitular}
                  onChange={(e) =>
                    setPartidosTitular(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  placeholder="Ej: 4"
                  className={`w-full px-2.5 py-1.5 text-xs font-mono transition-colors focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-black text-white border border-neutral-700 focus:border-white'
                      : 'bg-white text-neutral-900 border border-neutral-300 focus:border-black'
                  }`}
                />
              </div>
            </div>
          </div>

          <div>
            <label
              className={`block font-bold mb-1 uppercase ${
                theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
              }`}
            >
              Lateralidad
            </label>
            <select
              id="edit-lateralidad"
              value={lateralidad}
              onChange={(e) => setLateralidad(e.target.value as 'Diestro' | 'Zurdo')}
              className={`w-full px-3 py-2 text-sm transition-colors focus:outline-none ${
                theme === 'dark'
                  ? 'bg-black text-white border border-neutral-700 focus:border-white'
                  : 'bg-neutral-50 text-neutral-900 border border-neutral-300 focus:border-black'
              }`}
            >
              <option value="Diestro">Diestro</option>
              <option value="Zurdo">Zurdo</option>
            </select>
          </div>

          <div>
            <label
              className={`block font-bold mb-1 uppercase ${
                theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
              }`}
            >
              Posición Táctica
            </label>
            <input
              id="edit-posicion"
              type="text"
              value={posicion}
              onChange={(e) => setPosicion(e.target.value)}
              placeholder="Ej: Extremo Izquierdo, Lateral Derecho..."
              className={`w-full px-3 py-2 text-sm transition-colors focus:outline-none ${
                theme === 'dark'
                  ? 'bg-black text-white border border-neutral-700 focus:border-white'
                  : 'bg-neutral-50 text-neutral-900 border border-neutral-300 focus:border-black'
              }`}
            />
          </div>

          <div
            className={`p-3 border rounded transition-colors ${
              theme === 'dark'
                ? 'bg-neutral-900 border-neutral-800'
                : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                id="edit-estitular"
                type="checkbox"
                checked={esTitular}
                onChange={(e) => setEsTitular(e.target.checked)}
                className="w-4 h-4 rounded text-black accent-black cursor-pointer"
              />
              <div>
                <span
                  className={`font-bold text-xs uppercase tracking-wider block ${
                    theme === 'dark' ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  Último Once Titular 25-26
                </span>
                <span
                  className={`text-[11px] block ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                  }`}
                >
                  Marca esta casilla si el jugador formó parte del último 11 titular en el terreno de juego.
                </span>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                className={`block font-bold mb-1 uppercase ${
                  theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                }`}
              >
                Teléfono
              </label>
              <input
                id="edit-telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+34 600 00 00 00"
                className={`w-full px-3 py-2 text-sm transition-colors focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-black text-white border border-neutral-700 focus:border-white'
                    : 'bg-neutral-50 text-neutral-900 border border-neutral-300 focus:border-black'
                }`}
              />
            </div>

            <div>
              <label
                className={`block font-bold mb-1 uppercase ${
                  theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                }`}
              >
                Correo Electrónico
              </label>
              <input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jugador@gernikaclub.eus"
                className={`w-full px-3 py-2 text-sm transition-colors focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-black text-white border border-neutral-700 focus:border-white'
                    : 'bg-neutral-50 text-neutral-900 border border-neutral-300 focus:border-black'
                }`}
              />
            </div>
          </div>

          <div>
            <label
              className={`block font-bold mb-1 uppercase ${
                theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
              }`}
            >
              URL Foto
            </label>
            <div className="flex gap-2">
              <input
                id="edit-foto"
                type="text"
                value={fotoUrl}
                onChange={(e) => setFotoUrl(e.target.value)}
                placeholder="https://... o sube una imagen"
                className={`w-full px-3 py-2 text-xs transition-colors focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-black text-white border border-neutral-700 focus:border-white'
                    : 'bg-neutral-50 text-neutral-900 border border-neutral-300 focus:border-black'
                }`}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`px-3 text-[11px] font-bold uppercase shrink-0 flex items-center gap-1 border transition-colors ${
                  theme === 'dark'
                    ? 'bg-neutral-900 border-neutral-700 hover:border-white text-white'
                    : 'bg-neutral-100 border-neutral-300 hover:border-black text-black'
                }`}
                title="Subir archivo local"
              >
                <Upload className="w-3.5 h-3.5" />
                Subir
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
            {fotoUrl && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={fotoUrl}
                  alt="Preview"
                  className={`w-10 h-10 rounded-full border object-cover ${
                    theme === 'dark' ? 'border-white bg-black' : 'border-black bg-neutral-100'
                  }`}
                />
                <span
                  className={`text-[10px] ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                  }`}
                >
                  Previsualización activa
                </span>
              </div>
            )}
          </div>

          <hr className={theme === 'dark' ? 'border-neutral-800 my-4' : 'border-neutral-200 my-4'} />

          {/* EVALUACIÓN TÁCTICA Y TÉCNICA: PENTÁGONOS INTERACTIVOS */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-neutral-800/50">
              <div>
                <h3
                  className={`text-xs sm:text-sm font-black uppercase tracking-wider font-mono flex items-center gap-2 ${
                    theme === 'dark' ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  <span>📊</span>
                  <span>Evaluación de Habilidades Táctico-Técnicas</span>
                </h3>
                <p className="text-[11px] font-mono text-neutral-400">
                  Desliza cada vértice hacia dentro o fuera para puntuar más o menos (1 - 5)
                </p>
              </div>

              {/* Indicadores de nota global */}
              <div className="flex items-center gap-2 font-mono text-xs">
                <div
                  className={`px-2.5 py-1 rounded-lg border font-black flex items-center gap-1.5 ${
                    theme === 'dark'
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  }`}
                  title="Puntuación de Técnica (calculada con el pentágono Con Balón)"
                >
                  <span className="text-[10px] uppercase opacity-75">Técnica:</span>
                  <span className="text-sm font-black">{tecnica}</span>
                </div>

                <div
                  className={`px-2.5 py-1 rounded-lg border font-black flex items-center gap-1.5 ${
                    theme === 'dark'
                      ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                      : 'bg-rose-50 border-rose-300 text-rose-800'
                  }`}
                  title="Puntuación de Táctica (calculada con el pentágono Sin Balón)"
                >
                  <span className="text-[10px] uppercase opacity-75">Táctica:</span>
                  <span className="text-sm font-black">{tactica}</span>
                </div>
              </div>
            </div>

            {/* Los 2 Pentágonos lado a lado en desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Pentágono CON BALÓN */}
              <PentagonoHabilidades
                tipo="con_balon"
                titulo="CON BALÓN (Técnica)"
                items={itemsConBalon}
                onChange={handleConBalonChange}
              />

              {/* 2. Pentágono SIN BALÓN */}
              <PentagonoHabilidades
                tipo="sin_balon"
                titulo="SIN BALÓN (Táctica)"
                items={itemsSinBalon}
                onChange={handleSinBalonChange}
              />
            </div>

            {/* Condicional (Físico) - Slider interactivo */}
            <div
              className={`p-3 rounded-xl border font-mono text-xs transition-colors ${
                theme === 'dark'
                  ? 'bg-[#141414] border-neutral-800'
                  : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <label
                  className={`font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'
                  }`}
                >
                  <span>⚡</span>
                  <span>Condicional / Físico (1 - 5)</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-black text-amber-500 text-sm">{condicional} / 5</span>
                  <span className="text-[10px] text-neutral-400">
                    ({Math.round(condicional * 20)}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="edit-condicional"
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={condicional}
                  onChange={(e) => setCondicional(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-700 rounded-lg cursor-pointer accent-amber-500"
                />
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  value={condicional}
                  onChange={(e) =>
                    setCondicional(Math.min(5, Math.max(1, Number(e.target.value))))
                  }
                  className={`w-16 px-2 py-1 text-center font-bold font-mono text-sm border rounded focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-black border-neutral-700 text-white focus:border-white'
                      : 'bg-white border-neutral-300 text-black focus:border-black'
                  }`}
                />
              </div>
            </div>
          </div>

          <hr className={theme === 'dark' ? 'border-neutral-800 my-3' : 'border-neutral-200 my-3'} />

          {/* ASIGNACIÓN DE POSICIONES EXACTAS DEL CAMPO DE FÚTBOL (NO INVENTADAS NI ALEATORIAS) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                className={`font-black uppercase tracking-wider font-mono text-xs flex items-center gap-1.5 ${
                  theme === 'dark' ? 'text-white' : 'text-neutral-900'
                }`}
              >
                <span>📍</span>
                <span>Demarcaciones Tácticas Exactas (Campo Reglamentario)</span>
              </label>
              <span className="text-[10px] font-mono text-neutral-400">
                Principal: <strong className="text-red-500">Rojo Fuerte</strong> | Alternativa: <strong className="text-rose-400">Rojo Suave</strong>
              </span>
            </div>

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

          <div className="pt-3 space-y-2">
            <button
              type="submit"
              disabled={saving}
              className={`w-full py-3 font-black uppercase tracking-wider font-mono text-sm border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                theme === 'dark'
                  ? 'bg-white text-black border-white hover:bg-black hover:text-white'
                  : 'bg-black text-white border-black hover:bg-white hover:text-black shadow-md'
              }`}
            >
              {saving ? 'GUARDANDO...' : 'GUARDAR'}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className={`w-full py-2.5 font-mono text-xs uppercase tracking-wider transition-colors border ${
                theme === 'dark'
                  ? 'bg-transparent border-neutral-700 hover:border-white text-white'
                  : 'bg-transparent border-neutral-300 hover:border-black text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
