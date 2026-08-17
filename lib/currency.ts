/**
 * Eager currency core: only the fields needed to format an amount and label
 * the selector button. The search-only fields (display name, countries) live
 * in ./currency-search and load on demand, since they are needed just to
 * populate the dropdown. Keeping them out saves every page a couple of KB it
 * would otherwise download to render a privacy policy.
 *
 * lib/currency-search.ts is keyed by these codes; a test asserts the two stay
 * in sync so the split cannot silently drift.
 */
export type CurrencyCore = {
  code: string;
  symbol: string;
  locale: string;
};

/** A currency plus its search metadata, as rendered in the selector list. */
export type CurrencyOption = CurrencyCore & {
  name: string;
  countries: readonly string[];
};

const popularCurrencyCodes = [
  "MYR",
  "SGD",
  "USD",
  "EUR",
  "CNY",
  "TWD",
  "KRW",
  "JPY",
  "THB",
  "IDR"
] as const;

const allCurrencyOptions = [
  { code: "AED", symbol: "د.إ", locale: "en-AE" },
  { code: "AFN", symbol: "؋", locale: "fa-AF" },
  { code: "ALL", symbol: "L", locale: "sq-AL" },
  { code: "AMD", symbol: "֏", locale: "hy-AM" },
  { code: "ANG", symbol: "ƒ", locale: "nl-CW" },
  { code: "AOA", symbol: "Kz", locale: "pt-AO" },
  { code: "ARS", symbol: "$", locale: "es-AR" },
  { code: "AUD", symbol: "A$", locale: "en-AU" },
  { code: "AWG", symbol: "ƒ", locale: "nl-AW" },
  { code: "AZN", symbol: "₼", locale: "az-AZ" },
  { code: "BAM", symbol: "KM", locale: "bs-BA" },
  { code: "BBD", symbol: "Bds$", locale: "en-BB" },
  { code: "BDT", symbol: "৳", locale: "bn-BD" },
  { code: "BGN", symbol: "лв", locale: "bg-BG" },
  { code: "BHD", symbol: "BD", locale: "ar-BH" },
  { code: "BIF", symbol: "FBu", locale: "fr-BI" },
  { code: "BMD", symbol: "BD$", locale: "en-BM" },
  { code: "BND", symbol: "B$", locale: "ms-BN" },
  { code: "BOB", symbol: "Bs.", locale: "es-BO" },
  { code: "BRL", symbol: "R$", locale: "pt-BR" },
  { code: "BSD", symbol: "B$", locale: "en-BS" },
  { code: "BTN", symbol: "Nu.", locale: "dz-BT" },
  { code: "BWP", symbol: "P", locale: "en-BW" },
  { code: "BYN", symbol: "Br", locale: "be-BY" },
  { code: "BZD", symbol: "BZ$", locale: "en-BZ" },
  { code: "CAD", symbol: "C$", locale: "en-CA" },
  { code: "CDF", symbol: "FC", locale: "fr-CD" },
  { code: "CHF", symbol: "CHF", locale: "de-CH" },
  { code: "CLP", symbol: "$", locale: "es-CL" },
  { code: "CNY", symbol: "¥", locale: "zh-CN" },
  { code: "COP", symbol: "$", locale: "es-CO" },
  { code: "CRC", symbol: "₡", locale: "es-CR" },
  { code: "CUP", symbol: "$", locale: "es-CU" },
  { code: "CVE", symbol: "$", locale: "pt-CV" },
  { code: "CZK", symbol: "Kč", locale: "cs-CZ" },
  { code: "DJF", symbol: "Fdj", locale: "fr-DJ" },
  { code: "DKK", symbol: "kr", locale: "da-DK" },
  { code: "DOP", symbol: "RD$", locale: "es-DO" },
  { code: "DZD", symbol: "DA", locale: "ar-DZ" },
  { code: "EGP", symbol: "E£", locale: "ar-EG" },
  { code: "ERN", symbol: "Nfk", locale: "ti-ER" },
  { code: "ETB", symbol: "Br", locale: "am-ET" },
  { code: "EUR", symbol: "€", locale: "de-DE" },
  { code: "FJD", symbol: "FJ$", locale: "en-FJ" },
  { code: "FKP", symbol: "£", locale: "en-FK" },
  { code: "GBP", symbol: "£", locale: "en-GB" },
  { code: "GEL", symbol: "₾", locale: "ka-GE" },
  { code: "GHS", symbol: "GH₵", locale: "en-GH" },
  { code: "GIP", symbol: "£", locale: "en-GI" },
  { code: "GMD", symbol: "D", locale: "en-GM" },
  { code: "GNF", symbol: "FG", locale: "fr-GN" },
  { code: "GTQ", symbol: "Q", locale: "es-GT" },
  { code: "GYD", symbol: "G$", locale: "en-GY" },
  { code: "HKD", symbol: "HK$", locale: "zh-HK" },
  { code: "HNL", symbol: "L", locale: "es-HN" },
  { code: "HTG", symbol: "G", locale: "fr-HT" },
  { code: "HUF", symbol: "Ft", locale: "hu-HU" },
  { code: "IDR", symbol: "Rp", locale: "id-ID" },
  { code: "ILS", symbol: "₪", locale: "he-IL" },
  { code: "INR", symbol: "₹", locale: "en-IN" },
  { code: "IQD", symbol: "ع.د", locale: "ar-IQ" },
  { code: "IRR", symbol: "﷼", locale: "fa-IR" },
  { code: "ISK", symbol: "kr", locale: "is-IS" },
  { code: "JMD", symbol: "J$", locale: "en-JM" },
  { code: "JOD", symbol: "JD", locale: "ar-JO" },
  { code: "JPY", symbol: "¥", locale: "ja-JP" },
  { code: "KES", symbol: "KSh", locale: "en-KE" },
  { code: "KGS", symbol: "с", locale: "ky-KG" },
  { code: "KHR", symbol: "៛", locale: "km-KH" },
  { code: "KMF", symbol: "CF", locale: "fr-KM" },
  { code: "KRW", symbol: "₩", locale: "ko-KR" },
  { code: "KWD", symbol: "KD", locale: "ar-KW" },
  { code: "KYD", symbol: "CI$", locale: "en-KY" },
  { code: "KZT", symbol: "₸", locale: "kk-KZ" },
  { code: "LAK", symbol: "₭", locale: "lo-LA" },
  { code: "LBP", symbol: "ل.ل", locale: "ar-LB" },
  { code: "LKR", symbol: "Rs", locale: "si-LK" },
  { code: "LRD", symbol: "L$", locale: "en-LR" },
  { code: "LSL", symbol: "L", locale: "en-LS" },
  { code: "LYD", symbol: "LD", locale: "ar-LY" },
  { code: "MAD", symbol: "DH", locale: "ar-MA" },
  { code: "MDL", symbol: "L", locale: "ro-MD" },
  { code: "MGA", symbol: "Ar", locale: "fr-MG" },
  { code: "MKD", symbol: "ден", locale: "mk-MK" },
  { code: "MMK", symbol: "K", locale: "my-MM" },
  { code: "MNT", symbol: "₮", locale: "mn-MN" },
  { code: "MOP", symbol: "MOP$", locale: "zh-MO" },
  { code: "MRU", symbol: "UM", locale: "ar-MR" },
  { code: "MUR", symbol: "Rs", locale: "en-MU" },
  { code: "MVR", symbol: "Rf", locale: "dv-MV" },
  { code: "MWK", symbol: "MK", locale: "en-MW" },
  { code: "MXN", symbol: "Mex$", locale: "es-MX" },
  { code: "MYR", symbol: "RM", locale: "en-MY" },
  { code: "MZN", symbol: "MT", locale: "pt-MZ" },
  { code: "NAD", symbol: "N$", locale: "en-NA" },
  { code: "NGN", symbol: "₦", locale: "en-NG" },
  { code: "NIO", symbol: "C$", locale: "es-NI" },
  { code: "NOK", symbol: "kr", locale: "nb-NO" },
  { code: "NPR", symbol: "रू", locale: "ne-NP" },
  { code: "NZD", symbol: "NZ$", locale: "en-NZ" },
  { code: "OMR", symbol: "OMR", locale: "ar-OM" },
  { code: "PAB", symbol: "B/.", locale: "es-PA" },
  { code: "PEN", symbol: "S/", locale: "es-PE" },
  { code: "PGK", symbol: "K", locale: "en-PG" },
  { code: "PHP", symbol: "₱", locale: "en-PH" },
  { code: "PKR", symbol: "Rs", locale: "en-PK" },
  { code: "PLN", symbol: "zł", locale: "pl-PL" },
  { code: "PYG", symbol: "₲", locale: "es-PY" },
  { code: "QAR", symbol: "QR", locale: "ar-QA" },
  { code: "RON", symbol: "lei", locale: "ro-RO" },
  { code: "RSD", symbol: "дин", locale: "sr-RS" },
  { code: "RUB", symbol: "₽", locale: "ru-RU" },
  { code: "RWF", symbol: "FRw", locale: "rw-RW" },
  { code: "SAR", symbol: "SR", locale: "ar-SA" },
  { code: "SBD", symbol: "SI$", locale: "en-SB" },
  { code: "SCR", symbol: "Rs", locale: "en-SC" },
  { code: "SDG", symbol: "SDG", locale: "ar-SD" },
  { code: "SEK", symbol: "kr", locale: "sv-SE" },
  { code: "SGD", symbol: "S$", locale: "en-SG" },
  { code: "SHP", symbol: "£", locale: "en-SH" },
  { code: "SLE", symbol: "Le", locale: "en-SL" },
  { code: "SOS", symbol: "Sh", locale: "so-SO" },
  { code: "SRD", symbol: "$", locale: "nl-SR" },
  { code: "SSP", symbol: "SS£", locale: "en-SS" },
  { code: "STN", symbol: "Db", locale: "pt-ST" },
  { code: "SYP", symbol: "£", locale: "ar-SY" },
  { code: "SZL", symbol: "L", locale: "en-SZ" },
  { code: "THB", symbol: "฿", locale: "th-TH" },
  { code: "TJS", symbol: "SM", locale: "tg-TJ" },
  { code: "TMT", symbol: "m", locale: "tk-TM" },
  { code: "TND", symbol: "DT", locale: "ar-TN" },
  { code: "TOP", symbol: "T$", locale: "to-TO" },
  { code: "TRY", symbol: "₺", locale: "tr-TR" },
  { code: "TTD", symbol: "TT$", locale: "en-TT" },
  { code: "TWD", symbol: "NT$", locale: "zh-TW" },
  { code: "TZS", symbol: "TSh", locale: "sw-TZ" },
  { code: "UAH", symbol: "₴", locale: "uk-UA" },
  { code: "UGX", symbol: "USh", locale: "en-UG" },
  { code: "USD", symbol: "$", locale: "en-US" },
  { code: "UYU", symbol: "$U", locale: "es-UY" },
  { code: "UZS", symbol: "soʻm", locale: "uz-UZ" },
  { code: "VES", symbol: "Bs.", locale: "es-VE" },
  { code: "VND", symbol: "₫", locale: "vi-VN" },
  { code: "VUV", symbol: "VT", locale: "bi-VU" },
  { code: "WST", symbol: "WS$", locale: "en-WS" },
  { code: "XAF", symbol: "FCFA", locale: "fr-CM" },
  { code: "XCD", symbol: "EC$", locale: "en-AG" },
  { code: "XOF", symbol: "CFA", locale: "fr-SN" },
  { code: "XPF", symbol: "₣", locale: "fr-PF" },
  { code: "YER", symbol: "﷼", locale: "ar-YE" },
  { code: "ZAR", symbol: "R", locale: "en-ZA" },
  { code: "ZMW", symbol: "ZK", locale: "en-ZM" },
  { code: "ZWG", symbol: "ZiG", locale: "en-ZW" }
] as const satisfies readonly CurrencyCore[];

