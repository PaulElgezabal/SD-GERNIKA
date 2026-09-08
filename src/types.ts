export interface Player {
  id: string | number;
  nombre: string;
  dorsal: number;
  nacimiento: number;
  lateralidad: 'Diestro' | 'Zurdo' | string;
  posicion?: string;
  posicionEuskera?: string;
  posicionTactico?: 'POR' | 'LD' | 'DFC1' | 'DFC2' | 'LI' | 'MCD' | 'MC' | 'EI' | 'DC' | 'ED' | string;
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
  esTitular?: boolean;
  enCampo?: boolean;
}

export type TabType = 'plantilla' | 'campo' | 'informes' | 'partidos' | 'campograma' | 'notas' | 'ficha';

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
