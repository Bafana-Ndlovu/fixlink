/** Formats a number of Rand as "R1 250" (South African style, no cents for whole amounts). */
export function formatRand(amount: number): string {
  const hasCents = !Number.isInteger(amount);
  const formatted = new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return `R${formatted}`;
}

/** Text shown on provider cards, e.g. "From R350". */
export function startingPriceLabel(amount: number | null): string {
  return amount === null ? 'Price on request' : `From ${formatRand(amount)}`;
}