const currencyOptionByCode = new Map<string, CurrencyCore>(
  allCurrencyOptions.map((option) => [option.code, option])
);

const popularCurrencyOptions = popularCurrencyCodes.map((code) => {
  const option = currencyOptionByCode.get(code);

  if (!option) {
    throw new Error(`Missing popular currency ${code}.`);
  }

  return option;
});

const remainingCurrencyOptions = allCurrencyOptions
  .filter((option) => !popularCurrencyCodes.includes(option.code as (typeof popularCurrencyCodes)[number]))
  .sort((first, second) => first.code.localeCompare(second.code));

export const currencyOptions = [
  ...popularCurrencyOptions,
  ...remainingCurrencyOptions
] as readonly CurrencyCore[];

export type CurrencyCode = (typeof allCurrencyOptions)[number]["code"];

export const CURRENCY_CODES = currencyOptions.map((option) => option.code) as readonly CurrencyCode[];

export const defaultCurrency: CurrencyCode = "MYR";

export function getCurrencyOption(currency: string): CurrencyCore | undefined {
  return currencyOptionByCode.get(currency);
}

export function isCurrencyCode(value: string): value is CurrencyCode {
  return Boolean(getCurrencyOption(value));
}

export function getCompactCurrencyLabel(currency: string): string {
  const option = getCurrencyOption(currency);

  return option ? `${option.code} (${option.symbol})` : currency;
}

