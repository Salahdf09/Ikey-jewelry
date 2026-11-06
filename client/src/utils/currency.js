export function formatDA(amount) {
  const value = Math.round(Number(amount) || 0);
  return `${value.toLocaleString('fr-FR').replace(/,/g, ' ')} DA`;
}
