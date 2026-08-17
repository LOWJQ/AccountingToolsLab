import { currencyOptions, type CurrencyOption } from "./currency";

/**
 * Display names and countries, used only to render and filter the currency
 * dropdown. Split out of lib/currency.ts so the bytes load when someone opens
 * the selector rather than on every page view. Keyed by the codes in
 * lib/currency.ts; tests/currency.test.ts asserts the two agree.
 */
const currencyDetails: Record<string, { name: string; countries: readonly string[] }> = {
  AED: { name: "UAE dirham", countries: ["United Arab Emirates"] },
  AFN: { name: "Afghan afghani", countries: ["Afghanistan"] },
  ALL: { name: "Albanian lek", countries: ["Albania"] },
  AMD: { name: "Armenian dram", countries: ["Armenia"] },
  ANG: { name: "Netherlands Antillean guilder", countries: ["Curaçao", "Sint Maarten"] },
  AOA: { name: "Angolan kwanza", countries: ["Angola"] },
  ARS: { name: "Argentine peso", countries: ["Argentina"] },
  AUD: { name: "Australian dollar", countries: ["Australia", "Christmas Island", "Cocos Islands", "Kiribati", "Nauru", "Norfolk Island", "Tuvalu"] },
  AWG: { name: "Aruban florin", countries: ["Aruba"] },
  AZN: { name: "Azerbaijani manat", countries: ["Azerbaijan"] },
  BAM: { name: "Bosnia and Herzegovina convertible mark", countries: ["Bosnia and Herzegovina"] },
  BBD: { name: "Barbadian dollar", countries: ["Barbados"] },
  BDT: { name: "Bangladeshi taka", countries: ["Bangladesh"] },
  BGN: { name: "Bulgarian lev", countries: ["Bulgaria"] },
  BHD: { name: "Bahraini dinar", countries: ["Bahrain"] },
  BIF: { name: "Burundian franc", countries: ["Burundi"] },
  BMD: { name: "Bermudian dollar", countries: ["Bermuda"] },
  BND: { name: "Brunei dollar", countries: ["Brunei"] },
  BOB: { name: "Bolivian boliviano", countries: ["Bolivia"] },
  BRL: { name: "Brazilian real", countries: ["Brazil"] },
  BSD: { name: "Bahamian dollar", countries: ["Bahamas"] },
  BTN: { name: "Bhutanese ngultrum", countries: ["Bhutan"] },
  BWP: { name: "Botswana pula", countries: ["Botswana"] },
  BYN: { name: "Belarusian ruble", countries: ["Belarus"] },
  BZD: { name: "Belize dollar", countries: ["Belize"] },
  CAD: { name: "Canadian dollar", countries: ["Canada"] },
  CDF: { name: "Congolese franc", countries: ["Democratic Republic of the Congo"] },
  CHF: { name: "Swiss franc", countries: ["Switzerland", "Liechtenstein"] },
  CLP: { name: "Chilean peso", countries: ["Chile"] },
  CNY: { name: "Chinese yuan", countries: ["China"] },
  COP: { name: "Colombian peso", countries: ["Colombia"] },
  CRC: { name: "Costa Rican colón", countries: ["Costa Rica"] },
  CUP: { name: "Cuban peso", countries: ["Cuba"] },
  CVE: { name: "Cape Verdean escudo", countries: ["Cape Verde"] },
  CZK: { name: "Czech koruna", countries: ["Czechia"] },
  DJF: { name: "Djiboutian franc", countries: ["Djibouti"] },
  DKK: { name: "Danish krone", countries: ["Denmark", "Greenland", "Faroe Islands"] },
  DOP: { name: "Dominican peso", countries: ["Dominican Republic"] },
  DZD: { name: "Algerian dinar", countries: ["Algeria"] },
  EGP: { name: "Egyptian pound", countries: ["Egypt"] },
  ERN: { name: "Eritrean nakfa", countries: ["Eritrea"] },
  ETB: { name: "Ethiopian birr", countries: ["Ethiopia"] },
  EUR: { name: "Euro", countries: ["Eurozone", "European Union"] },
  FJD: { name: "Fijian dollar", countries: ["Fiji"] },
  FKP: { name: "Falkland Islands pound", countries: ["Falkland Islands"] },
  GBP: { name: "British pound sterling", countries: ["United Kingdom"] },
  GEL: { name: "Georgian lari", countries: ["Georgia"] },
  GHS: { name: "Ghanaian cedi", countries: ["Ghana"] },
  GIP: { name: "Gibraltar pound", countries: ["Gibraltar"] },
  GMD: { name: "Gambian dalasi", countries: ["Gambia"] },
  GNF: { name: "Guinean franc", countries: ["Guinea"] },
  GTQ: { name: "Guatemalan quetzal", countries: ["Guatemala"] },
  GYD: { name: "Guyanese dollar", countries: ["Guyana"] },
  HKD: { name: "Hong Kong dollar", countries: ["Hong Kong"] },
  HNL: { name: "Honduran lempira", countries: ["Honduras"] },
  HTG: { name: "Haitian gourde", countries: ["Haiti"] },
  HUF: { name: "Hungarian forint", countries: ["Hungary"] },
  IDR: { name: "Indonesian rupiah", countries: ["Indonesia"] },
  ILS: { name: "Israeli new shekel", countries: ["Israel", "Palestinian territories"] },
  INR: { name: "Indian rupee", countries: ["India", "Bhutan"] },
  IQD: { name: "Iraqi dinar", countries: ["Iraq"] },
  IRR: { name: "Iranian rial", countries: ["Iran"] },
  ISK: { name: "Icelandic króna", countries: ["Iceland"] },
  JMD: { name: "Jamaican dollar", countries: ["Jamaica"] },
  JOD: { name: "Jordanian dinar", countries: ["Jordan"] },
  JPY: { name: "Japanese yen", countries: ["Japan"] },
  KES: { name: "Kenyan shilling", countries: ["Kenya"] },
  KGS: { name: "Kyrgyzstani som", countries: ["Kyrgyzstan"] },
  KHR: { name: "Cambodian riel", countries: ["Cambodia"] },
  KMF: { name: "Comorian franc", countries: ["Comoros"] },
  KRW: { name: "South Korean won", countries: ["South Korea"] },
  KWD: { name: "Kuwaiti dinar", countries: ["Kuwait"] },
  KYD: { name: "Cayman Islands dollar", countries: ["Cayman Islands"] },
  KZT: { name: "Kazakhstani tenge", countries: ["Kazakhstan"] },
  LAK: { name: "Lao kip", countries: ["Laos"] },
  LBP: { name: "Lebanese pound", countries: ["Lebanon"] },
  LKR: { name: "Sri Lankan rupee", countries: ["Sri Lanka"] },
  LRD: { name: "Liberian dollar", countries: ["Liberia"] },
  LSL: { name: "Lesotho loti", countries: ["Lesotho"] },
  LYD: { name: "Libyan dinar", countries: ["Libya"] },
  MAD: { name: "Moroccan dirham", countries: ["Morocco", "Western Sahara"] },
  MDL: { name: "Moldovan leu", countries: ["Moldova"] },
  MGA: { name: "Malagasy ariary", countries: ["Madagascar"] },
  MKD: { name: "Macedonian denar", countries: ["North Macedonia"] },
  MMK: { name: "Myanmar kyat", countries: ["Myanmar"] },
  MNT: { name: "Mongolian tögrög", countries: ["Mongolia"] },
  MOP: { name: "Macanese pataca", countries: ["Macau"] },
  MRU: { name: "Mauritanian ouguiya", countries: ["Mauritania"] },
  MUR: { name: "Mauritian rupee", countries: ["Mauritius"] },
  MVR: { name: "Maldivian rufiyaa", countries: ["Maldives"] },
  MWK: { name: "Malawian kwacha", countries: ["Malawi"] },
  MXN: { name: "Mexican peso", countries: ["Mexico"] },
  MYR: { name: "Malaysian ringgit", countries: ["Malaysia"] },
  MZN: { name: "Mozambican metical", countries: ["Mozambique"] },
  NAD: { name: "Namibian dollar", countries: ["Namibia"] },
  NGN: { name: "Nigerian naira", countries: ["Nigeria"] },
  NIO: { name: "Nicaraguan córdoba", countries: ["Nicaragua"] },
  NOK: { name: "Norwegian krone", countries: ["Norway", "Svalbard and Jan Mayen"] },
  NPR: { name: "Nepalese rupee", countries: ["Nepal"] },
  NZD: { name: "New Zealand dollar", countries: ["New Zealand", "Cook Islands", "Niue", "Pitcairn Islands", "Tokelau"] },
  OMR: { name: "Omani rial", countries: ["Oman"] },
  PAB: { name: "Panamanian balboa", countries: ["Panama"] },
  PEN: { name: "Peruvian sol", countries: ["Peru"] },
  PGK: { name: "Papua New Guinean kina", countries: ["Papua New Guinea"] },
  PHP: { name: "Philippine peso", countries: ["Philippines"] },
  PKR: { name: "Pakistani rupee", countries: ["Pakistan"] },
  PLN: { name: "Polish złoty", countries: ["Poland"] },
  PYG: { name: "Paraguayan guaraní", countries: ["Paraguay"] },
  QAR: { name: "Qatari riyal", countries: ["Qatar"] },
  RON: { name: "Romanian leu", countries: ["Romania"] },
  RSD: { name: "Serbian dinar", countries: ["Serbia"] },
  RUB: { name: "Russian ruble", countries: ["Russia"] },
  RWF: { name: "Rwandan franc", countries: ["Rwanda"] },
  SAR: { name: "Saudi riyal", countries: ["Saudi Arabia"] },
  SBD: { name: "Solomon Islands dollar", countries: ["Solomon Islands"] },
  SCR: { name: "Seychellois rupee", countries: ["Seychelles"] },
  SDG: { name: "Sudanese pound", countries: ["Sudan"] },
  SEK: { name: "Swedish krona", countries: ["Sweden"] },
  SGD: { name: "Singapore dollar", countries: ["Singapore"] },
  SHP: { name: "Saint Helena pound", countries: ["Saint Helena", "Ascension", "Tristan da Cunha"] },
  SLE: { name: "Sierra Leonean leone", countries: ["Sierra Leone"] },
  SOS: { name: "Somali shilling", countries: ["Somalia"] },
  SRD: { name: "Surinamese dollar", countries: ["Suriname"] },
  SSP: { name: "South Sudanese pound", countries: ["South Sudan"] },
  STN: { name: "São Tomé and Príncipe dobra", countries: ["São Tomé and Príncipe"] },
  SYP: { name: "Syrian pound", countries: ["Syria"] },
  SZL: { name: "Swazi lilangeni", countries: ["Eswatini"] },
  THB: { name: "Thai baht", countries: ["Thailand"] },
  TJS: { name: "Tajikistani somoni", countries: ["Tajikistan"] },
  TMT: { name: "Turkmenistani manat", countries: ["Turkmenistan"] },
  TND: { name: "Tunisian dinar", countries: ["Tunisia"] },
  TOP: { name: "Tongan paʻanga", countries: ["Tonga"] },
  TRY: { name: "Turkish lira", countries: ["Türkiye"] },
  TTD: { name: "Trinidad and Tobago dollar", countries: ["Trinidad and Tobago"] },
  TWD: { name: "New Taiwan dollar", countries: ["Taiwan"] },
  TZS: { name: "Tanzanian shilling", countries: ["Tanzania"] },
  UAH: { name: "Ukrainian hryvnia", countries: ["Ukraine"] },
  UGX: { name: "Ugandan shilling", countries: ["Uganda"] },
  USD: { name: "United States dollar", countries: ["United States", "Ecuador", "El Salvador", "Panama", "Timor-Leste", "Zimbabwe"] },
  UYU: { name: "Uruguayan peso", countries: ["Uruguay"] },
  UZS: { name: "Uzbekistani som", countries: ["Uzbekistan"] },
  VES: { name: "Venezuelan bolívar", countries: ["Venezuela"] },
  VND: { name: "Vietnamese đồng", countries: ["Vietnam"] },
  VUV: { name: "Vanuatu vatu", countries: ["Vanuatu"] },
  WST: { name: "Samoan tālā", countries: ["Samoa"] },
  XAF: { name: "Central African CFA franc", countries: ["Cameroon", "Central African Republic", "Chad", "Republic of the Congo", "Equatorial Guinea", "Gabon"] },
  XCD: { name: "East Caribbean dollar", countries: ["Antigua and Barbuda", "Dominica", "Grenada", "Montserrat", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines"] },
  XOF: { name: "West African CFA franc", countries: ["Benin", "Burkina Faso", "Côte d'Ivoire", "Guinea-Bissau", "Mali", "Niger", "Senegal", "Togo"] },
  XPF: { name: "CFP franc", countries: ["French Polynesia", "New Caledonia", "Wallis and Futuna"] },
  YER: { name: "Yemeni rial", countries: ["Yemen"] },
  ZAR: { name: "South African rand", countries: ["South Africa", "Lesotho", "Namibia", "Eswatini"] },
  ZMW: { name: "Zambian kwacha", countries: ["Zambia"] },
  ZWG: { name: "Zimbabwe gold", countries: ["Zimbabwe"] }
};

/** Every currency with its search metadata, in the selector's display order. */
export function getSearchableCurrencies(): CurrencyOption[] {
  return currencyOptions.map((option) => {
    const detail = currencyDetails[option.code];

    return {
      ...option,
      name: detail?.name ?? option.code,
      countries: detail?.countries ?? []
    };
  });
}

export function searchCurrencies(query: string): CurrencyOption[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const options = getSearchableCurrencies();

  if (!normalizedQuery) {
    return options;
  }

  return options.filter((option) => {
    const searchableText = [option.code, option.name, option.symbol, ...option.countries]
      .join(" ")
      .toLocaleLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

/** Codes carrying search metadata, so a drift test can compare the two files. */
export const currencyDetailCodes = Object.keys(currencyDetails);
