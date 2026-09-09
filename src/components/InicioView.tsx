import React from 'react';
import { TabType, Player } from '../types';
import { useTheme } from '../context/ThemeContext';
import escudoGernika from '../assets/escudo-gernika.png';
import {
  Users,
  Calendar,
  ClipboardList,
  Target,
  UserCheck,
  Activity,
  BarChart3,
  Trophy,
  BookOpen,
  Video,
  Info,
  ChevronRight,
  ArrowRight,
  Shield,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface InicioViewProps {
  onNavigate: (tab: TabType) => void;
  playersCount: number;
  partidosCount: number;
  informesCount: number;
}

export const InicioView: React.FC<InicioViewProps> = ({
  onNavigate,
  playersCount,
  partidosCount,
  informesCount,
}) => {
  const { theme } = useTheme();

  // All requested main sections with complete metadata and navigation target
  const secciones = [
    {
      id: 'plantilla' as TabType,
      numero: '01',
      titulo: 'Plantilla',
      subtitulo: 'Fichas, alineación y gestión de jugadores',
      icono: Users,
      badge: `${playersCount} futbolistas`,
      destacado: '11 Titular & Banquillo',
    },
    {
      id: 'calendario' as TabType,
      numero: '02',
      titulo: 'Calendario',
      subtitulo: 'Partidos Liga Nacional Juvenil, entrenamientos y descansos',
      icono: Calendar,
      badge: 'Microciclo semanal',
      destacado: 'Urbieta Zelaia & Salidas',
    },
    {
      id: 'plan_partido' as TabType,
      numero: '03',
      titulo: 'Plan de Partido Semanal',
      subtitulo: 'Microciclo MD-4 a MD+1, plan de juego y rival',
      icono: ClipboardList,
      badge: 'Jornada 5 vs Eibar B',
      destacado: 'Objetivos tácticos',
    },
    {
      id: 'desarrollo_grupal' as TabType,
      numero: '04',
      titulo: 'Desarrollo Grupal',
      subtitulo: 'Modelo de juego en 4 fases y bitácora técnica',
      icono: Target,
      badge: 'Identidad táctica',
      destacado: '4 Fases del juego',
    },
    {
      id: 'desarrollo_individual' as TabType,
      numero: '05',
      titulo: 'Desarrollo Individual',
      subtitulo: 'Planes por jugador, evolución técnica y feedback',
      icono: UserCheck,
      badge: 'Planes a medida',
      destacado: 'Seguimiento por puesto',
    },
    {
      id: 'wellness_rpe' as TabType,
      numero: '06',
      titulo: 'Wellness y RPE',
      subtitulo: 'Control matinal de fatiga, descanso y carga sRPE',
      icono: Activity,
      badge: 'Readiness 4.4 / 5',
      destacado: 'Prevención lesiones',
    },
    {
      id: 'estadisticas' as TabType,
      numero: '07',
      titulo: 'Estadísticas',
      subtitulo: 'Métricas de plantilla, minutos, goles y rendimiento',
      icono: BarChart3,
      badge: 'Datos acumulados',
      destacado: 'Rankings y efectividad',
    },
    {
      id: 'resultados_clasif' as TabType,
      numero: '08',
      titulo: 'Resultados y Clasif.',
      subtitulo: 'Tabla Liga Nacional Grupo IV, marcadores y dinámica',
      icono: Trophy,
      badge: '2º Puesto (10 pts)',
      destacado: 'Zona Ascenso / Play-off',
    },
    {
      id: 'abp' as TabType,
      numero: '09',
      titulo: 'Repositorio ABP',
      subtitulo: 'Córners, faltas laterales, penaltis y pizarras',
      icono: BookOpen,
      badge: 'Jugadas ensayadas',
      destacado: 'Ofensivas y defensivas',
    },
    {
      id: 'editor_video' as TabType,
      numero: '10',
      titulo: 'Editor de Vídeo',
      subtitulo: 'Cortes tácticos, dibujo en frame y marcas de jugada',
      icono: Video,
      badge: 'Análisis telestrator',
      destacado: 'Video clips de partido',
    },
    {
      id: 'otras_info' as TabType,
      numero: '11',
      titulo: 'Otras Informaciones',
      subtitulo: 'Cuerpo técnico, enfermería, viajes y normativa',
      icono: Info,
      badge: 'Logística & Staff',
      destacado: 'Parte médico & viajes',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Club Banner */}
      <div
        className={`p-6 border transition-colors ${
          theme === 'dark'
            ? 'bg-[#0a0a0a] border-neutral-800 text-white'
            : 'bg-white border-neutral-300 text-black shadow-xs'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={escudoGernika}
              alt="Escudo SD Gernika"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0 drop-shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight m-0">
                  SD GERNIKA CLUB JUVENIL
                </h1>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 border uppercase tracking-wider ${
                    theme === 'dark'
                      ? 'border-neutral-700 bg-neutral-900 text-neutral-300'
                      : 'border-neutral-300 bg-neutral-100 text-neutral-800'
                  }`}
                >
                  Liga Nacional 26-27
                </span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-neutral-400 mt-1 uppercase tracking-wider">
                Temporada 2026-2027 • Liga Nacional Juvenil Grupo IV • Urbieta Zelaia
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold border uppercase tracking-wider ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-800 text-neutral-300'
                      : 'bg-neutral-100 border-neutral-300 text-neutral-800'
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  2º Clasificado • 10 Puntos
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold border uppercase tracking-wider ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-800 text-neutral-300'
                      : 'bg-neutral-100 border-neutral-300 text-neutral-800'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  Próximo: vs SD Eibar B (Día 4, 17:00h)
                </span>
              </div>
            </div>
          </div>

          {/* Next Match Quick Highlight Card */}
          <div
            className={`p-4 border font-mono text-xs w-full lg:w-80 shrink-0 ${
              theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-neutral-400 font-bold mb-2">
              <span>Jornada 3 Oficial</span>
              <span className="text-emerald-400 font-bold">● En 3 días</span>
            </div>
            <div className="flex items-center justify-between font-black text-sm my-1">
              <span>SD GERNIKA</span>
              <span className="text-neutral-500 font-normal">VS</span>
              <span>UTEBO FC</span>
            </div>
            <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>Estadio Urbieta Zelaia</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('plan_partido')}
              className={`mt-3 w-full py-1.5 text-center font-bold text-[11px] uppercase tracking-wider border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                theme === 'dark'
                  ? 'bg-white text-black border-white hover:bg-neutral-200'
                  : 'bg-black text-white border-black hover:bg-neutral-800'
              }`}
            >
              <span>Ver Plan de Partido</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of ALL Sections (Buttons with Direct Navigation) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight">
              Todos los Apartados Principales
            </h2>
            <p className="text-xs font-mono text-neutral-400 uppercase">
              Pulsa en cualquier apartado para acceder inmediatamente a su área de trabajo
            </p>
          </div>
          <span
            className={`hidden sm:inline-block px-2.5 py-1 text-xs font-mono font-bold border uppercase tracking-wider ${
              theme === 'dark'
                ? 'border-neutral-800 bg-neutral-900 text-neutral-400'
                : 'border-neutral-300 bg-white text-neutral-700'
            }`}
          >
            11 Módulos Activos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {secciones.map((sec) => {
            const Icon = sec.icono;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => onNavigate(sec.id)}
                className={`p-4 border text-left flex flex-col justify-between group transition-all cursor-pointer hover:translate-y-[-2px] ${
                  theme === 'dark'
                    ? 'bg-[#0d0d0d] border-neutral-800 hover:border-white hover:bg-neutral-900'
                    : 'bg-white border-neutral-300 hover:border-black hover:bg-neutral-50 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 border flex items-center justify-center transition-colors ${
                        theme === 'dark'
                          ? 'border-neutral-700 bg-black group-hover:border-white group-hover:bg-white group-hover:text-black text-white'
                          : 'border-neutral-300 bg-neutral-100 group-hover:border-black group-hover:bg-black group-hover:text-white text-black'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-[10px] text-neutral-500 font-bold">
                      {sec.numero}
                    </span>
                  </div>

                  <h3 className="font-black text-sm uppercase tracking-tight mb-1 group-hover:underline">
                    {sec.titulo}
                  </h3>
                  <p className="text-xs font-mono text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                    {sec.subtitulo}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs font-mono">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 border uppercase tracking-wider ${
                      theme === 'dark'
                        ? 'border-neutral-800 bg-black text-neutral-300'
                        : 'border-neutral-300 bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {sec.badge}
                  </span>
                  <div className="flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform">
                    <span className="text-[11px] uppercase">Abrir</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Club KPIs Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div
          className={`p-3.5 border font-mono text-center transition-colors ${
            theme === 'dark' ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-300'
          }`}
        >
          <span className="text-[10px] uppercase text-neutral-400 block mb-1">Futbolistas 25-26</span>
          <span className="text-xl sm:text-2xl font-black">{playersCount}</span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">100% fichas activas</span>
        </div>

        <div
          className={`p-3.5 border font-mono text-center transition-colors ${
            theme === 'dark' ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-300'
          }`}
        >
          <span className="text-[10px] uppercase text-neutral-400 block mb-1">Partidos Disputados</span>
          <span className="text-xl sm:text-2xl font-black">{partidosCount}</span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">2 victorias (100%)</span>
        </div>

        <div
          className={`p-3.5 border font-mono text-center transition-colors ${
            theme === 'dark' ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-300'
          }`}
        >
          <span className="text-[10px] uppercase text-neutral-400 block mb-1">Informes Staff</span>
          <span className="text-xl sm:text-2xl font-black">{informesCount}</span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">Evaluaciones completas</span>
        </div>

        <div
          className={`p-3.5 border font-mono text-center transition-colors ${
            theme === 'dark' ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-300'
          }`}
        >
          <span className="text-[10px] uppercase text-neutral-400 block mb-1">Estado Físico / RPE</span>
          <span className="text-xl sm:text-2xl font-black">4.3 / 5</span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">Sin alertas críticas</span>
        </div>
      </div>
    </div>
  );
};
