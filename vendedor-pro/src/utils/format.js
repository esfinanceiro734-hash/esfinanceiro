/**
 * Utilitários de formatação globais.
 * Centralizado aqui para evitar duplicação em todas as páginas.
 */

export function fmtMoeda(v) {
  return Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function fmtData(d, opts) {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', opts);
}

export function fmtDataCurta(d) {
  return fmtData(d, { weekday: 'short', day: '2-digit', month: '2-digit' });
}

export function hoje() {
  return new Date().toISOString().slice(0, 10);
}

export function inicioDoDia() {
  return new Date().toISOString().slice(0, 10);
}

export function inicioDoMes() {
  return new Date().toISOString().slice(0, 7) + '-01';
}

export function inicioSemana() {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().slice(0, 10);
}
