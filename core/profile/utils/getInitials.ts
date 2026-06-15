// shared/utils/getInitials

export const getInitials = (name: string): string => {
  if (!name) return "U";
  
  const words = name.trim().split(/\s+/);
  
  if (words.length === 1) {
    // 1 kata: ambil 1 huruf saja
    return words[0][0].toUpperCase();
  }
  
  // 2+ kata: ambil 1 huruf dari 2 kata pertama
  return (words[0][0] + words[1][0]).toUpperCase();
};