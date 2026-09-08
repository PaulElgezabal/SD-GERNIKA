import React, { useState, useEffect, useRef } from 'react';
import { Player } from '../types';
import { useTheme } from '../context/ThemeContext';
import { X, Upload, Check, AlertCircle } from 'lucide-react';

interface PlayerEditorModalProps {
  player: Player | null; // null means "Nuevo Jugador"
  isOpen: boolean;
  onClose: () => void;
  onSave: (playerData: Partial<Player>) => Promise<void>;
}

export const PlayerEditorModal: React.FC<PlayerEditorModalProps> = ({
  player,
  isOpen,
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
  const [esTitular, setEsTitular] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (player) {
      setNombre(player.nombre || '');
      setDorsal(player.dorsal ?? '');
      setNacimiento(player.nacimiento ?? 1998);
      setLateralidad((player.lateralidad as 'Diestro' | 'Zurdo') || 'Diestro');
      setPosicion(player.posicion || 'Futbolista');
      setEsTitular(Boolean(player.esTitular));
      setTelefono(player.telefono || '');
      setEmail(player.email || player.correo || '');
      setFotoUrl(player.foto_url || player.fotoUrl || '');
      setTecnica(player.tecnica ?? 3);
      setTactica(player.tactica ?? 3);
      setCondicional(player.condicional ?? 3);
      setPosicionX(player.posicion_x ?? 50);
      setPosicionY(player.posicion_y ?? 50);
    } else {
      setNombre('');
      setDorsal('');
      setNacimiento(2000);
      setLateralidad('Diestro');
      setPosicion('Futbolista');
      setEsTitular(false);
      setTelefono('');
      setEmail('');
      setFotoUrl('');
      setTecnica(3);
      setTactica(3);
      setCondicional(3);
      setPosicionX(50);
      setPosicionY(50);
    }
    setErrorMsg(null);
  }, [player, isOpen]);

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
      await onSave({
        ...(player?.id ? { id: player.id } : {}),
        nombre: nombre.trim(),
        dorsal: Number(dorsal),
        nacimiento: Number(nacimiento) || 2000,
        lateralidad,
        posicion: posicion.trim(),
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
        className={`border-2 w-full max-w-md p-6 max-h-[90vh] overflow-y-auto shadow-2xl relative transition-colors ${
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

          <div className="grid grid-cols-2 gap-3">
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
                Año Nacimiento
              </label>
              <input
                id="edit-nacimiento"
                type="number"
                min="1970"
                max="2030"
                value={nacimiento}
                onChange={(e) => setNacimiento(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ej: 1995"
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

          <hr className={theme === 'dark' ? 'border-neutral-800 my-3' : 'border-neutral-200 my-3'} />

          {/* Calificaciones */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label
                  className={`block font-bold mb-1 uppercase ${
                    theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                  }`}
                >
                  Técnica (1-5)
                </label>
                <input
                  id="edit-tecnica"
                  type="number"
                  min="1"
                  max="5"
                  value={tecnica}
                  onChange={(e) => setTecnica(Math.min(5, Math.max(1, Number(e.target.value))))}
                  className={`w-full px-2 py-2 text-sm text-center transition-colors focus:outline-none ${
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
                  Táctica (1-5)
                </label>
                <input
                  id="edit-tactica"
                  type="number"
                  min="1"
                  max="5"
                  value={tactica}
                  onChange={(e) => setTactica(Math.min(5, Math.max(1, Number(e.target.value))))}
                  className={`w-full px-2 py-2 text-sm text-center transition-colors focus:outline-none ${
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
                  Condicional (1-5)
                </label>
                <input
                  id="edit-condicional"
                  type="number"
                  min="1"
                  max="5"
                  value={condicional}
                  onChange={(e) => setCondicional(Math.min(5, Math.max(1, Number(e.target.value))))}
                  className={`w-full px-2 py-2 text-sm text-center transition-colors focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-black text-white border border-neutral-700 focus:border-white'
                      : 'bg-neutral-50 text-neutral-900 border border-neutral-300 focus:border-black'
                  }`}
                />
              </div>
            </div>
          </div>

          <hr className={theme === 'dark' ? 'border-neutral-800 my-3' : 'border-neutral-200 my-3'} />

          {/* Posición en el campo (0-100) */}
          <div>
            <p
              className={`mb-1 text-[11px] ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              Posición en campo (0 - 100%)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className={`block font-bold mb-1 uppercase ${
                    theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                  }`}
                >
                  X (Horizontal %)
                </label>
                <input
                  id="edit-x"
                  type="number"
                  min="0"
                  max="100"
                  value={posicionX}
                  onChange={(e) => setPosicionX(Number(e.target.value))}
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
                  Y (Vertical %)
                </label>
                <input
                  id="edit-y"
                  type="number"
                  min="0"
                  max="100"
                  value={posicionY}
                  onChange={(e) => setPosicionY(Number(e.target.value))}
                  className={`w-full px-3 py-2 text-sm transition-colors focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-black text-white border border-neutral-700 focus:border-white'
                      : 'bg-neutral-50 text-neutral-900 border border-neutral-300 focus:border-black'
                  }`}
                />
              </div>
            </div>
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
