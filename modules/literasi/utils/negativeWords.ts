// modules/literasi/utils/negativeWords.ts

/* =========================
   🚫 FILTER KATA NEGATIF
========================= */
export const NEGATIVE_WORDS = [
  // SARA / Diskriminasi
  'sara', 'rasis', 'rasisme', 'diskriminasi', 'kasta', 'etnis', 'suku', 'bangsa',
  
  // Porno / Adult / Seksual
  'bokep', 'porn', 'porno', 'mesum', 'colmek', 'ngentot', 'tele', 'ibel',
  'seks', 'kelamin', 'kontol', 'memek', 'vagina', 'penis', 'testis',
  'masturbasi', 'ejakulasi', 'orgasme', 'seksual', 'adult', 'xxx', '18+', 'pron',
  
  // Kekerasan
  'bunuh', 'bunuh diri', 'bunai', 'tortor', 'anarki', 'teror', 'teroris',
  'bomber', 'ledakan', 'bom', 'penembakan', 'pembunuh',
  
  // Politik Negatif
  'demo', 'protest', 'pki', 'pkih', 'komunis', 'marxis', 'lenin',
  'soekarno', 'soeharto', 'mliter', 'mlli', 'terlarang', 'larang',
  'dilarang', 'ilegal', 'kriminal', 'subversif',
  
  // Kata Kotor / Vulgar
  'goblok', 'gblk', 'anjg', 'anjing', 'asw', 'ash', 'tai', 'bangsat',
  'bngsat', 'njing', 'nigga', 'fuck', 'shit', 'damn', 'ass', 'bitch',
  'bastard', 'cunt', 'dick', 'pussy', 'cock', 'whore', 'slut', 'rape',
  'rapist', 'molest', 'suck', 'fck', 'gblk', 'anjrit',
  
  // Penipuan / Scams
  'scam', 'penipu', 'penipuan', 'hoax', 'fake news', 'berita palsu',
  'kabar bohong', 'phishing', 'tipu', 'kedaluwarsa',
  
  // Illegal / Haram
  'illegal', 'haram', 'risti', 'riba', 'murtad', 'kafir', 'syirik',
  'bidah', 'zalim', 'kezhaliman',
  
  // Fitnah / Ujaran Kebencian
  'fitnah', 'ujaran', 'kebencian', 'blackmail', 'ancaman', 'intimidasi',
  'bullying', 'doxxing', 'hate speech',
  
  // Judi
  'judol', 'judit', 'casino', 'poker', 'slot online', 'togel', 'lottery',
  'bandar', 'judi', 'bet',
  
  // Drugs
  'narkoba', 'drugs', 'herb', 'ganja', 'kokain', 'heroin', 'meth',
  'ekstasi', 'pills', 'obt', 'narko',
  
  // Misc Negative
  'mencuri', 'curian', 'rampok', 'rampas', 'korupsi', 'koruptor',
  'mafia', 'cartel', 'balas dendam', 'dendam', 'ujub', 'riya',
];

/* =========================
   🔍 CHECK NEGATIVE WORDS (WORD BOUNDARIES)
========================= */
export const checkNegativeWords = (text: string): { isValid: boolean; foundWords: string[] } => {
  if (!text) return { isValid: true, foundWords: [] };
  
  const words = text.toLowerCase().split(/\s+/);  // Split by whitespace
  const foundWords: string[] = [];
  
  for (const word of words) {
    // Remove punctuation
    const cleanWord = word.replace(/[^a-z0-9]/g, '');
    
    if (NEGATIVE_WORDS.includes(cleanWord)) {
      foundWords.push(cleanWord);
    }
  }
  
  return { 
    isValid: foundWords.length === 0, 
    foundWords: [...new Set(foundWords)]
  };
};

/* =========================
   ⛔ FILTER TITLE
========================= */
export const filterTitle = (title: string): boolean => {
  return checkNegativeWords(title).isValid;
};

/* =========================
   ⛔ FILTER DESCRIPTION
========================= */
export const filterDescription = (description: string): boolean => {
  return checkNegativeWords(description).isValid;
};

/* =========================
   ⛔ FILTER CONTENT
========================= */
export const filterContent = (content: string): boolean => {
  return checkNegativeWords(content).isValid;
};