/**
 * Formats a number as Brazilian currency (BRL).
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formats a number as a percentage with a fixed number of decimal places.
 */
export function formatPercent(value: number, decimals = 1): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)
}

/**
 * Formats a date in short Brazilian format (dd/mm/yyyy).
 */
export function formatDate(date: Date | string): string {
  const parsed = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR').format(parsed)
}
