export interface TacticalPositionInfo {
  code: string;
  codeEquiv?: string;
  label: string;
  labelEuskera: string;
  linea: 'porteros' | 'defensas' | 'mediocentros' | 'delanteros';
  x: number; // Porcentaje exacto en el campo horizontal (0 - 100)
  y: number; // Porcentaje exacto en el campo vertical (0 - 100)
  alternativasSugeridas?: string[];
}

export const OFFICIAL_TACTICAL_POSITIONS: TacticalPositionInfo[] = [
  // 1. Porteros
  {
    code: 'POR',
    label: 'Portero',
    labelEuskera: 'Atezaina',
    linea: 'porteros',
    x: 50,
    y: 89,
    alternativasSugeridas: [],
  },

  // 2. Defensas
  {
    code: 'LI',
    label: 'Lateral Izquierdo',
    labelEuskera: 'Ezkerreko Laterala',
    linea: 'defensas',
    x: 18,
    y: 74,
    alternativasSugeridas: ['CAI', 'DFC2', 'LD'],
  },
  {
    code: 'CAI',
    label: 'Carrilero Izquierdo',
    labelEuskera: 'Ezkerreko Hegala',
    linea: 'defensas',
    x: 14,
    y: 63,
    alternativasSugeridas: ['LI', 'EI', 'MC_IZQ'],
  },
  {
    code: 'DFC2',
    label: 'Central Izquierdo',
    labelEuskera: 'Erdiko Atzelaria (Ezk)',
    linea: 'defensas',
    x: 38,
    y: 78,
    alternativasSugeridas: ['DFC1', 'MCD', 'LI'],
  },
  {
    code: 'DFC1',
    label: 'Central Derecho',
    labelEuskera: 'Erdiko Atzelaria (Esk)',
    linea: 'defensas',
    x: 62,
    y: 78,
    alternativasSugeridas: ['DFC2', 'MCD', 'LD'],
  },
  {
    code: 'CAD',
    label: 'Carrilero Derecho',
    labelEuskera: 'Eskuineko Hegala',
    linea: 'defensas',
    x: 86,
    y: 63,
    alternativasSugeridas: ['LD', 'ED', 'MC_DCH'],
  },
  {
    code: 'LD',
    label: 'Lateral Derecho',
    labelEuskera: 'Eskuineko Laterala',
    linea: 'defensas',
    x: 82,
    y: 74,
    alternativasSugeridas: ['CAD', 'DFC1', 'LI'],
  },

  // 3. Mediocentros
  {
    code: 'MCD',
    label: 'Pivote Defensivo',
    labelEuskera: 'Euskarria',
    linea: 'mediocentros',
    x: 50,
    y: 61,
    alternativasSugeridas: ['MC_IZQ', 'MC_DCH', 'DFC1', 'DFC2'],
  },
  {
    code: 'MC_IZQ',
    codeEquiv: 'MC',
    label: 'Interior Izquierdo',
    labelEuskera: 'Ezkerreko Erdilaria',
    linea: 'mediocentros',
    x: 34,
    y: 48,
    alternativasSugeridas: ['MCD', 'MCO', 'EI', 'CAI'],
  },
  {
    code: 'MC_DCH',
    codeEquiv: 'MC',
    label: 'Interior Derecho',
    labelEuskera: 'Eskuineko Erdilaria',
    linea: 'mediocentros',
    x: 66,
    y: 48,
    alternativasSugeridas: ['MCD', 'MCO', 'ED', 'CAD'],
  },
  {
    code: 'MCO',
    label: 'Mediapunta',
    labelEuskera: 'Puntaerdia',
    linea: 'mediocentros',
    x: 50,
    y: 36,
    alternativasSugeridas: ['MC_IZQ', 'MC_DCH', 'SD', 'EI', 'ED', 'DC'],
  },

  // 4. Delanteros
  {
    code: 'EI',
    label: 'Extremo Izquierdo',
    labelEuskera: 'Ezkerreko Hegalekoa',
    linea: 'delanteros',
    x: 18,
    y: 23,
    alternativasSugeridas: ['ED', 'DC', 'MCO', 'CAI'],
  },
  {
    code: 'SD',
    label: 'Segundo Delantero',
    labelEuskera: 'Bigarren Aurrelaria',
    linea: 'delanteros',
    x: 50,
    y: 27,
    alternativasSugeridas: ['DC', 'MCO', 'EI', 'ED'],
  },
  {
    code: 'DC',
    label: 'Delantero Centro',
    labelEuskera: 'Aurrelaria',
    linea: 'delanteros',
    x: 50,
    y: 16,
    alternativasSugeridas: ['SD', 'ED', 'EI', 'MCO'],
  },
  {
    code: 'ED',
    label: 'Extremo Derecho',
    labelEuskera: 'Eskuineko Hegalekoa',
    linea: 'delanteros',
    x: 82,
    y: 23,
    alternativasSugeridas: ['EI', 'DC', 'MCO', 'CAD'],
  },
];

/**
 * Busca la información exacta de una posición a partir de su código o texto
 */
export function getTacticalPositionByCode(codeOrText?: string | null): TacticalPositionInfo | undefined {
  if (!codeOrText) return undefined;
  const clean = codeOrText.trim().toUpperCase();

  // Coincidencia directa por código
  const byCode = OFFICIAL_TACTICAL_POSITIONS.find(
    (p) => p.code === clean || p.codeEquiv === clean
  );
  if (byCode) return byCode;

  // Coincidencias flexibles
  const lower = codeOrText.trim().toLowerCase();
  if (lower.includes('portero') || lower.includes('atezain')) {
    return OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === 'POR');
  }
  if (lower.includes('lateral') && (lower.includes('derecho') || lower.includes('eskuin'))) {
    return OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === 'LD');
  }
  if (lower.includes('lateral') && (lower.includes('izquierdo') || lower.includes('ezker'))) {
    return OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === 'LI');
  }
  if (lower.includes('carrilero') && (lower.includes('derecho') || lower.includes('eskuin'))) {
    return OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === 'CAD');
  }
  if (lower.includes('carrilero') && (lower.includes('izquierdo') || lower.includes('ezker'))) {
    return OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === 'CAI');
  }
  if (lower.includes('central') || lower.includes('zentral')) {
    if (lower.includes('izquierdo') || lower.includes('ezker')) {
      return OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === 'DFC2');
    }
    return OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === 'DFC1');
  }
  if (lower.includes('pivote') || lower.includes('euskarri') || lower.includes('mcd')) {
    return OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === 'MCD');
  }
  if (lower.includes('mediapunta') || lower.includes('puntaerdi') || lower.includes('mco')) {
    return OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === 'MCO');
  }
  if (lower.includes('extremo') && (lower.includes('derecho') || lower.includes('eskuin'))) {
    return OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === 'ED');
  }
  if (lower.includes('extremo') && (lower.includes('izquierdo') || lower.includes('ezker'))) {
    return OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === 'EI');
  }
  if (lower.includes('segundo') || lower.includes('segunda punta')) {
    return OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === 'SD');
  }
  if (lower.includes('delantero') || lower.includes('punta') || lower.includes('aurrelari')) {
    return OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === 'DC');
  }
  if (lower.includes('medio') || lower.includes('interior') || lower.includes('erdilari')) {
    if (lower.includes('izquierdo') || lower.includes('ezker')) {
      return OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === 'MC_IZQ');
    }
    return OFFICIAL_TACTICAL_POSITIONS.find((p) => p.code === 'MC_DCH');
  }

  return undefined;
}
