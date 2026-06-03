/**
 * Converte um texto em slug URL-friendly sem acentos.
 * Ex: "Mechas para Cabelos Finos" → "mechas-para-cabelos-finos"
 */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}
