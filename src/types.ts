export interface HabilidadesConBalon {
  control: number; // Control de balón (1-5)
  regate: number; // Regate (1-5)
  disparo: number; // Disparo (1-5)
  conduccion: number; // Conducción (1-5)
  pase: number; // Pase (1-5)
}

export interface HabilidadesSinBalon {
  presion: number; // Presión (1-5)
  desmarque: number; // Desmarque (1-5)
  colocacion: number; // Posicionamiento / Colocación (1-5)
  anticipacion: number; // Anticipación (1-5)
  sacrificio: number; // Sacrificio / Repliegue (1-5)
}

export interface Player {
  id: string | number;
  nombre: string;
  dorsal: number;
  nacimiento: number;
  fechaNacimiento?: string;
  edad?: number;
  minutosJugados?: number;
  partidosJugados?: number;
  partidosTitular?: number;
  lateralidad: 'Diestro' | 'Zurdo' | string;
  posicion?: string;
  posicionEuskera?: string;
  posicionTactico?: 'POR' | 'LD' | 'DFC1' | 'DFC2' | 'LI' | 'CAD' | 'CAI' | 'MCD' | 'MC' | 'EI' | 'DC' | 'ED' | 'SD' | string;
  posicionAlternativa?: string;
  posicionAlternativaEuskera?: string;
  tecnica: number | null;
  tactica: number | null;
  condicional: number | null;
  tomaDecision?: number | null;
  actitud?: number | null;
  wellness?: number | null;
  rpe?: number | null;
  fotoUrl?: string;
  foto_url?: string;
  telefono?: string;
  email?: string;
  correo?: string;
  posicion_x?: number;
  posicion_y?: number;
  posicion_alt_x?: number;
  posicion_alt_y?: number;
  esTitular?: boolean;
  enCampo?: boolean;
  habilidadesConBalon?: HabilidadesConBalon;
  habilidadesSinBalon?: HabilidadesSinBalon;
}

export type TabType =
  | 'inicio'
  | 'plantilla'
  | 'calendario'
  | 'plan_partido'
  | 'desarrollo_grupal'
  | 'desarrollo_individual'
  | 'wellness_rpe'
  | 'estadisticas'
  | 'resultados_clasif'
  | 'abp'
  | 'editor_video'
  | 'otras_info'
  | 'campo'
  | 'informes';

export interface CommandLog {
  id: string;
  timestamp: string;
  command: string;
  response: string;
  status: 'success' | 'info' | 'error';
}

export interface InformeJugador {
  id: string;
  jugadorId: string | number;
  jugadorNombre: string;
  jugadorDorsal: number;
  fecha: string;
  tipo: 'Entrenamiento' | 'Partido';
  tecnica: number; // 1-5
  tactica: number; // 1-5
  condicional: number; // 1-5
  tomaDecision: number; // 1-5
  actitud: number; // 1-5
  wellness: number; // 1-5
  rpe: number; // 1-10
  observaciones?: string;
}

export interface Partido {
  id: string;
  jornada: number;
  fecha: string;
  hora: string;
  rival: string;
  escudoRival?: string;
  esLocal: boolean;
  estadio: string;
  golesFavor?: number;
  golesContra?: number;
  estado: 'Finalizado' | 'Próximo' | 'En Directo';
  titularesIds: Array<string | number>;
  suplentesIds: Array<string | number>;
  goleadores?: string[];
  cronica?: string;
}

// 3. Calendario
export interface EventoCalendario {
  id: string;
  titulo: string;
  tipo: 'Partido' | 'Entrenamiento' | 'Gimnasio' | 'Charla Táctica' | 'Descanso' | 'Fisioterapia';
  fecha: string; // YYYY-MM-DD
  hora: string;
  lugar: string;
  diaMicrociclo?: 'MD-5' | 'MD-4' | 'MD-3' | 'MD-2' | 'MD-1' | 'MD' | 'MD+1' | 'Descanso';
  descripcion?: string;
  completado?: boolean;
}

// 4. Plan de partido semanal
export interface PlanPartidoSemanal {
  id: string;
  rival: string;
  jornada: number;
  fechaPartido: string;
  horaPartido: string;
  estadio: string;
  esLocal: boolean;
  analisisRival: {
    sistemaPrincipal: string;
    puntosFuertes: string[];
    puntosDebiles: string[];
    jugadoresClave: string[];
  };
  objetivosOfensivos: string[];
  objetivosDefensivos: string[];
  planTransiciones: string[];
  estrategiaABP: string[];
  microciclo: Array<{
    dia: string;
    foco: string;
    descripcion: string;
    duracionMin: number;
  }>;
}

// 5. Desarrollo Grupal
export interface PrincipioGrupal {
  id: string;
  fase: 'Ataque Organizado' | 'Defensa Organizada' | 'Transición Ofensiva' | 'Transición Defensiva';
  principio: string;
  subprincipios: string[];
  consignasClave: string[];
  nivelDominio: number; // 1-5
  observacionesStaff: string;
}

export interface ReunionGrupal {
  id: string;
  fecha: string;
  tema: string;
  conclusiones: string[];
  acuerdosVestuario: string[];
}

