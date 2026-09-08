import React, { useState } from 'react';
import { Terminal, Send, HelpCircle, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { CommandLog } from '../types';

interface CommandConsoleProps {
  darkMode: boolean;
  onExecuteCommand: (command: string) => void;
  latestLog: CommandLog | null;
}

export const CommandConsole: React.FC<CommandConsoleProps> = ({
  darkMode,
  onExecuteCommand,
  latestLog,
}) => {
  const [inputCommand, setInputCommand] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCommand.trim()) return;
    onExecuteCommand(inputCommand);
    setInputCommand('');
  };

  const handleQuickCommand = (cmd: string) => {
    setInputCommand(cmd);
    onExecuteCommand(cmd);
  };

  return (
    <div
      id="sd-gernika-command-console"
      className={`border rounded-none p-4 transition-colors duration-200 ${
        darkMode
          ? 'bg-black border-neutral-800 text-white'
          : 'bg-neutral-50 border-black text-black'
      }`}
    >
      {/* Console Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-dashed border-neutral-700">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-neutral-400" />
          <span className="font-mono text-xs font-bold tracking-wider uppercase">
            TERMINAL DE COMANDOS OFICIAL — DIRECCIÓN TÉCNICA
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400">
          <span>🔳</span>
          <span>ESTADO: ACTIVO</span>
          <span>⬜</span>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div
          className={`flex-1 flex items-center border px-3 py-2 font-mono text-xs sm:text-sm ${
            darkMode
              ? 'bg-neutral-950 border-neutral-700 focus-within:border-white text-white'
              : 'bg-white border-black focus-within:border-neutral-700 text-black'
          }`}
        >
          <span className="font-bold mr-2 text-neutral-400 select-none">
            SD-GERNIKA &gt;
          </span>
          <input
            id="command-input"
            type="text"
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            placeholder='Ej: "Ver Plantilla", "Ver Notas", "Actualiza a Mikel Arzalluz: Técnica 5, Táctica 4, Condicional 5"'
            className="w-full bg-transparent border-none outline-none focus:ring-0 placeholder:text-neutral-500 font-mono text-xs sm:text-sm"
          />
        </div>

        <button
          id="execute-command-btn"
          type="submit"
          className={`px-5 py-2 font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 border transition-all cursor-pointer ${
            darkMode
              ? 'bg-white text-black border-white hover:bg-neutral-200'
              : 'bg-black text-white border-black hover:bg-neutral-800'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ejecutar</span>
        </button>
      </form>

      {/* Quick Action Command Chips */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
        <span className="text-neutral-500 font-semibold mr-1">Comandos V2:</span>
        <button
          id="cmd-quick-campograma"
          type="button"
          onClick={() => handleQuickCommand('Ver Campograma')}
          className={`px-2.5 py-1 border transition-colors cursor-pointer font-bold ${
            darkMode
              ? 'border-white bg-white text-black hover:bg-neutral-200'
              : 'border-black bg-black text-white hover:bg-neutral-800'
          }`}
        >
          🥅 Ver Campograma (4-3-3)
        </button>
        <button
          id="cmd-quick-jugador-7"
          type="button"
          onClick={() => handleQuickCommand('Jugador 7')}
          className={`px-2.5 py-1 border transition-colors cursor-pointer ${
            darkMode
              ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white'
              : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 hover:border-black'
          }`}
        >
          [ JUGADOR 7 ]
        </button>
        <button
          id="cmd-quick-subir-foto"
          type="button"
          onClick={() => handleQuickCommand('Subir foto')}
          className={`px-2.5 py-1 border transition-colors cursor-pointer ${
            darkMode
              ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white'
              : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 hover:border-black'
          }`}
        >
          🖼️ Subir foto
        </button>
        <button
          id="cmd-quick-plantilla"
          type="button"
          onClick={() => handleQuickCommand('Ver Plantilla')}
          className={`px-2.5 py-1 border transition-colors cursor-pointer ${
            darkMode
              ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white'
              : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 hover:border-black'
          }`}
        >
          🔳 Ver Plantilla
        </button>
        <button
          id="cmd-quick-notas"
          type="button"
          onClick={() => handleQuickCommand('Ver Notas')}
          className={`px-2.5 py-1 border transition-colors cursor-pointer ${
            darkMode
              ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white'
              : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 hover:border-black'
          }`}
        >
          ⬜ Ver Notas
        </button>
        <button
          id="cmd-quick-update-arzalluz"
          type="button"
          onClick={() =>
            handleQuickCommand('Actualiza a Mikel Arzalluz: Técnica 5, Táctica 4, Condicional 5')
          }
          className={`px-2.5 py-1 border transition-colors cursor-pointer hidden sm:inline-block ${
            darkMode
              ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white'
              : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 hover:border-black'
          }`}
        >
          ⚡ Actualizar #7 (5, 4, 5)
        </button>
      </div>

      {/* Terminal Feedback Output */}
      {latestLog && (
        <div
          className={`mt-3 pt-3 border-t font-mono text-xs flex items-start gap-2 ${
            darkMode ? 'border-neutral-800 text-neutral-300' : 'border-neutral-200 text-neutral-800'
          }`}
        >
          {latestLog.status === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          ) : latestLog.status === 'error' ? (
            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          ) : (
            <Terminal className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 text-[10px] text-neutral-500 mb-0.5">
              <span>{latestLog.timestamp}</span>
              <span>•</span>
              <span className="font-bold">Comando ejecutado: "{latestLog.command}"</span>
            </div>
            <p className="font-semibold">{latestLog.response}</p>
          </div>
        </div>
      )}
    </div>
  );
};
