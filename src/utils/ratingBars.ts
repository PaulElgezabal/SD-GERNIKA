/**
 * Renders rating bars using black & white blocks (🔳, ⬜, ⚫, ⚪)
 * Example: "Técnica: 🔳🔳🔳🔳⬜ (4/5)"
 */
export function formatRatingBar(
  value: number | null,
  style: 'squares' | 'circles' = 'squares'
): string {
  if (value === null || value === undefined) {
    return '— (Sin evaluar / Ebaluatu gabe)';
  }

  const clamped = Math.max(1, Math.min(5, Math.round(value)));
  const filledChar = style === 'squares' ? '🔳' : '⚫';
  const emptyChar = style === 'squares' ? '⬜' : '⚪';

  const filled = filledChar.repeat(clamped);
  const empty = emptyChar.repeat(5 - clamped);

  return `${filled}${empty} (${clamped}/5)`;
}
