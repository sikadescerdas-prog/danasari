// shared/utils/formatDate.ts

/* =========================
   DATE TO DISPLAY (id-ID)
========================= */
export const formatDate = (date: string | number | Date): string => {
  if (!date) return "";
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/* =========================
   DATE TO SHORT DISPLAY
========================= */
export const formatDateShort = (date: string | number | Date): string => {
  if (!date) return "";
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* =========================
   DATE TO INPUT VALUE (yyyy-MM-dd)
========================= */
export const formatDateForInput = (date: string | number | Date): string => {
  if (!date) return "";
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  
  // Format: yyyy-MM-dd (for input type="date")
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  
  return `${year}-${month}-${day}`;
};

/* =========================
   AGE CALCULATION
========================= */
export const getAge = (birthDate: string | number | Date): number => {
  if (!birthDate) return 0;
  
  const d = new Date(birthDate);
  if (isNaN(d.getTime())) return 0;
  
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const monthDiff = today.getMonth() - d.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < d.getDate())) {
    age--;
  }
  
  return age;
};