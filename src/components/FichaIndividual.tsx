import React, { useState, useRef } from 'react';
import { Player } from '../types';
import { formatRatingBar } from '../utils/ratingBars';
import { getPlayerAverage } from '../utils/markdownGenerator';
import {
  Upload,
  Image as ImageIcon,
  Edit3,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Trash2,
  CheckCircle2,
  Camera,
} from 'lucide-react';

interface FichaIndividualProps {
  player: Player;
  allPlayers: Player[];
  darkMode: boolean;
  onBackToCampograma: () => void;
  onSelectPlayer: (player: Player) => void;
  onUpdateRatings: (player: Player) => void;
  onPhotoUploaded: (playerId: string, photoUrl: string) => void;
}

export const FichaIndividual: React.FC<FichaIndividualProps> = ({
  player,
  allPlayers,
  darkMode,
  onBackToCampograma,
  onSelectPlayer,
  onUpdateRatings,
  onPhotoUploaded,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Navigate to previous and next player
  const currentIndex = allPlayers.findIndex((p) => p.id === player.id);
  const prevPlayer = allPlayers[(currentIndex - 1 + allPlayers.length) % allPlayers.length];
  const nextPlayer = allPlayers[(currentIndex + 1) % allPlayers.length];

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadMessage('⚠️ Por favor, seleccione un archivo de imagen válido (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        onPhotoUploaded(player.id, dataUrl);
        setUploadMessage(`🔳 Fotografía oficial actualizada para #${player.dorsal} ${player.nombre}.`);
        setTimeout(() => setUploadMessage(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleRemovePhoto = () => {
    onPhotoUploaded(player.id, '');
    setUploadMessage('Fotografía restablecida al marcador por defecto.');
    setTimeout(() => setUploadMessage(null), 3000);
  };

  const avgScore = getPlayerAverage(player);

  return (
    <div id={`ficha-individual-${player.dorsal}`} className="space-y-6">
      {/* Top Controls Bar */}
      <div
        className={`p-3.5 border flex flex-wrap items-center justify-between gap-3 ${
          darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-black'
        }`}
      >
        <button
          id="btn-back-to-campograma"
          type="button"
          onClick={onBackToCampograma}
          className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border flex items-center gap-2 transition-all cursor-pointer ${
            darkMode
              ? 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-white hover:text-white'
              : 'border-black bg-white text-black hover:bg-black hover:text-white'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Volver al Campograma / Zelaia</span>
        </button>

        {/* Previous / Next player navigator */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => onSelectPlayer(prevPlayer)}
            className={`px-2.5 py-1.5 border transition-all cursor-pointer flex items-center gap-1 ${
              darkMode
                ? 'border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600'
                : 'border-neutral-300 text-neutral-700 hover:text-black hover:border-black'
            }`}
            title={`Anterior: #${prevPlayer.dorsal} ${prevPlayer.nombre}`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">#{prevPlayer.dorsal}</span>
          </button>

          <span className="px-2 py-1 border font-bold text-[11px] bg-neutral-900 text-white dark:bg-white dark:text-black">
            {currentIndex + 1} / {allPlayers.length}
          </span>

          <button
            type="button"
            onClick={() => onSelectPlayer(nextPlayer)}
            className={`px-2.5 py-1.5 border transition-all cursor-pointer flex items-center gap-1 ${
              darkMode
                ? 'border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600'
                : 'border-neutral-300 text-neutral-700 hover:text-black hover:border-black'
            }`}
            title={`Siguiente: #${nextPlayer.dorsal} ${nextPlayer.nombre}`}
          >
            <span className="hidden sm:inline">#{nextPlayer.dorsal}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Ficha Card */}
      <div
        className={`border shadow-sm p-6 sm:p-8 transition-colors ${
          darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-black'
        }`}
      >
        {/* Official Header */}
        <div className="border-b pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-base">🔳</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight uppercase">
                FICHA INDIVIDUAL / FITXA INDIBIDUALA
              </h2>
              <p className="text-xs font-mono text-neutral-500">
                S.D. GERNIKA CLUB • RFEF SEGUNDA FEDERACIÓN • URBIETA
              </p>
            </div>
            <span className="text-base">⬜</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span
              className={`px-3 py-1 font-bold border ${
                darkMode ? 'border-neutral-700 bg-black text-white' : 'border-black bg-neutral-100 text-black'
              }`}
            >
              DORSAL #{player.dorsal}
            </span>
          </div>
        </div>

        {/* Content Columns: Photo + Data + Performance */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Column 1: Foto & Upload Section (md:col-span-4) */}
          <div className="md:col-span-4 space-y-4">
            {/* Foto Container */}
            <div
              className={`border-2 p-4 flex flex-col items-center justify-center min-h-[260px] text-center relative overflow-hidden transition-all ${
                isDragging
                  ? 'border-white bg-neutral-900'
                  : darkMode
                  ? 'border-neutral-700 bg-black'
                  : 'border-black bg-neutral-50'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {player.fotoUrl ? (
                <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden border border-neutral-800">
                  <img
                    src={player.fotoUrl}
                    alt={player.nombre}
                    className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 border border-white text-[10px] font-mono font-bold text-white uppercase">
                    OFICIAL B&N
                  </div>
                </div>
              ) : (
                /* Requested placeholder format: [ FOTO: 🖼️ (Placeholder) ] */
                <div className="flex flex-col items-center justify-center py-6 font-mono">
                  <div className="text-4xl mb-3">🖼️</div>
                  <div className="font-bold text-sm tracking-wider uppercase">
                    [ FOTO: 🖼️ (Placeholder) ]
                  </div>
                  <span className="text-[11px] text-neutral-500 mt-2 block">
                    Fotografía no asignada
                  </span>
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Argazki ofiziala falta da
                  </span>
                </div>
              )}
            </div>

            {/* Photo Action Buttons */}
            <div className="space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
                id={`file-upload-${player.id}`}
              />

              <button
                id="btn-subir-foto"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full py-2 px-3 text-xs font-mono font-bold tracking-wider uppercase border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  darkMode
                    ? 'border-white bg-white text-black hover:bg-neutral-200'
                    : 'border-black bg-black text-white hover:bg-neutral-800'
                }`}
                title="Subir foto para este jugador"
              >
                <Camera className="w-4 h-4" />
                <span>{player.fotoUrl ? 'Cambiar Foto / Argazkia Aldatu' : 'Subir Foto / Argazkia Igo'}</span>
              </button>

              {player.fotoUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className={`w-full py-1.5 px-2 text-[11px] font-mono border flex items-center justify-center gap-1.5 transition-all cursor-pointer text-neutral-400 hover:text-white ${
                    darkMode ? 'border-neutral-800 hover:border-neutral-600' : 'border-neutral-300 hover:border-black'
                  }`}
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Quitar foto (volver a placeholder)</span>
                </button>
              )}

              <p className="text-[11px] font-mono text-neutral-500 text-center">
                Arrastre una imagen o diga <strong>"Subir foto"</strong> en la terminal.
              </p>

              {uploadMessage && (
                <div
                  className={`p-2 border text-xs font-mono text-center flex items-center justify-center gap-1.5 ${
                    darkMode ? 'border-neutral-700 bg-neutral-900 text-white' : 'border-black bg-neutral-100 text-black'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{uploadMessage}</span>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Datos Personales & Gráfico de Rendimiento (md:col-span-8) */}
          <div className="md:col-span-8 space-y-6 font-mono">
            {/* 1. DATOS PERSONALES */}
            <div
              className={`p-5 border ${
                darkMode ? 'border-neutral-800 bg-black' : 'border-neutral-300 bg-neutral-50'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-2 mb-4 border-neutral-800">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <span>🔳</span>
                  <span>DATOS DEL JUGADOR / DATU PERTSONALAK</span>
                </span>
                <span className="text-[11px] text-neutral-500">Temporada 2025/2026</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-[11px] uppercase text-neutral-500 block">
                    Nombre y Apellido / Izena:
                  </span>
                  <span className="font-black text-base sm:text-lg text-neutral-900 dark:text-white">
                    {player.nombre}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] uppercase text-neutral-500 block">
                    Dorsal / Zenbakia:
                  </span>
                  <span className="font-black text-base sm:text-lg flex items-center gap-1.5">
                    <span>🔳</span>
                    <span>#{player.dorsal}</span>
                  </span>
                </div>

                <div>
                  <span className="text-[11px] uppercase text-neutral-500 block">
                    Año de Nacimiento / Jaiotza:
                  </span>
                  <span className="font-bold text-sm sm:text-base">
                    {player.nacimiento} ({new Date().getFullYear() - player.nacimiento} urte / años)
                  </span>
                </div>

                <div>
                  <span className="text-[11px] uppercase text-neutral-500 block">
                    Lateralidad / Albokoa:
                  </span>
                  <span className="font-bold text-sm sm:text-base flex items-center gap-1.5">
                    <span>{player.lateralidad === 'Zurdo' ? '⬜' : '🔳'}</span>
                    <span>{player.lateralidad}</span>
                  </span>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-neutral-800/60">
                  <span className="text-[11px] uppercase text-neutral-500 block">
                    Demarcación Táctica / Posizioa:
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-sm text-neutral-200 dark:text-white">
                      {player.posicion}
                    </span>
                    <span className="text-neutral-500">•</span>
                    <span className="text-xs text-neutral-400 uppercase font-semibold">
                      {player.posicionEuskera || 'Jokalaria'}
                    </span>
                    <span
                      className={`ml-auto px-2 py-0.5 border text-[11px] font-bold ${
                        darkMode ? 'border-neutral-700 bg-neutral-900' : 'border-neutral-300 bg-white'
                      }`}
                    >
                      {player.posicionTactico}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. GRÁFICO DE RENDIMIENTO (Barras en blanco y negro: 🔳🔳🔳🔳⬜ (4/5)) */}
            <div
              className={`p-5 border ${
                darkMode ? 'border-neutral-800 bg-black' : 'border-neutral-300 bg-neutral-50'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-2 mb-4 border-neutral-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <span>⬜</span>
                    <span>GRÁFICO DE RENDIMIENTO / ERRENDIMENDU GRAFIKOA</span>
                  </span>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Barras oficiales albinegras en escala 1-5 (🔳 = 1 punto, ⬜ = pendiente)
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase text-neutral-500 block">Media / Batez b.</span>
                  <span className="font-black text-sm px-2 py-0.5 border border-white dark:border-white">
                    {avgScore} / 5
                  </span>
                </div>
              </div>

              {/* Performance Bars */}
              <div className="space-y-4">
                {/* Técnica */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                      Técnica:
                    </span>
                    <span className="text-[11px] text-neutral-500">Control, pase, regate</span>
                  </div>
                  <div
                    className={`p-2.5 border font-mono text-sm tracking-wider flex items-center justify-between ${
                      darkMode ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-300 bg-white'
                    }`}
                  >
                    <span className="font-black">
                      Técnica: {formatRatingBar(player.tecnica, 'squares')}
                    </span>
                    <span className="text-xs text-neutral-400 font-bold">
                      {player.tecnica !== null ? `⚫ ${player.tecnica} / 5` : '—'}
                    </span>
                  </div>
                </div>

                {/* Táctica */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                      Táctica:
                    </span>
                    <span className="text-[11px] text-neutral-500">Colocación, toma de decisiones</span>
                  </div>
                  <div
                    className={`p-2.5 border font-mono text-sm tracking-wider flex items-center justify-between ${
                      darkMode ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-300 bg-white'
                    }`}
                  >
                    <span className="font-black">
                      Táctica: {formatRatingBar(player.tactica, 'squares')}
                    </span>
                    <span className="text-xs text-neutral-400 font-bold">
                      {player.tactica !== null ? `⚫ ${player.tactica} / 5` : '—'}
                    </span>
                  </div>
                </div>

                {/* Condicional */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                      Condicional:
                    </span>
                    <span className="text-[11px] text-neutral-500">Físico, resistencia, velocidad</span>
                  </div>
                  <div
                    className={`p-2.5 border font-mono text-sm tracking-wider flex items-center justify-between ${
                      darkMode ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-300 bg-white'
                    }`}
                  >
                    <span className="font-black">
                      Condicional: {formatRatingBar(player.condicional, 'squares')}
                    </span>
                    <span className="text-xs text-neutral-400 font-bold">
                      {player.condicional !== null ? `⚫ ${player.condicional} / 5` : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action to edit ratings */}
              <div className="mt-5 pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-neutral-500">
                  Comando CLI: "Actualiza a {player.nombre}: Técnica 5, Táctica 4, Condicional 5"
                </div>

                <button
                  id={`btn-editar-notas-desde-ficha-${player.dorsal}`}
                  type="button"
                  onClick={() => onUpdateRatings(player)}
                  className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border flex items-center gap-2 transition-all cursor-pointer ${
                    darkMode
                      ? 'border-neutral-700 bg-neutral-900 text-white hover:border-white hover:bg-white hover:text-black'
                      : 'border-black bg-white text-black hover:bg-black hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Actualizar Notas de {player.nombre.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
