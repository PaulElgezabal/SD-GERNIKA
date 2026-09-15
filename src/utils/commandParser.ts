import { Player, TabType } from '../types';

export interface CommandResult {
  action: 'switch_tab' | 'update_player' | 'view_player' | 'trigger_upload' | 'help' | 'unknown';
  targetTab?: TabType;
  targetPlayer?: Player;
  updatedPlayer?: Player;
  message: string;
  success: boolean;
}

export function parseCommand(
  input: string,
  players: Player[],
  selectedPlayer?: Player | null
): CommandResult {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  // 1. Ver Campograma (Zelaia / 4-3-3)
  if (
    lower === 'ver campograma' ||
    lower === 'campograma' ||
    lower === 'zelaia' ||
    lower === 'ver zelaia' ||
    lower === 'ver campo' ||
    lower === 'campo' ||
    lower === 'alineacion' ||
    lower === 'táctica' ||
    lower === 'tactica'
  ) {
    return {
      action: 'switch_tab',
      targetTab: 'campo',
      message: '🔳 Mostrando Campograma táctico (4-3-3) en caracteres de la S.D. Gernika Club. Urbieta Zelaia. Gernika beti aurrera!',
      success: true,
    };
  }

  // 2. Ver Plantilla
  if (
    lower === 'ver plantilla' ||
    lower === 'plantilla' ||
    lower === 'taldea' ||
    lower === 'mostrar plantilla' ||
    lower === 'ir a plantilla'
  ) {
    return {
      action: 'switch_tab',
      targetTab: 'plantilla',
      message: '🔳 Mostrando tabla de plantilla oficial de la S.D. Gernika Club. Gernika beti aurrera!',
      success: true,
    };
  }

  // 3. Ver Notas
  if (
    lower === 'ver notas' ||
    lower === 'notas' ||
    lower === 'ebaluazioa' ||
    lower === 'mostrar notas' ||
    lower === 'rendimiento' ||
    lower === 'ver rendimiento'
  ) {
    return {
      action: 'switch_tab',
      targetTab: 'informes',
      message: '⬜ Mostrando evaluación de rendimiento del primer equipo. Escala oficial 1-5.',
      success: true,
    };
  }

  // 4. Subir Foto (Upload Photo)
  if (
    lower === 'subir foto' ||
    lower === 'subir imagen' ||
    lower === 'cargar foto' ||
    lower === 'argazkia igo' ||
    lower.startsWith('subir foto a') ||
    lower.startsWith('subir foto de')
  ) {
    // Check if player specified in command
    let target = selectedPlayer;
    for (const p of players) {
      if (lower.includes(p.nombre.toLowerCase())) {
        target = p;
        break;
      }
    }

    return {
      action: 'trigger_upload',
      targetPlayer: target || players[0],
      targetTab: 'plantilla',
      message: target
        ? `🔳 Listo para procesar imagen para [#${target.dorsal} ${target.nombre}]. Puede seleccionar archivo o arrastrar la imagen en la ficha.`
        : '🔳 Seleccione un jugador o abra su ficha para procesar y cargar la fotografía oficial.',
      success: true,
    };
  }

  // 5. Jugador [X] or Ficha [Nombre/Dorsal] or direct player name
  const isPlayerQuery =
    lower.startsWith('jugador ') ||
    lower.startsWith('jugador #') ||
    lower.startsWith('ver ') ||
    lower.startsWith('ficha ') ||
    lower.startsWith('fitxa ');

  let lookupQuery = lower;
  if (isPlayerQuery) {
    lookupQuery = lower
      .replace(/^jugador\s*#?/, '')
      .replace(/^ver\s*/, '')
      .replace(/^ficha\s*(de\s*)?/, '')
      .replace(/^fitxa\s*/, '')
      .trim();
  }

  // Check if lookup matches a player dorsal (e.g. "7", "1", "11")
  const dorsalNumber = parseInt(lookupQuery, 10);
  if (!isNaN(dorsalNumber) && String(dorsalNumber) === lookupQuery) {
    const foundByDorsal = players.find((p) => p.dorsal === dorsalNumber);
    if (foundByDorsal) {
      return {
        action: 'view_player',
        targetPlayer: foundByDorsal,
        targetTab: 'plantilla',
        message: `🔳 Ficha oficial de #${foundByDorsal.dorsal} ${foundByDorsal.nombre} abierta. Gernika beti aurrera!`,
        success: true,
      };
    }
  }

  // Check if matches player name directly
  for (const p of players) {
    const pName = p.nombre.toLowerCase();
    const pSurname = p.nombre.split(' ').slice(1).join(' ').toLowerCase();
    if (
      lower === pName ||
      lookupQuery === pName ||
      lower === pSurname ||
      lookupQuery === pSurname ||
      (lookupQuery.length > 3 && pName.includes(lookupQuery))
    ) {
      return {
        action: 'view_player',
        targetPlayer: p,
        targetTab: 'plantilla',
        message: `🔳 Ficha individual de #${p.dorsal} ${p.nombre} cargada en pantalla.`,
        success: true,
      };
    }
  }

  // 6. Actualizar [Nombre]
  const isActualizar =
    lower.startsWith('actualizar') ||
    lower.startsWith('actualiza a') ||
    lower.startsWith('actualiza') ||
    lower.startsWith('evaluar') ||
    lower.startsWith('evalua a');

  if (isActualizar) {
    // Find matching player
    let matchedPlayer: Player | undefined;
    for (const p of players) {
      if (lower.includes(p.nombre.toLowerCase())) {
        matchedPlayer = p;
        break;
      }
    }

    if (!matchedPlayer) {
      // Try matching by surname
      for (const p of players) {
        const surname = p.nombre.split(' ').slice(1).join(' ').toLowerCase();
        if (surname && lower.includes(surname)) {
          matchedPlayer = p;
          break;
        }
      }
    }

    if (!matchedPlayer && selectedPlayer) {
      matchedPlayer = selectedPlayer;
    }

    if (!matchedPlayer) {
      return {
        action: 'unknown',
        message: '⚠️ Jugador no encontrado en la plantilla de S.D. Gernika. Verifique el nombre (ej. "Mikel Arzalluz", "Jon Altamira").',
        success: false,
      };
    }

    // Extract notes
    let tecnica: number | null = matchedPlayer.tecnica;
    let tactica: number | null = matchedPlayer.tactica;
    let condicional: number | null = matchedPlayer.condicional;

    const tecMatch = lower.match(/(?:t[ée]cnica|tec)[\s:=]+([1-5])/i);
    const tacMatch = lower.match(/(?:t[áa]ctica|tac)[\s:=]+([1-5])/i);
    const condMatch = lower.match(/(?:condicional|cond|f[íi]sico)[\s:=]+([1-5])/i);

    let foundAny = false;

    if (tecMatch) {
      tecnica = parseInt(tecMatch[1], 10);
      foundAny = true;
    }
    if (tacMatch) {
      tactica = parseInt(tacMatch[1], 10);
      foundAny = true;
    }
    if (condMatch) {
      condicional = parseInt(condMatch[1], 10);
      foundAny = true;
    }

    // Pattern 2: Numbers list after colon e.g. ": 5, 4, 3" or ": 5 4 3"
    if (!foundAny && lower.includes(':')) {
      const afterColon = lower.split(':')[1];
      const numbers = afterColon.match(/\b([1-5])\b/g);
      if (numbers && numbers.length >= 3) {
        tecnica = parseInt(numbers[0], 10);
        tactica = parseInt(numbers[1], 10);
        condicional = parseInt(numbers[2], 10);
        foundAny = true;
      } else if (numbers && numbers.length === 1) {
        tecnica = parseInt(numbers[0], 10);
        foundAny = true;
      }
    }

    if (!foundAny) {
      return {
        action: 'unknown',
        message: `⚠️ Especifique notas entre 1 y 5 para ${matchedPlayer.nombre}. Ejemplo: "Actualiza a ${matchedPlayer.nombre}: Técnica 5, Táctica 4, Condicional 5".`,
        success: false,
      };
    }

    const updated: Player = {
      ...matchedPlayer,
      tecnica,
      tactica,
      condicional,
    };

    return {
      action: 'update_player',
      targetTab: 'informes',
      targetPlayer: updated,
      updatedPlayer: updated,
      message: `🔳 Evaluación registrada para ${matchedPlayer.nombre} (Dorsal ${matchedPlayer.dorsal}): Técnica ${tecnica ?? '—'}, Táctica ${tactica ?? '—'}, Condicional ${condicional ?? '—'}. ¡Gernika beti aurrera!`,
      success: true,
    };
  }

  // Help command
  if (lower === 'ayuda' || lower === 'help' || lower === 'comandos') {
    return {
      action: 'help',
      message: 'Comandos disponibles: "Ver Campograma", "Ver Plantilla", "Ver Notas", "[Nombre/Dorsal]" (ej. "Mikel Arzalluz" o "Jugador 7"), "Subir foto", "Actualizar [Nombre]: Técnica 5, Táctica 4, Condicional 5".',
      success: true,
    };
  }

  return {
    action: 'unknown',
    message: `⚠️ Comando no reconocido: "${input}". Pruebe: "Ver Campograma", "Ver Plantilla", "Ver Notas", "Jugador 7" o "Actualiza a Mikel Arzalluz: Técnica 5, Táctica 4, Condicional 5".`,
    success: false,
  };
}
