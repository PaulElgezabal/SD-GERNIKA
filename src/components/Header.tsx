import React from 'react';
import { Shield, Sun, Moon, Terminal, Award } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  evaluatedCount: number;
  totalPlayers: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  evaluatedCount,
  totalPlayers,
}) => {
  return (
    <header
      id="sd-gernika-header"
      className={`border-b transition-colors duration-200 ${
        darkMode
          ? 'bg-neutral-950 border-neutral-800 text-white'
          : 'bg-white border-black text-black'
      }`}
    >
      {/* Top Banner with Basque club identity */}
      <div
        className={`px-4 py-1.5 text-xs font-mono flex items-center justify-between border-b ${
          darkMode
            ? 'bg-black border-neutral-900 text-neutral-400'
            : 'bg-neutral-100 border-neutral-300 text-neutral-700'
        }`}
      >
        <div className="flex items-center gap-2">
          <span>🔳</span>
          <span className="font-semibold tracking-wider uppercase">
            SOCIEDAD DEPORTIVA GERNIKA CLUB
          </span>
          <span className="text-neutral-500">•</span>
          <span className="hidden sm:inline">Fundado en 1922</span>
          <span className="text-neutral-500">•</span>
          <span className="hidden md:inline">Estadio Urbieta</span>
          <span>⬜</span>
        </div>
        <div className="flex items-center gap-3 font-semibold">
          <span className="text-neutral-400 hidden sm:inline">LEMA:</span>
          <span className="tracking-wide text-neutral-200 dark:text-white uppercase font-bold">
            «Gernika beti aurrera!»
          </span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3.5">
          {/* Custom Club Shield / Monogram in pure B&W */}
          <div
            className={`w-12 h-12 border-2 flex items-center justify-center font-bold tracking-tighter text-sm select-none shadow-sm relative overflow-hidden ${
              darkMode
                ? 'bg-black border-white text-white'
                : 'bg-black border-black text-white'
            }`}
          >
            {/* Striped B&W corner banner */}
            <div className="flex flex-col items-center justify-center leading-none">
              <span className="text-xs font-mono font-black">SDG</span>
              <span className="text-[10px] tracking-widest text-neutral-400">1922</span>
            </div>
            {/* Minimal vertical stripes indicator on edge */}
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-white">
                SD GERNIKA - Gestión Técnica
              </h1>
              <span
                className="text-[11px] px-2 py-0.5 font-mono font-bold uppercase tracking-wider border border-white bg-neutral-900 text-white"
              >
                OFICIAL
              </span>
            </div>
            <p
              className="text-xs sm:text-sm font-mono tracking-tight text-neutral-400"
            >
              Sociedad Deportiva Gernika Club • Pizarra Táctica y Plantilla
            </p>
          </div>
        </div>

        {/* Status Indicators & Theme Switcher */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          {/* Quick Metrics */}
          <div
            className={`px-3 py-1.5 border font-mono text-xs hidden md:flex items-center gap-2 ${
              darkMode
                ? 'border-neutral-800 bg-neutral-900/80 text-neutral-300'
                : 'border-neutral-300 bg-neutral-50 text-neutral-800'
            }`}
          >
            <span>🔳</span>
            <span>
              Plantilla: <strong>{totalPlayers}</strong>
            </span>
            <span className="text-neutral-500">|</span>
            <span>
              Evaluados: <strong>{evaluatedCount}/{totalPlayers}</strong>
            </span>
            <span>⬜</span>
          </div>

          {/* Theme Mode Toggle (Blanco y Negro) */}
          <button
            id="theme-mode-toggle"
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-mono font-bold tracking-wider uppercase border transition-all cursor-pointer ${
              darkMode
                ? 'border-white bg-white text-black hover:bg-neutral-200'
                : 'border-black bg-black text-white hover:bg-neutral-800'
            }`}
            title={darkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          >
            {darkMode ? (
              <>
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Modo Oscuro</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
