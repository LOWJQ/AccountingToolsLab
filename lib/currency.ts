export type CurrencyOption = {
  code: string;
  name: string;
  symbol: string;
  countries: readonly string[];
  locale: string;
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
  { code: "AED", name: "UAE dirham", symbol: "د.إ", countries: ["United Arab Emirates"], locale: "en-AE" },
  { code: "AFN", name: "Afghan afghani", symbol: "؋", countries: ["Afghanistan"], locale: "fa-AF" },
  { code: "ALL", name: "Albanian lek", symbol: "L", countries: ["Albania"], locale: "sq-AL" },
  { code: "AMD", name: "Armenian dram", symbol: "֏", countries: ["Armenia"], locale: "hy-AM" },
  { code: "ANG", name: "Netherlands Antillean guilder", symbol: "ƒ", countries: ["Curaçao", "Sint Maarten"], locale: "nl-CW" },
  { code: "AOA", name: "Angolan kwanza", symbol: "Kz", countries: ["Angola"], locale: "pt-AO" },
  { code: "ARS", name: "Argentine peso", symbol: "$", countries: ["Argentina"], locale: "es-AR" },
  { code: "AUD", name: "Australian dollar", symbol: "A$", countries: ["Australia", "Christmas Island", "Cocos Islands", "Kiribati", "Nauru", "Norfolk Island", "Tuvalu"], locale: "en-AU" },
  { code: "AWG", name: "Aruban florin", symbol: "ƒ", countries: ["Aruba"], locale: "nl-AW" },
  { code: "AZN", name: "Azerbaijani manat", symbol: "₼", countries: ["Azerbaijan"], locale: "az-AZ" },
  { code: "BAM", name: "Bosnia and Herzegovina convertible mark", symbol: "KM", countries: ["Bosnia and Herzegovina"], locale: "bs-BA" },
  { code: "BBD", name: "Barbadian dollar", symbol: "Bds$", countries: ["Barbados"], locale: "en-BB" },
  { code: "BDT", name: "Bangladeshi taka", symbol: "৳", countries: ["Bangladesh"], locale: "bn-BD" },
  { code: "BGN", name: "Bulgarian lev", symbol: "лв", countries: ["Bulgaria"], locale: "bg-BG" },
  { code: "BHD", name: "Bahraini dinar", symbol: "BD", countries: ["Bahrain"], locale: "ar-BH" },
  { code: "BIF", name: "Burundian franc", symbol: "FBu", countries: ["Burundi"], locale: "fr-BI" },
  { code: "BMD", name: "Bermudian dollar", symbol: "BD$", countries: ["Bermuda"], locale: "en-BM" },
  { code: "BND", name: "Brunei dollar", symbol: "B$", countries: ["Brunei"], locale: "ms-BN" },
  { code: "BOB", name: "Bolivian boliviano", symbol: "Bs.", countries: ["Bolivia"], locale: "es-BO" },
  { code: "BRL", name: "Brazilian real", symbol: "R$", countries: ["Brazil"], locale: "pt-BR" },
  { code: "BSD", name: "Bahamian dollar", symbol: "B$", countries: ["Bahamas"], locale: "en-BS" },
  { code: "BTN", name: "Bhutanese ngultrum", symbol: "Nu.", countries: ["Bhutan"], locale: "dz-BT" },
  { code: "BWP", name: "Botswana pula", symbol: "P", countries: ["Botswana"], locale: "en-BW" },
  { code: "BYN", name: "Belarusian ruble", symbol: "Br", countries: ["Belarus"], locale: "be-BY" },
  { code: "BZD", name: "Belize dollar", symbol: "BZ$", countries: ["Belize"], locale: "en-BZ" },
  { code: "CAD", name: "Canadian dollar", symbol: "C$", countries: ["Canada"], locale: "en-CA" },
  { code: "CDF", name: "Congolese franc", symbol: "FC", countries: ["Democratic Republic of the Congo"], locale: "fr-CD" },
  { code: "CHF", name: "Swiss franc", symbol: "CHF", countries: ["Switzerland", "Liechtenstein"], locale: "de-CH" },
  { code: "CLP", name: "Chilean peso", symbol: "$", countries: ["Chile"], locale: "es-CL" },
  { code: "CNY", name: "Chinese yuan", symbol: "¥", countries: ["China"], locale: "zh-CN" },
  { code: "COP", name: "Colombian peso", symbol: "$", countries: ["Colombia"], locale: "es-CO" },
  { code: "CRC", name: "Costa Rican colón", symbol: "₡", countries: ["Costa Rica"], locale: "es-CR" },
  { code: "CUP", name: "Cuban peso", symbol: "$", countries: ["Cuba"], locale: "es-CU" },
  { code: "CVE", name: "Cape Verdean escudo", symbol: "$", countries: ["Cape Verde"], locale: "pt-CV" },
  { code: "CZK", name: "Czech koruna", symbol: "Kč", countries: ["Czechia"], locale: "cs-CZ" },
  { code: "DJF", name: "Djiboutian franc", symbol: "Fdj", countries: ["Djibouti"], locale: "fr-DJ" },
  { code: "DKK", name: "Danish krone", symbol: "kr", countries: ["Denmark", "Greenland", "Faroe Islands"], locale: "da-DK" },
  { code: "DOP", name: "Dominican peso", symbol: "RD$", countries: ["Dominican Republic"], locale: "es-DO" },
  { code: "DZD", name: "Algerian dinar", symbol: "DA", countries: ["Algeria"], locale: "ar-DZ" },
  { code: "EGP", name: "Egyptian pound", symbol: "E£", countries: ["Egypt"], locale: "ar-EG" },
  { code: "ERN", name: "Eritrean nakfa", symbol: "Nfk", countries: ["Eritrea"], locale: "ti-ER" },
  { code: "ETB", name: "Ethiopian birr", symbol: "Br", countries: ["Ethiopia"], locale: "am-ET" },
  { code: "EUR", name: "Euro", symbol: "€", countries: ["Eurozone", "European Union"], locale: "de-DE" },
  { code: "FJD", name: "Fijian dollar", symbol: "FJ$", countries: ["Fiji"], locale: "en-FJ" },
  { code: "FKP", name: "Falkland Islands pound", symbol: "£", countries: ["Falkland Islands"], locale: "en-FK" },
  { code: "GBP", name: "British pound sterling", symbol: "£", countries: ["United Kingdom"], locale: "en-GB" },
  { code: "GEL", name: "Georgian lari", symbol: "₾", countries: ["Georgia"], locale: "ka-GE" },
  { code: "GHS", name: "Ghanaian cedi", symbol: "GH₵", countries: ["Ghana"], locale: "en-GH" },
  { code: "GIP", name: "Gibraltar pound", symbol: "£", countries: ["Gibraltar"], locale: "en-GI" },
  { code: "GMD", name: "Gambian dalasi", symbol: "D", countries: ["Gambia"], locale: "en-GM" },
  { code: "GNF", name: "Guinean franc", symbol: "FG", countries: ["Guinea"], locale: "fr-GN" },
  { code: "GTQ", name: "Guatemalan quetzal", symbol: "Q", countries: ["Guatemala"], locale: "es-GT" },
  { code: "GYD", name: "Guyanese dollar", symbol: "G$", countries: ["Guyana"], locale: "en-GY" },
  { code: "HKD", name: "Hong Kong dollar", symbol: "HK$", countries: ["Hong Kong"], locale: "zh-HK" },
  { code: "HNL", name: "Honduran lempira", symbol: "L", countries: ["Honduras"], locale: "es-HN" },
  { code: "HTG", name: "Haitian gourde", symbol: "G", countries: ["Haiti"], locale: "fr-HT" },
  { code: "HUF", name: "Hungarian forint", symbol: "Ft", countries: ["Hungary"], locale: "hu-HU" },
  { code: "IDR", name: "Indonesian rupiah", symbol: "Rp", countries: ["Indonesia"], locale: "id-ID" },
  { code: "ILS", name: "Israeli new shekel", symbol: "₪", countries: ["Israel", "Palestinian territories"], locale: "he-IL" },
  { code: "INR", name: "Indian rupee", symbol: "₹", countries: ["India", "Bhutan"], locale: "en-IN" },
  { code: "IQD", name: "Iraqi dinar", symbol: "ع.د", countries: ["Iraq"], locale: "ar-IQ" },
  { code: "IRR", name: "Iranian rial", symbol: "﷼", countries: ["Iran"], locale: "fa-IR" },
  { code: "ISK", name: "Icelandic króna", symbol: "kr", countries: ["Iceland"], locale: "is-IS" },
  { code: "JMD", name: "Jamaican dollar", symbol: "J$", countries: ["Jamaica"], locale: "en-JM" },
  { code: "JOD", name: "Jordanian dinar", symbol: "JD", countries: ["Jordan"], locale: "ar-JO" },
  { code: "JPY", name: "Japanese yen", symbol: "¥", countries: ["Japan"], locale: "ja-JP" },
  { code: "KES", name: "Kenyan shilling", symbol: "KSh", countries: ["Kenya"], locale: "en-KE" },
  { code: "KGS", name: "Kyrgyzstani som", symbol: "с", countries: ["Kyrgyzstan"], locale: "ky-KG" },
  { code: "KHR", name: "Cambodian riel", symbol: "៛", countries: ["Cambodia"], locale: "km-KH" },
  { code: "KMF", name: "Comorian franc", symbol: "CF", countries: ["Comoros"], locale: "fr-KM" },
  { code: "KRW", name: "South Korean won", symbol: "₩", countries: ["South Korea"], locale: "ko-KR" },
  { code: "KWD", name: "Kuwaiti dinar", symbol: "KD", countries: ["Kuwait"], locale: "ar-KW" },
  { code: "KYD", name: "Cayman Islands dollar", symbol: "CI$", countries: ["Cayman Islands"], locale: "en-KY" },
  { code: "KZT", name: "Kazakhstani tenge", symbol: "₸", countries: ["Kazakhstan"], locale: "kk-KZ" },
  { code: "LAK", name: "Lao kip", symbol: "₭", countries: ["Laos"], locale: "lo-LA" },
  { code: "LBP", name: "Lebanese pound", symbol: "ل.ل", countries: ["Lebanon"], locale: "ar-LB" },
  { code: "LKR", name: "Sri Lankan rupee", symbol: "Rs", countries: ["Sri Lanka"], locale: "si-LK" },
  { code: "LRD", name: "Liberian dollar", symbol: "L$", countries: ["Liberia"], locale: "en-LR" },
  { code: "LSL", name: "Lesotho loti", symbol: "L", countries: ["Lesotho"], locale: "en-LS" },
  { code: "LYD", name: "Libyan dinar", symbol: "LD", countries: ["Libya"], locale: "ar-LY" },
  { code: "MAD", name: "Moroccan dirham", symbol: "DH", countries: ["Morocco", "Western Sahara"], locale: "ar-MA" },
  { code: "MDL", name: "Moldovan leu", symbol: "L", countries: ["Moldova"], locale: "ro-MD" },
  { code: "MGA", name: "Malagasy ariary", symbol: "Ar", countries: ["Madagascar"], locale: "fr-MG" },
  { code: "MKD", name: "Macedonian denar", symbol: "ден", countries: ["North Macedonia"], locale: "mk-MK" },
  { code: "MMK", name: "Myanmar kyat", symbol: "K", countries: ["Myanmar"], locale: "my-MM" },
  { code: "MNT", name: "Mongolian tögrög", symbol: "₮", countries: ["Mongolia"], locale: "mn-MN" },
  { code: "MOP", name: "Macanese pataca", symbol: "MOP$", countries: ["Macau"], locale: "zh-MO" },
  { code: "MRU", name: "Mauritanian ouguiya", symbol: "UM", countries: ["Mauritania"], locale: "ar-MR" },
  { code: "MUR", name: "Mauritian rupee", symbol: "Rs", countries: ["Mauritius"], locale: "en-MU" },
  { code: "MVR", name: "Maldivian rufiyaa", symbol: "Rf", countries: ["Maldives"], locale: "dv-MV" },
  { code: "MWK", name: "Malawian kwacha", symbol: "MK", countries: ["Malawi"], locale: "en-MW" },
  { code: "MXN", name: "Mexican peso", symbol: "Mex$", countries: ["Mexico"], locale: "es-MX" },
  { code: "MYR", name: "Malaysian ringgit", symbol: "RM", countries: ["Malaysia"], locale: "en-MY" },
  { code: "MZN", name: "Mozambican metical", symbol: "MT", countries: ["Mozambique"], locale: "pt-MZ" },
  { code: "NAD", name: "Namibian dollar", symbol: "N$", countries: ["Namibia"], locale: "en-NA" },
  { code: "NGN", name: "Nigerian naira", symbol: "₦", countries: ["Nigeria"], locale: "en-NG" },
  { code: "NIO", name: "Nicaraguan córdoba", symbol: "C$", countries: ["Nicaragua"], locale: "es-NI" },
  { code: "NOK", name: "Norwegian krone", symbol: "kr", countries: ["Norway", "Svalbard and Jan Mayen"], locale: "nb-NO" },
  { code: "NPR", name: "Nepalese rupee", symbol: "रू", countries: ["Nepal"], locale: "ne-NP" },
  { code: "NZD", name: "New Zealand dollar", symbol: "NZ$", countries: ["New Zealand", "Cook Islands", "Niue", "Pitcairn Islands", "Tokelau"], locale: "en-NZ" },
  { code: "OMR", name: "Omani rial", symbol: "OMR", countries: ["Oman"], locale: "ar-OM" },
  { code: "PAB", name: "Panamanian balboa", symbol: "B/.", countries: ["Panama"], locale: "es-PA" },
  { code: "PEN", name: "Peruvian sol", symbol: "S/", countries: ["Peru"], locale: "es-PE" },
  { code: "PGK", name: "Papua New Guinean kina", symbol: "K", countries: ["Papua New Guinea"], locale: "en-PG" },
  { code: "PHP", name: "Philippine peso", symbol: "₱", countries: ["Philippines"], locale: "en-PH" },
  { code: "PKR", name: "Pakistani rupee", symbol: "Rs", countries: ["Pakistan"], locale: "en-PK" },
  { code: "PLN", name: "Polish złoty", symbol: "zł", countries: ["Poland"], locale: "pl-PL" },
  { code: "PYG", name: "Paraguayan guaraní", symbol: "₲", countries: ["Paraguay"], locale: "es-PY" },
  { code: "QAR", name: "Qatari riyal", symbol: "QR", countries: ["Qatar"], locale: "ar-QA" },
  { code: "RON", name: "Romanian leu", symbol: "lei", countries: ["Romania"], locale: "ro-RO" },
  { code: "RSD", name: "Serbian dinar", symbol: "дин", countries: ["Serbia"], locale: "sr-RS" },
  { code: "RUB", name: "Russian ruble", symbol: "₽", countries: ["Russia"], locale: "ru-RU" },
  { code: "RWF", name: "Rwandan franc", symbol: "FRw", countries: ["Rwanda"], locale: "rw-RW" },
  { code: "SAR", name: "Saudi riyal", symbol: "SR", countries: ["Saudi Arabia"], locale: "ar-SA" },
  { code: "SBD", name: "Solomon Islands dollar", symbol: "SI$", countries: ["Solomon Islands"], locale: "en-SB" },
  { code: "SCR", name: "Seychellois rupee", symbol: "Rs", countries: ["Seychelles"], locale: "en-SC" },
  { code: "SDG", name: "Sudanese pound", symbol: "SDG", countries: ["Sudan"], locale: "ar-SD" },
  { code: "SEK", name: "Swedish krona", symbol: "kr", countries: ["Sweden"], locale: "sv-SE" },
  { code: "SGD", name: "Singapore dollar", symbol: "S$", countries: ["Singapore"], locale: "en-SG" },
  { code: "SHP", name: "Saint Helena pound", symbol: "£", countries: ["Saint Helena", "Ascension", "Tristan da Cunha"], locale: "en-SH" },
  { code: "SLE", name: "Sierra Leonean leone", symbol: "Le", countries: ["Sierra Leone"], locale: "en-SL" },
  { code: "SOS", name: "Somali shilling", symbol: "Sh", countries: ["Somalia"], locale: "so-SO" },
  { code: "SRD", name: "Surinamese dollar", symbol: "$", countries: ["Suriname"], locale: "nl-SR" },
  { code: "SSP", name: "South Sudanese pound", symbol: "SS£", countries: ["South Sudan"], locale: "en-SS" },
  { code: "STN", name: "São Tomé and Príncipe dobra", symbol: "Db", countries: ["São Tomé and Príncipe"], locale: "pt-ST" },
  { code: "SYP", name: "Syrian pound", symbol: "£", countries: ["Syria"], locale: "ar-SY" },
  { code: "SZL", name: "Swazi lilangeni", symbol: "L", countries: ["Eswatini"], locale: "en-SZ" },
  { code: "THB", name: "Thai baht", symbol: "฿", countries: ["Thailand"], locale: "th-TH" },
  { code: "TJS", name: "Tajikistani somoni", symbol: "SM", countries: ["Tajikistan"], locale: "tg-TJ" },
  { code: "TMT", name: "Turkmenistani manat", symbol: "m", countries: ["Turkmenistan"], locale: "tk-TM" },
  { code: "TND", name: "Tunisian dinar", symbol: "DT", countries: ["Tunisia"], locale: "ar-TN" },
  { code: "TOP", name: "Tongan paʻanga", symbol: "T$", countries: ["Tonga"], locale: "to-TO" },
  { code: "TRY", name: "Turkish lira", symbol: "₺", countries: ["Türkiye"], locale: "tr-TR" },
  { code: "TTD", name: "Trinidad and Tobago dollar", symbol: "TT$", countries: ["Trinidad and Tobago"], locale: "en-TT" },
  { code: "TWD", name: "New Taiwan dollar", symbol: "NT$", countries: ["Taiwan"], locale: "zh-TW" },
  { code: "TZS", name: "Tanzanian shilling", symbol: "TSh", countries: ["Tanzania"], locale: "sw-TZ" },
  { code: "UAH", name: "Ukrainian hryvnia", symbol: "₴", countries: ["Ukraine"], locale: "uk-UA" },
  { code: "UGX", name: "Ugandan shilling", symbol: "USh", countries: ["Uganda"], locale: "en-UG" },
  { code: "USD", name: "United States dollar", symbol: "$", countries: ["United States", "Ecuador", "El Salvador", "Panama", "Timor-Leste", "Zimbabwe"], locale: "en-US" },
  { code: "UYU", name: "Uruguayan peso", symbol: "$U", countries: ["Uruguay"], locale: "es-UY" },
  { code: "UZS", name: "Uzbekistani som", symbol: "soʻm", countries: ["Uzbekistan"], locale: "uz-UZ" },
  { code: "VES", name: "Venezuelan bolívar", symbol: "Bs.", countries: ["Venezuela"], locale: "es-VE" },
  { code: "VND", name: "Vietnamese đồng", symbol: "₫", countries: ["Vietnam"], locale: "vi-VN" },
  { code: "VUV", name: "Vanuatu vatu", symbol: "VT", countries: ["Vanuatu"], locale: "bi-VU" },
  { code: "WST", name: "Samoan tālā", symbol: "WS$", countries: ["Samoa"], locale: "en-WS" },
  { code: "XAF", name: "Central African CFA franc", symbol: "FCFA", countries: ["Cameroon", "Central African Republic", "Chad", "Republic of the Congo", "Equatorial Guinea", "Gabon"], locale: "fr-CM" },
  { code: "XCD", name: "East Caribbean dollar", symbol: "EC$", countries: ["Antigua and Barbuda", "Dominica", "Grenada", "Montserrat", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines"], locale: "en-AG" },
  { code: "XOF", name: "West African CFA franc", symbol: "CFA", countries: ["Benin", "Burkina Faso", "Côte d'Ivoire", "Guinea-Bissau", "Mali", "Niger", "Senegal", "Togo"], locale: "fr-SN" },
  { code: "XPF", name: "CFP franc", symbol: "₣", countries: ["French Polynesia", "New Caledonia", "Wallis and Futuna"], locale: "fr-PF" },
  { code: "YER", name: "Yemeni rial", symbol: "﷼", countries: ["Yemen"], locale: "ar-YE" },
  { code: "ZAR", name: "South African rand", symbol: "R", countries: ["South Africa", "Lesotho", "Namibia", "Eswatini"], locale: "en-ZA" },
  { code: "ZMW", name: "Zambian kwacha", symbol: "ZK", countries: ["Zambia"], locale: "en-ZM" },
  { code: "ZWG", name: "Zimbabwe gold", symbol: "ZiG", countries: ["Zimbabwe"], locale: "en-ZW" }
] as const satisfies readonly CurrencyOption[];

const currencyOptionByCode = new Map<string, CurrencyOption>(
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
] as readonly CurrencyOption[];

export type CurrencyCode = (typeof allCurrencyOptions)[number]["code"];

export const CURRENCY_CODES = currencyOptions.map((option) => option.code) as readonly CurrencyCode[];

export const defaultCurrency: CurrencyCode = "MYR";

export function getCurrencyOption(currency: string): CurrencyOption | undefined {
  return currencyOptionByCode.get(currency);
}

export function isCurrencyCode(value: string): value is CurrencyCode {
  return Boolean(getCurrencyOption(value));
}

export function getCompactCurrencyLabel(currency: string): string {
  const option = getCurrencyOption(currency);

  return option ? `${option.code} (${option.symbol})` : currency;
}

export function searchCurrencies(query: string): CurrencyOption[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return [...currencyOptions];
  }

  return currencyOptions.filter((option) => {
    const searchableText = [
      option.code,
      option.name,
      option.symbol,
      ...option.countries
    ]
      .join(" ")
      .toLocaleLowerCase();

    return searchableText.includes(normalizedQuery);
  });
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
