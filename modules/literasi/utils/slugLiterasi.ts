// modules/literasi/utils/slugLiterasi.ts

/* =========================
   🔗 SLUG GENERATOR
========================= */
export const generateSlug = (title: string): string => {
  const words = title.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const firstThree = words.slice(0, 3).join('-');
  const timestamp = Date.now().toString(36);
  return `${firstThree}-${timestamp}`;
};