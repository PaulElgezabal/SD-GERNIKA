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
  fotoUrl?: string;
  foto_url?: string;
  telefono?: string;
  email?: string;
  correo?: string;
  posicion_x?: number;
  posicion_y?: number;
  notasHistorial?: Array<{
    fecha: string;
    tecnica: number;
    tactica: number;
    condicional: number;
    notaPromedio: string;
  }>;
}

export type TabType = 'campograma' | 'plantilla' | 'notas' | 'ficha';

export interface CommandLog {
  id: string;
  timestamp: string;
  command: string;
  response: string;
  status: 'success' | 'info' | 'error';
}
