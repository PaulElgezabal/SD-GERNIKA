import { Player } from '../types';

export function getPlayerAverage(p: Player): string {
  const values = [p.tecnica, p.tactica, p.condicional].filter((v): v is number => v !== null);
  if (values.length === 0) return '—';
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return avg.toFixed(2);
}

export function generatePlantillaMarkdown(players: Player[]): string {
  let md = `### 🔳 SOCIEDAD DEPORTIVA GERNIKA CLUB ⬜\n`;
  md += `**SISTEMA OFICIAL DE GESTIÓN DEPORTIVA — PLANTILLA OFICIAL**\n\n`;
  md += `| Dorsal | Nombre y Apellido | Año Nacimiento | Lateralidad |\n`;
  md += `| :---: | :--- | :---: | :---: |\n`;

  players.forEach((p) => {
    md += `| 🔳 ${p.dorsal} | ${p.nombre} | ${p.nacimiento} | ${p.lateralidad} |\n`;
  });

  md += `\n*Total de efectivos: ${players.length} jugadores convocados.*\n`;
  md += `*¡Gernika beti aurrera! — Estadio Urbieta, Gernika-Lumo.*`;
  return md;
}

export function generateNotasMarkdown(players: Player[]): string {
  let md = `### 🔳 EVALUACIÓN TÉCNICA DE RENDIMIENTO (ESCALA 1-5) ⬜\n`;
  md += `**DIRECCIÓN DEPORTIVA S.D. GERNIKA CLUB**\n\n`;
  md += `| Dorsal | Jugador | Técnica (1-5) | Táctica (1-5) | Condicional (1-5) | Media |\n`;
  md += `| :---: | :--- | :---: | :---: | :---: | :---: |\n`;

  players.forEach((p) => {
    const tec = p.tecnica !== null ? `${p.tecnica}` : '—';
    const tac = p.tactica !== null ? `${p.tactica}` : '—';
    const cond = p.condicional !== null ? `${p.condicional}` : '—';
    const media = getPlayerAverage(p);

    md += `| 🔳 ${p.dorsal} | ${p.nombre} | ${tec} | ${tac} | ${cond} | ${media} |\n`;
  });

  md += `\n**Criterios de Evaluación:**\n`;
  md += `- **Técnica:** Control, pase, regate\n`;
  md += `- **Táctica:** Colocación, toma de decisiones\n`;
  md += `- **Condicional:** Físico, resistencia, velocidad\n\n`;
  md += `*Nota: Los valores sin evaluar se registran como "—". Escala oficial de 1 a 5.*\n`;
  md += `*¡Gernika beti aurrera!*`;
  return md;
}
