import React, { useState, useRef, useEffect } from 'react';
import { VideoClipMarca } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Plus,
  PenTool,
  Circle,
  ArrowRight,
  Trash2,
  Tag,
  Upload,
  Sparkles,
} from 'lucide-react';

interface EditorVideoViewProps {
  clips: VideoClipMarca[];
  onAddClip: (nuevo: Omit<VideoClipMarca, 'id'>) => void;
}

export const EditorVideoView: React.FC<EditorVideoViewProps> = ({ clips, onAddClip }) => {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(240); // 4 minutes mock or actual
  const [playbackRate, setPlaybackRate] = useState(1);
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [customUrl, setCustomUrl] = useState('');

  // Canvas Telestrator
  const [drawingTool, setDrawingTool] = useState<'none' | 'pen' | 'circle' | 'arrow'>('none');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isDrawing = useRef(false);
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Add Clip Form
  const [showClipModal, setShowClipModal] = useState(false);
  const [clipTitulo, setClipTitulo] = useState('');
  const [clipCategoria, setClipCategoria] = useState<VideoClipMarca['categoria']>('Ataque');
  const [clipDescripcion, setClipDescripcion] = useState('');
  const [clipJugadoresRaw, setClipJugadoresRaw] = useState('');

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (timeSec: number) => {
    const clamped = Math.max(0, Math.min(duration, timeSec));
    setCurrentTime(clamped);
    if (videoRef.current) {
      videoRef.current.currentTime = clamped;
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Canvas drawing handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawingTool === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    startPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    isDrawing.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || drawingTool === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;

    if (drawingTool === 'pen') {
      ctx.beginPath();
      ctx.moveTo(startPos.current.x, startPos.current.y);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
      startPos.current = { x: currentX, y: currentY };
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || drawingTool === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;

    if (drawingTool === 'circle') {
      const radius = Math.hypot(endX - startPos.current.x, endY - startPos.current.y);
      ctx.beginPath();
      ctx.arc(startPos.current.x, startPos.current.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (drawingTool === 'arrow') {
      ctx.beginPath();
      ctx.moveTo(startPos.current.x, startPos.current.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Arrow head
      const angle = Math.atan2(endY - startPos.current.y, endX - startPos.current.x);
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - 12 * Math.cos(angle - Math.PI / 6), endY - 12 * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - 12 * Math.cos(angle + Math.PI / 6), endY - 12 * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
    }

    isDrawing.current = false;
  };

  const handleSaveClip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clipTitulo.trim()) return;

    onAddClip({
      timestamp: Math.floor(currentTime),
      tiempoFormato: formatTime(currentTime),
      titulo: clipTitulo.trim(),
      categoria: clipCategoria,
      descripcion: clipDescripcion.trim(),
      jugadoresInvolucrados: clipJugadoresRaw.split(',').map((s) => s.trim()).filter((s) => s.length > 0),
    });

    setClipTitulo('');
    setClipDescripcion('');
    setClipJugadoresRaw('');
    setShowClipModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div
        className={`p-5 border transition-colors ${
          theme === 'dark' ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight">
              Editor de Vídeo & Telestrator Táctico
            </h1>
            <p className="text-xs font-mono text-neutral-400 mt-0.5 uppercase">
              Corte de jugadas, marcas sobre el fotograma y bitácora de análisis en vídeo
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <label
              className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-700 text-white hover:border-white'
                  : 'bg-neutral-100 border-neutral-300 text-black hover:border-black'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Cargar Vídeo MP4</span>
              <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              type="button"
              onClick={() => setShowClipModal(true)}
              className={`px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-white text-black border-white hover:bg-neutral-200'
                  : 'bg-black text-white border-black hover:bg-neutral-800'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>+ Marcar Corte ({formatTime(currentTime)})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Video & Telestrator Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Columns: Video Screen + Telestrator Overlay + Controls */}
        <div className="lg:col-span-2 space-y-3">
          <div
            className={`border relative overflow-hidden flex items-center justify-center min-h-[340px] ${
              theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-900 border-neutral-400'
            }`}
          >
            {videoSrc ? (
              <video
                ref={videoRef}
                src={videoSrc}
                className="w-full h-full object-contain max-h-[440px]"
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              />
            ) : (
              /* Simulated Match Analysis Stage if no file uploaded */
              <div className="text-center p-8 font-mono text-xs text-neutral-400 space-y-3">
                <Video className="w-12 h-12 mx-auto text-neutral-600 mb-2" />
                <p className="font-bold text-white text-sm uppercase">
                  Mesa de Análisis de Vídeo • SD Gernika
                </p>
                <p className="max-w-md mx-auto text-neutral-400">
                  Puedes cargar cualquier partido en MP4 o utilizar las herramientas del telestrator
                  para señalar espacios, coberturas y líneas de pase en el lienzo táctico.
                </p>
                <div className="text-[11px] text-neutral-500 font-mono">
                  Tiempo actual del análisis: <span className="font-bold text-white">{formatTime(currentTime)}</span>
                </div>
              </div>
            )}

            {/* Telestrator Canvas Overlay */}
            <canvas
              ref={canvasRef}
              width={640}
              height={360}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className={`absolute inset-0 w-full h-full ${
                drawingTool !== 'none' ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'
              }`}
            />
          </div>

          {/* Telestrator Toolbar */}
          <div
            className={`p-3 border flex flex-wrap items-center justify-between gap-3 font-mono text-xs ${
              theme === 'dark' ? 'bg-[#0d0d0d] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
            }`}
          >
            {/* Playback Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleSeek(currentTime - 5)}
                className="p-1.5 border hover:bg-neutral-800 cursor-pointer"
                title="-5 seg"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handlePlayPause}
                className={`px-3 py-1.5 border font-bold uppercase flex items-center gap-1 cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-black'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pausa' : 'Play'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSeek(currentTime + 5)}
                className="p-1.5 border hover:bg-neutral-800 cursor-pointer"
                title="+5 seg"
              >
                <FastForward className="w-3.5 h-3.5" />
              </button>

              <span className="font-bold ml-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Telestrator Drawing Tools */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-neutral-400 uppercase font-bold mr-1">Dibujo:</span>
              {[
                { id: 'none', label: 'Desactivar', icon: null },
                { id: 'pen', label: 'Línea', icon: PenTool },
                { id: 'circle', label: 'Zona/Círculo', icon: Circle },
                { id: 'arrow', label: 'Flecha', icon: ArrowRight },
              ].map((tool) => {
                const Icon = tool.icon;
                const isCurrent = drawingTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => setDrawingTool(tool.id as any)}
                    className={`px-2.5 py-1 border text-[11px] uppercase flex items-center gap-1 cursor-pointer ${
                      isCurrent
                        ? theme === 'dark'
                          ? 'bg-white text-black border-white font-bold'
                          : 'bg-black text-white border-black font-bold'
                        : 'border-neutral-700 hover:border-white'
                    }`}
                  >
                    {Icon && <Icon className="w-3 h-3" />}
                    <span>{tool.label}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={clearCanvas}
                className="p-1.5 border border-neutral-700 hover:border-red-400 hover:text-red-400 cursor-pointer ml-1"
                title="Limpiar dibujos"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Tagged Video Clips List */}
        <div
          className={`p-5 border flex flex-col justify-between ${
            theme === 'dark' ? 'bg-[#0d0d0d] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-3 font-mono">
              <h2 className="text-sm font-black uppercase tracking-tight">
                Cortes y Marcas de Vídeo ({clips.length})
              </h2>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {clips.map((clip) => (
                <div
                  key={clip.id}
                  className={`p-3 border transition-all ${
                    theme === 'dark'
                      ? 'bg-black border-neutral-800 hover:border-white'
                      : 'bg-neutral-50 border-neutral-300 hover:border-black'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span
                      className={`font-bold px-1.5 py-0.2 border uppercase ${
                        theme === 'dark'
                          ? 'bg-neutral-900 border-neutral-700 text-white'
                          : 'bg-neutral-200 border-neutral-400 text-black'
                      }`}
                    >
                      {clip.categoria}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSeek(clip.timestamp)}
                      className="font-bold underline cursor-pointer hover:text-white"
                    >
                      Ir a {clip.tiempoFormato}
                    </button>
                  </div>

                  <h3 className="font-bold text-xs uppercase mb-1">{clip.titulo}</h3>
                  <p className="text-neutral-400 text-[11px] leading-relaxed mb-2">
                    {clip.descripcion}
                  </p>

                  {clip.jugadoresInvolucrados.length > 0 && (
                    <div className="text-[10px] text-neutral-500 flex flex-wrap gap-1">
                      {clip.jugadoresInvolucrados.map((jug, idx) => (
                        <span key={idx} className="border px-1 border-neutral-800">
                          {jug}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Clip Modal */}
      {showClipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className={`w-full max-w-lg border p-6 font-mono text-xs ${
              theme === 'dark' ? 'bg-[#0e0e0e] border-neutral-700 text-white' : 'bg-white border-black text-black shadow-xl'
            }`}
          >
            <h2 className="text-base font-black uppercase tracking-tight mb-4 border-b pb-2">
              Crear Corte de Vídeo en {formatTime(currentTime)}
            </h2>
            <form onSubmit={handleSaveClip} className="space-y-3.5">
              <div>
                <label className="block text-[11px] uppercase font-bold mb-1">Título de la Jugada</label>
                <input
                  type="text"
                  required
                  value={clipTitulo}
                  onChange={(e) => setClipTitulo(e.target.value)}
                  placeholder="Ej: Salida de balón superando presión alta"
                  className={`w-full p-2 border focus:outline-none ${
                    theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold mb-1">Categoría Táctica</label>
                <select
                  value={clipCategoria}
                  onChange={(e) => setClipCategoria(e.target.value as any)}
                  className={`w-full p-2 border focus:outline-none ${
                    theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                >
                  <option value="Ataque">Ataque Organizado</option>
                  <option value="Defensa">Defensa Organizada</option>
                  <option value="Transición">Transición Ofensiva / Defensiva</option>
                  <option value="ABP">Acción a Balón Parado (ABP)</option>
                  <option value="Individual">Acción Individual</option>
                  <option value="Error">Error a Corregir</option>
                  <option value="Acierto">Acierto / Modelo</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold mb-1">Descripción del Análisis</label>
                <textarea
                  rows={2}
                  value={clipDescripcion}
                  onChange={(e) => setClipDescripcion(e.target.value)}
                  placeholder="Comportamiento del bloque y toma de decisiones..."
                  className={`w-full p-2 border focus:outline-none ${
                    theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold mb-1">
                  Futbolistas Involucrados (separados por coma)
                </label>
                <input
                  type="text"
                  value={clipJugadoresRaw}
                  onChange={(e) => setClipJugadoresRaw(e.target.value)}
                  placeholder="Ej: Koldo Berasaluze (#4), Kepa (#8)"
                  className={`w-full p-2 border focus:outline-none ${
                    theme === 'dark' ? 'bg-black border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowClipModal(false)}
                  className="px-4 py-2 border uppercase cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 font-bold uppercase border cursor-pointer ${
                    theme === 'dark' ? 'bg-white text-black border-white' : 'bg-black text-white border-black'
                  }`}
                >
                  Guardar Corte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
