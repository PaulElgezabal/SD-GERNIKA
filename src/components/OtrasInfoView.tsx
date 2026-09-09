import React, { useState } from 'react';
import { MiembroStaff, ParteMedico, LogisticaViaje } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Info,
  Users,
  HeartPulse,
  Bus,
  ShieldCheck,
  Phone,
  Mail,
  Clock,
  MapPin,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface OtrasInfoViewProps {
  staff: MiembroStaff[];
  partesMedicos: ParteMedico[];
  logistica: LogisticaViaje;
}

export const OtrasInfoView: React.FC<OtrasInfoViewProps> = ({
  staff,
  partesMedicos,
  logistica,
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'staff' | 'medico' | 'viajes' | 'normas'>('staff');

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
              Otras Informaciones • Gestión Institucional
            </h1>
            <p className="text-xs font-mono text-neutral-400 mt-0.5 uppercase">
              Cuerpo técnico oficial, enfermería, logística de desplazamientos y régimen interno
            </p>
          </div>

          <span
            className={`px-3 py-1 text-xs font-mono font-bold border uppercase tracking-wider ${
              theme === 'dark'
                ? 'border-neutral-800 bg-neutral-900 text-neutral-300'
                : 'border-neutral-300 bg-white text-neutral-700'
            }`}
          >
            Juvenil Nacional 2026-2027
          </span>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-4 border-t border-neutral-800/60 font-mono text-xs">
          {[
            { id: 'staff', label: '1. Cuerpo Técnico & Staff', icon: Users },
            { id: 'medico', label: '2. Servicios Médicos / Enfermería', icon: HeartPulse },
            { id: 'viajes', label: '3. Logística de Viajes', icon: Bus },
            { id: 'normas', label: '4. Régimen Interno & Protocolos', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 border font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  isCurrent
                    ? theme === 'dark'
                      ? 'bg-white text-black border-white'
                      : 'bg-black text-white border-black'
                    : theme === 'dark'
                    ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    : 'bg-neutral-100 border-neutral-300 text-neutral-600 hover:text-black'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Staff Técnico */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {staff.map((m) => (
            <div
              key={m.id}
              className={`p-4 border flex flex-col justify-between ${
                theme === 'dark' ? 'bg-[#0d0d0d] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] uppercase text-neutral-400 mb-1">
                  <span>SD GERNIKA</span>
                  <span className="font-bold border px-1 border-neutral-700">OFICIAL</span>
                </div>
                <h3 className="font-black text-sm uppercase">{m.nombre}</h3>
                <p className="text-[11px] text-neutral-400 uppercase mt-0.5 mb-3">{m.cargo}</p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-neutral-800 text-[11px]">
                <div className="flex items-center gap-1.5 text-neutral-300">
                  <Phone className="w-3 h-3 text-neutral-500" />
                  <span>{m.telefono}</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-400 truncate">
                  <Mail className="w-3 h-3 text-neutral-500 shrink-0" />
                  <span className="truncate">{m.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Parte Médico & Enfermería */}
      {activeTab === 'medico' && (
        <div className="space-y-4">
          <div
            className={`p-5 border ${
              theme === 'dark' ? 'bg-[#0d0d0d] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-2">
              <h2 className="text-sm font-black uppercase tracking-tight">
                Estado Actual de la Enfermería ({partesMedicos.length} Jugadores en Recuperación)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {partesMedicos.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 border ${
                    theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm uppercase">
                      #{p.dorsal} {p.jugadorNombre}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 border uppercase ${
                        p.estado === 'Readaptación de Campo'
                          ? theme === 'dark'
                            ? 'bg-neutral-800 border-neutral-600 text-white'
                            : 'bg-neutral-200 border-neutral-400 text-black'
                          : 'border-neutral-700 bg-neutral-900 text-neutral-300'
                      }`}
                    >
                      {p.estado}
                    </span>
                  </div>

                  <div className="space-y-1 text-neutral-300 mb-3">
                    <p>
                      <span className="text-neutral-500 uppercase">Diagnóstico:</span> {p.lesion}
                    </p>
                    <p>
                      <span className="text-neutral-500 uppercase">Fecha Lesión:</span> {p.fechaLesion}
                    </p>
                    <p>
                      <span className="text-neutral-500 uppercase">Pronóstico Estimado:</span> {p.tiempoEstimado}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-800 text-[10px] text-neutral-400 flex items-center justify-between">
                    <span>Fisioterapeuta: {p.fisioterapeuta}</span>
                    <span className="text-emerald-400">En Seguimiento Diario</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Logística de Viajes */}
      {activeTab === 'viajes' && (
        <div
          className={`p-6 border font-mono text-xs ${
            theme === 'dark' ? 'bg-[#0c0c0c] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
          }`}
        >
          <div className="border-b border-neutral-800 pb-3 mb-4 flex items-center justify-between">
            <h2 className="text-base font-black uppercase tracking-tight">
              Hoja de Ruta & Desplazamiento Oficial
            </h2>
            <span className="text-neutral-400">{logistica.partidoRival}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className={`p-4 border ${theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'}`}>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                Salida desde Urbieta
              </span>
              <p className="font-bold">{logistica.horaSalidaUrbieta}</p>
            </div>

            <div className={`p-4 border ${theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'}`}>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                Hotel de Concentración
              </span>
              <p className="font-bold">{logistica.hotelConcentracion}</p>
            </div>

            <div className={`p-4 border ${theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'}`}>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                Alimentación Previa
              </span>
              <p className="font-bold">{logistica.horarioComida}</p>
            </div>

            <div className={`p-4 border ${theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'}`}>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                Transporte Oficial
              </span>
              <p className="font-bold">{logistica.autobusEmpresa}</p>
            </div>

            <div className={`p-4 border ${theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'}`}>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                Contacto del Delegado
              </span>
              <p className="font-bold">{logistica.contactoDelegado}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Régimen Interno & Protocolos */}
      {activeTab === 'normas' && (
        <div
          className={`p-6 border font-mono text-xs space-y-4 ${
            theme === 'dark' ? 'bg-[#0c0c0c] border-neutral-800' : 'bg-white border-neutral-300 shadow-xs'
          }`}
        >
          <div className="border-b border-neutral-800 pb-3">
            <h2 className="text-base font-black uppercase tracking-tight">
              Normativa Interna y Código del Vestuario 25-26
            </h2>
            <p className="text-neutral-400 text-xs mt-0.5">
              Estándares profesionales aprobados por la plantilla y cuerpo técnico
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 border ${theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'}`}>
              <span className="text-[11px] uppercase font-bold block mb-2 text-white">
                1. Horarios y Puntualidad en Urbieta
              </span>
              <ul className="space-y-1.5 text-neutral-300">
                <li>• Llegada obligatoria al vestuario 45 minutos antes de la hora fijada para el entrenamiento.</li>
                <li>• La charla técnica previa al partido es de máxima concentración: teléfonos apagados en taquilla.</li>
                <li>• Retraso de 1-5 minutos: aviso inmediato al delegado Koldo Mendia.</li>
              </ul>
            </div>

            <div className={`p-4 border ${theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'}`}>
              <span className="text-[11px] uppercase font-bold block mb-2 text-white">
                2. Indumentaria Oficial y Material
              </span>
              <ul className="space-y-1.5 text-neutral-300">
                <li>• Todos los viajes y desplazamientos oficiales se realizan con la ropa de paseo oficial del club.</li>
                <li>• Espinilleras obligatorias en todos los ejercicios de reducidos y partidillos en Urbieta.</li>
                <li>• Cuidado y recogida de balones y petos al término de cada sesión.</li>
              </ul>
            </div>

            <div className={`p-4 border ${theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'}`}>
              <span className="text-[11px] uppercase font-bold block mb-2 text-white">
                3. Comunicación Médica y Readaptación
              </span>
              <ul className="space-y-1.5 text-neutral-300">
                <li>• Cualquier molestia o dolor muscular debe reportarse a Beñat (Fisio) antes de las 09:30h.</li>
                <li>• Rellenar a diario el cuestionario Wellness matinal antes de saltar al terreno de juego.</li>
              </ul>
            </div>

            <div className={`p-4 border ${theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'}`}>
              <span className="text-[11px] uppercase font-bold block mb-2 text-white">
                4. Espíritu y Compromiso Gernika
              </span>
              <ul className="space-y-1.5 text-neutral-300">
                <li>• Respeto incondicional al compañero, rivales, árbitros y aficionados en Urbieta.</li>
                <li>• El trabajo en equipo y la entrega colectiva priman sobre cualquier individualidad.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
