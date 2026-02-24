/**
 * Ordinal words (First, Second, ... TwoHundredth) for Bending Specializations.
 * Used to generate rank names like FirstFrontendBender, SecondFrontendBender, etc.
 */

const ORDINALS_1_TO_19: Record<number, string> = {
  1: "First", 2: "Second", 3: "Third", 4: "Fourth", 5: "Fifth",
  6: "Sixth", 7: "Seventh", 8: "Eighth", 9: "Ninth", 10: "Tenth",
  11: "Eleventh", 12: "Twelfth", 13: "Thirteenth", 14: "Fourteenth", 15: "Fifteenth",
  16: "Sixteenth", 17: "Seventeenth", 18: "Eighteenth", 19: "Nineteenth",
};

const TENS: Record<number, string> = {
  20: "Twenty", 30: "Thirty", 40: "Forty", 50: "Fifty",
  60: "Sixty", 70: "Seventy", 80: "Eighty", 90: "Ninety",
};

const TENS_ORDINAL: Record<number, string> = {
  20: "Twentieth", 30: "Thirtieth", 40: "Fortieth", 50: "Fiftieth",
  60: "Sixtieth", 70: "Seventieth", 80: "Eightieth", 90: "Ninetieth",
};

/** Returns ordinal word for n (1..200), e.g. 1 -> "First", 21 -> "TwentyFirst". */
export function getOrdinalWord(n: number): string {
  if (n < 1 || n > 200) return String(n);
  if (n <= 19) return ORDINALS_1_TO_19[n];
  if (n === 100) return "OneHundredth";
  if (n === 200) return "TwoHundredth";
  if (n < 100) {
    const tens = Math.floor(n / 10) * 10;
    const ones = n % 10;
    if (ones === 0) return TENS_ORDINAL[tens];
    return TENS[tens] + ORDINALS_1_TO_19[ones];
  }
  // 101-199
  const rest = n % 100;
  if (rest === 0) return "OneHundredth";
  return "OneHundred" + getOrdinalWord(rest);
}

/** Cached ordinals 1-200 for consistent display names. */
const ORDINAL_CACHE: string[] = Array.from({ length: 200 }, (_, i) => getOrdinalWord(i + 1));

export function getOrdinal(n: number): string {
  if (n >= 1 && n <= 200) return ORDINAL_CACHE[n - 1];
  return String(n);
}
