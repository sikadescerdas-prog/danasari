// shared/utils/formatRibuan.ts

// parseRibuan: "1.000" → "1000"
export function parseRibuan(value: string): number {
  return parseInt(value.replace(/\./g, "")) || 0;
}

// formatRibuan: 1000 → "1.000"
export function formatRibuan(value: number | string): string {
  const num = typeof value === "string" ? parseRibuan(value) : value;
  return num.toLocaleString("id-ID");
}