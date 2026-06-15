// marketplace/utils/slugProduct.ts

/**
 * Generate slug dari nama produk (3 kata)
 * Contoh: "Keripik Kentang Manis Pedas" → "keripik-kentang-manis"
 */
export function slugProduct(name: string): string {
  if (!name) return "";

  // Split jadi kata-kata
  const words = name.trim().split(/\s+/);

  // Ambil max 3 kata pertama
  const threeWords = words.slice(0, 3);

  // Lowercase + join dengan dash
  return threeWords
    .map((word) => word.toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter((word) => word.length > 0)
    .join("-");
}

/**
 * Generate unique slug (untuk service)
 * Contoh: "keripik-kentang-manis" → "keripik-kentang-manis-2"
 */
export function slugProductWithCounter(name: string, counter: number): string {
  const base = slugProduct(name);
  if (counter <= 1) return base;
  return `${base}-${counter}`;
}