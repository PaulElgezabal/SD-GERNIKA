import React, { useState } from 'react';
import { Copy, Check, FileCode, Eye } from 'lucide-react';

interface MarkdownViewProps {
  markdownText: string;
  title: string;
  darkMode: boolean;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({
  markdownText,
  title,
  darkMode,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`border transition-colors ${
        darkMode ? 'border-neutral-800 bg-neutral-950 text-white' : 'border-black bg-white text-black'
      }`}
    >
      {/* Header bar */}
      <div
        className={`px-4 py-2.5 border-b flex items-center justify-between font-mono text-xs ${
          darkMode ? 'border-neutral-800 bg-black' : 'border-neutral-200 bg-neutral-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-neutral-400" />
          <span className="font-bold uppercase tracking-wider">{title}</span>
          <span className="text-neutral-500">•</span>
          <span className="text-neutral-400">Formato Markdown Oficial</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`px-3 py-1 text-xs font-mono font-bold tracking-wider uppercase border flex items-center gap-1.5 transition-all cursor-pointer ${
            copied
              ? darkMode
                ? 'border-emerald-400 bg-emerald-950 text-emerald-300'
                : 'border-emerald-600 bg-emerald-50 text-emerald-700'
              : darkMode
              ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-white hover:text-white'
              : 'border-black bg-white text-black hover:bg-black hover:text-white'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar Markdown</span>
            </>
          )}
        </button>
      </div>

      {/* Code Block Container */}
      <div className="p-4 overflow-x-auto">
        <pre
          className={`font-mono text-xs sm:text-sm leading-relaxed p-4 border select-all ${
            darkMode
              ? 'border-neutral-800 bg-black text-neutral-200'
              : 'border-neutral-300 bg-neutral-50 text-neutral-900'
          }`}
        >
          <code>{markdownText}</code>
        </pre>
      </div>

      {/* Footer */}
      <div
        className={`px-4 py-2 border-t text-[11px] font-mono flex items-center justify-between text-neutral-500 ${
          darkMode ? 'border-neutral-900 bg-black/60' : 'border-neutral-200 bg-neutral-50'
        }`}
      >
        <span>🔳 SD Gernika Club — Tabla Oficial en Markdown ⬜</span>
        <span className="font-bold text-neutral-400">Gernika beti aurrera!</span>
      </div>
    </div>
  );
};
