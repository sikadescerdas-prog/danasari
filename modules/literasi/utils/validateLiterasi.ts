// modules/literasi/utils/validateLiterasi.ts

import { checkNegativeWords } from '@/modules/literasi/utils/negativeWords';

/* =========================
   ✅ VALIDATE TITLE
========================= */
export const validateTitle = (title: string): { isValid: boolean; message: string } => {
  if (!title || title.trim().length < 5) {
    return { isValid: false, message: 'Judul minimal 5 karakter' };
  }
  if (title.length > 200) {
    return { isValid: false, message: 'Judul maksimal 200 karakter' };
  }
  const check = checkNegativeWords(title);
  if (!check.isValid) {
    return { isValid: false, message: `Judul mengandung kata tidak pantas` };
  }
  return { isValid: true, message: 'Valid' };
};

/* =========================
   ✅ VALIDATE DESCRIPTION
========================= */
export const validateDescription = (description: string): { isValid: boolean; message: string } => {
  if (!description || description.trim().length < 10) {
    return { isValid: false, message: 'Deskripsi minimal 10 karakter' };
  }
  if (description.length > 500) {
    return { isValid: false, message: 'Deskripsi maksimal 500 karakter' };
  }
  const check = checkNegativeWords(description);
  if (!check.isValid) {
    return { isValid: false, message: `Deskripsi mengandung kata tidak pantas: ${check.foundWords.join(', ')}` };
  }
  return { isValid: true, message: 'Valid' };
};

/* =========================
   ✅ VALIDATE CONTENT
========================= */
export const validateContent = (content: string): { isValid: boolean; message: string } => {
  // Content optional - return valid if empty
  if (!content || content.trim() === '') {
    return { isValid: true, message: 'Valid' };
  }
  
  if (content.trim().length < 50) {
    return { isValid: false, message: 'Konten minimal 50 karakter' };
  }
  if (content.length > 50000) {
    return { isValid: false, message: 'Konten maksimal 50.000 karakter' };
  }
  const check = checkNegativeWords(content);
  if (!check.isValid) {
    return { isValid: false, message: `Konten mengandung kata tidak pantas: ${check.foundWords.join(', ')}` };
  }
  return { isValid: true, message: 'Valid' };
};

/* =========================
   ✅ VALIDATE LINK
========================= */
export const validateLink = (url: string): boolean => {
  if (!url) return true;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};