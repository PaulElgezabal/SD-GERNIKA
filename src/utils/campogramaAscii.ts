import { Player } from '../types';

export const CAMPOGRAMA_ASCII = `
[---------------------- 🥅 ----------------------]
|                                                |
|                      (1)                       |
|                 Jon Altamira                   |
|                                                |
|   (2)          (4)          (5)          (3)   |
| A. Parra   K. Berasaluze  X. Arberas  J. Agirre|
|                                                |
|         (6)                   (8)              |
|     J. Gallastegi          G. Marcos           |
|                                                |
|   (7)                 (9)                (11)  |
| M. Arzalluz       G. Navarro          K. Vieites|
|                                                |
[------------------------------------------------]
`;

export function generateCampogramaText(players: Player[]): string {
  const getP = (num: number) => players.find((p) => p.dorsal === num);
  const p1 = getP(1);
  const p2 = getP(2);
  const p4 = getP(4);
  const p5 = getP(5);
  const p3 = getP(3);
  const p6 = getP(6);
  const p8 = getP(8);
  const p7 = getP(7);
  const p9 = getP(9);
  const p11 = getP(11);

  return `
🔳============================================================🔳
               SOCIEDAD DEPORTIVA GERNIKA CLUB
             ZELAIA / CAMPOGRAMA TÁCTICO (4-3-3)
🔳============================================================🔳

               [------------- 🥅 -------------]
               |                              |
               |             ( 1 )            |
               |        ${(p1?.nombre || 'J. Altamira').padEnd(16, ' ')}      |
               |       [ATEZAINA / POR]       |
               |                              |
               |------------------------------|
               |                              |
  ( 2 )               ( 4 )        ( 5 )               ( 3 )
${(p2?.nombre.split(' ')[1] || 'Parra').padEnd(10, ' ')}       ${(p4?.nombre.split(' ')[1] || 'Berasaluze').padEnd(12, ' ')}${(p5?.nombre.split(' ')[1] || 'Arberas').padEnd(12, ' ')} ${(p3?.nombre.split(' ')[1] || 'Agirrezabala').padEnd(14, ' ')}
 [LD/Eskuin]       [DFC/Erdiko] [DFC/Erdiko]       [LI/Ezker]

               |                              |
               |        ( 6 )        ( 8 )    |
               |    ${(p6?.nombre.split(' ')[1] || 'Gallastegi').padEnd(11, ' ')}   ${(p8?.nombre.split(' ')[1] || 'Marcos').padEnd(10, ' ')} |
               |     [MCD/Pivote]  [MC/Erdia] |
               |                              |
               |------------------------------|
               |                              |
  ( 7 )                      ( 9 )                     ( 11 )
${(p7?.nombre.split(' ')[1] || 'Arzalluz').padEnd(12, ' ')}             ${(p9?.nombre.split(' ')[1] || 'Navarro').padEnd(12, ' ')}             ${(p11?.nombre.split(' ')[1] || 'Vieites').padEnd(12, ' ')}
 [EI/Ezker]               [DC/Aurrekoa]              [ED/Eskuin]
               |                              |
               [------------------------------]

🔳 Leyenda Albinegra:
   - ( 1) Atezaina / Portero
   - ( 2, 4, 5, 3) Atzelariak / Defensas
   - ( 6, 8) Erdikoak / Centrocampistas
   - ( 7, 9, 11) Aurrelariak / Delanteros
   «Gernika beti aurrera!»
`;
}
