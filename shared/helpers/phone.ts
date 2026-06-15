// shared/helpers/phone.ts

/* =========================
   SANITIZE (REMOVE NON-DIGIT)
========================= */
export function sanitizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

/* =========================
   NORMALIZE (TO 62XXXXXXXXXX)
========================= */
export function normalizePhone(
  countryCode: string,
  value: string
): string {
  if (!value) return "";

  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (countryCode === "62") {
    if (digits.startsWith("62")) {
      return digits;
    }

    if (digits.startsWith("08")) {
      return "62" + digits.slice(1);
    }

    if (digits.startsWith("02")) {
      return digits;
    }

    if (digits.startsWith("0")) {
      digits = digits.slice(1);
    }

    return "62" + digits;
  }

  return countryCode + digits;
}

/* =========================
   VALIDATE
========================= */
export function validatePhone(countryCode: string, value: string): {
  ok: boolean;
  phone?: string;
  error?: string;
} {
  if (!value) {
    return { ok: false, error: "Nomor telepon wajib diisi" };
  }

  const digits = value.replace(/\D/g, "");

  if (!/^\d+$/.test(digits)) {
    return { ok: false, error: "Hanya angka" };
  }

  const validPrefixes = ["62", "08", "02"];
  if (!validPrefixes.some(prefix => digits.startsWith(prefix))) {
    return { ok: false, error: "Mulai dengan 62, 08, atau 02" };
  }

  if (digits.length < 10) {
    return { ok: false, error: "Terlalu pendek" };
  }

  if (digits.length > 15) {
    return { ok: false, error: "Maksimal 15 digit" };
  }

  return { ok: true, phone: digits };
}

/* =========================
   TO DISPLAY (FROM DB / ON BLUR)
08xx xxx → 08xx xxx
10 digit: 0812 345678
11 digit: 0812 3456 789
12 digit: 0812 3456 7890
========================= */
export function phoneToDisplay(phone: string | null | undefined): string {
  if (!phone) return "";
  
  const digits = phone.replace(/\D/g, "");
  
  // Mobile: 62812xxx → 08xx
  if (digits.startsWith("62") && digits.charAt(2) === "8") {
    const num = digits.replace("62", "0");
    const first4 = num.slice(0, 4);
    const rest = num.slice(4);
    
    // 11 digit: 0897 4342 999
    if (rest.length === 7) {
      return `${first4} ${rest.slice(0, 4)} ${rest.slice(4)}`;
    }
    // 12 digit: 0897 4342 9999
    if (rest.length === 8) {
      return `${first4} ${rest.slice(0, 4)} ${rest.slice(4)}`;
    }
    // Default
    return rest ? `${first4} ${rest}` : first4;
  }
  
  // Mobile: 08xx
  if (digits.startsWith("08")) {
    const first4 = digits.slice(0, 4);
    const rest = digits.slice(4);
    
    // 11 digit
    if (rest.length === 7) {
      return `${first4} ${rest.slice(0, 4)} ${rest.slice(4)}`;
    }
    // 12 digit
    if (rest.length === 8) {
      return `${first4} ${rest.slice(0, 4)} ${rest.slice(4)}`;
    }
    return rest ? `${first4} ${rest}` : first4;
  }
  
  // Kantor: 021xxx → (021) xxx
  if (digits.startsWith("02")) {
    const first3 = digits.slice(0, 3);
    const rest = digits.slice(3);
    return rest ? `(${first3}) ${rest}` : first3;
  }
  
  return phone;
}

/* =========================
   TO SAVE (ON BLUR)
08xx → 62xx
02xx → tetap
========================= */
export function phoneToSave(phone: string): string {
  return normalizePhone("62", phone);
}

/* =========================
   TO INDEX
========================= */
export function phoneToIndex(countryCode: string, value: string): string {
  return normalizePhone(countryCode, value);
}