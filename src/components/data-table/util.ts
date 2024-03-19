export function getSafeColumnId(id: string) {
  return id.replace(/[^a-zA-Z0-9]/g, '');
}