function formatCurrencyFallback(value: number, currency: string): string {
  const option = getCurrencyOption(currency);
  const prefix = option?.symbol ?? currency;

  return `${prefix} ${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

const MAX_CURRENCY_FORMATTER_CACHE_SIZE = 256;
const currencyFormatterCache = new Map<string, Intl.NumberFormat>();

function getCurrencyFormatter(
  locale: string,
  currency: string,
  options: Intl.NumberFormatOptions
): Intl.NumberFormat {
  const effectiveOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    ...options
  };
  const cacheKey = JSON.stringify([
    locale,
    Object.entries(effectiveOptions)
      .sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey))
      .map(([key, value]) => [key, typeof value, String(value)])
  ]);
  const cachedFormatter = currencyFormatterCache.get(cacheKey);

  if (cachedFormatter) {
    return cachedFormatter;
  }

  const formatter = new Intl.NumberFormat(locale, effectiveOptions);

  if (currencyFormatterCache.size >= MAX_CURRENCY_FORMATTER_CACHE_SIZE) {
    const oldestCacheKey = currencyFormatterCache.keys().next().value;

    if (oldestCacheKey !== undefined) {
      currencyFormatterCache.delete(oldestCacheKey);
    }
  }

  currencyFormatterCache.set(cacheKey, formatter);
  return formatter;
}

export function formatCurrency(
  value: number,
  currency: string = defaultCurrency,
  options: Intl.NumberFormatOptions = {}
): string {
  const config = getCurrencyOption(currency) ?? getCurrencyOption(defaultCurrency);
  const currencyCode = config?.code ?? defaultCurrency;

  try {
    return getCurrencyFormatter(config?.locale ?? "en-US", currencyCode, options)
      .formatToParts(value)
      .map((part) => (part.type === "currency" ? config?.symbol ?? currencyCode : part.value))
      .join("");
  } catch {
    return formatCurrencyFallback(value, currencyCode);
  }
}