// 6. Desarrollo Individual
export interface PlanDesarrolloIndividual {
  id: string;
  jugadorId: string | number;
  jugadorNombre: string;
  dorsal: number;
  posicion: string;
  objetivosTecnicos: string[];
  objetivosTacticos: string[];
  objetivosFisicos: string[];
  puntosMejoraClave: string[];
  puntosFuertes: string[];
  evaluacionStaff: {
    tecnica: number;
    tactica: number;
    fisico: number;
    tomaDecision: number;
    mental: number;
  };
  notasSeguimiento: Array<{
    fecha: string;
    nota: string;
    autor: string;
  }>;
}

// 7. Wellness y RPE
export interface RegistroWellnessRPE {
  id: string;
  jugadorId: string | number;
  jugadorNombre: string;
  dorsal: number;
  fecha: string;
  sueno?: number; // 1-5 (1: Muy malo, 5: Excelente)
  calidadSueno?: number;
  suenoHoras?: number; // horas de descanso registradas
  fatiga: number; // 1-5 (1: Agotado, 5: Muy fresco)
  dolorMuscular: number; // 1-5 (1: Muy adolorido, 5: Sin dolor)
  estres: number; // 1-5 (1: Muy estresado, 5: Muy relajado)
  humor?: number; // 1-5 (1: Muy bajo, 5: Muy positivo)
  animo?: number;
  rpe?: number; // 1-10 (Borg CR10)
  rpeSesion?: number;
  minutosSesion?: number;
  duracionMinutos?: number;
  cargaSRPE?: number; // rpe * minutos
  observacion?: string;
  observaciones?: string;
}

// 9. Resultados y Clasificación
export interface EquipoClasificacion {
  posicion: number;
  nombre: string;
  puntos: number;
  partidosJugados: number;
  partidosGanados: number;
  partidosEmpatados: number;
  partidosPerdidos: number;
  golesFavor: number;
  golesContra: number;
  diferenciaGoles: number;
  racha: Array<'V' | 'E' | 'D'>;
  esGernika?: boolean;
}

// 10. Repositorio ABP
export interface JugadaABP {
  id: string;
  tipo: 'Córner Ofensivo' | 'Córner Defensivo' | 'Falta Frontal' | 'Falta Lateral Ofensiva' | 'Falta Lateral Defensiva' | 'Penalti' | 'Saque de Banda';
  nombre: string;
  codigoSecreto: string;
  lanzador: string;
  perfilPie: 'Derecho' | 'Zurdo';
  zonaEnvio: 'Primer palo' | 'Segundo palo' | 'Punto penalti' | 'Corta / Dos toques' | 'Frontal / Rechace';
  descripcion: string;
  asignaciones: Array<{
    rol: string;
    jugador: string;
  }>;
}

// 11. Editor de Vídeo
export interface VideoClipMarca {
  id: string;
  timestamp: number; // seconds
  tiempoFormato: string; // MM:SS
  titulo: string;
  categoria: 'Ataque' | 'Defensa' | 'Transición' | 'ABP' | 'Individual' | 'Error' | 'Acierto';
  descripcion: string;
  jugadoresInvolucrados: string[];
}

// 12. Otras Informaciones
export interface MiembroStaff {
  id: string;
  nombre: string;
  cargo: string;
  telefono: string;
  email: string;
}

export interface ParteMedico {
  id: string;
  jugadorId?: string | number;
  jugadorNombre: string;
  dorsal: number;
  lesion: string;
  fechaLesion: string;
  estado: 'En Fisioterapia' | 'Readaptación de Campo' | 'Alta Médica Próxima';
  tiempoEstimado: string;
  fisioterapeuta: string;
}

export interface LogisticaViaje {
  id: string;
  partidoRival: string;
  fecha: string;
  horaSalidaUrbieta: string;
  hotelConcentracion: string;
  horarioComida: string;
  autobusEmpresa: string;
  contactoDelegado: string;
}

// 13. Liga Nacional Juvenil / Gazteen Nazional Liga
export interface EquipoLiga {
  numero: number;
  codigo: string;
  nombre: string;
  contacto?: string;
  campo: string;
  tipoHierba: 'Hierba Artificial (HA)' | 'Hierba Natural (HN)';
  direccion: string;
  telefono?: string;
  fax?: string;
  localidad: string;
  provincia: 'Bizkaia' | 'Gipuzkoa' | 'Álava';
  primeraEquipacion: {
    tipoCamiseta?: string;
    camiseta: string;
    pantalon: string;
    medias: string;
  };
  segundaEquipacion?: {
    tipoCamiseta?: string;
    camiseta: string;
    pantalon: string;
    medias: string;
  };
}

export interface PartidoJornadaOficial {
  id: string;
  local: string;
  visitante: string;
  golesLocal?: number | null;
  golesVisitante?: number | null;
  jugado?: boolean;
}

export interface JornadaOficial {
  numero: number;
  fecha: string; // DD-MM-YYYY
  fechaISO: string; // YYYY-MM-DD
  vuelta: 1 | 2;
  partidos: PartidoJornadaOficial[];
}
