import type { DateFormat } from "./types";

const months: Record<string, number> = {
  jan: 1, january: 1, januari: 1, feb: 2, february: 2, februari: 2,
  mar: 3, march: 3, mac: 3, apr: 4, april: 4, may: 5, mei: 5,
  jun: 6, june: 6, jul: 7, july: 7, julai: 7, aug: 8, august: 8, ogo: 8, ogos: 8,
  sep: 9, sept: 9, september: 9, oct: 10, october: 10, okt: 10, oktober: 10,
  nov: 11, november: 11, dec: 12, december: 12, dis: 12, disember: 12
};
const numeric = /^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4}|\d{2})$/;
const namedDayFirst = /^(\d{1,2})[\s-]+([a-z]+)\.?[\s-]+(\d{4}|\d{2})$/i;
const namedMonthFirst = /^([a-z]+)\.?[\s-]+(\d{1,2}),?[\s-]+(\d{4}|\d{2})$/i;
const yearFirst = /^(\d{4})[/.\-](\d{1,2})[/.\-](\d{1,2})$/;

export function hasShortYear(value: string): boolean {
  const text = value.trim();
  return [text.match(numeric), text.match(namedDayFirst), text.match(namedMonthFirst)].some(parts => parts?.[3].length === 2);
}

/** Infer numeric order only when there is evidence. Month names and ISO dates
 * do not settle an ambiguous date such as 03/04/26 elsewhere in the file. */
export function inferDateFormat(values: string[]): DateFormat {
  const dates = values.map(value => value.trim()).filter(Boolean);
  const parts = dates.map(value => value.match(numeric)).filter((part): part is RegExpMatchArray => Boolean(part));
  if (parts.length) {
    const dayFirst = parts.some(part => Number(part[1]) > 12);
    const monthFirst = parts.some(part => Number(part[2]) > 12);
    return dayFirst && !monthFirst ? "dmy" : monthFirst && !dayFirst ? "mdy" : "";
  }
  if (dates.some(value => yearFirst.test(value))) return "iso";
  if (dates.some(value => namedDayFirst.test(value) || namedMonthFirst.test(value))) return "named";
  return "";
}

export function parseDate(value: string, format: DateFormat, century: 1900 | 2000 = 2000): { iso: string; day: number } | null {
  if (!format || (century !== 1900 && century !== 2000)) return null;
  const text = value.trim();
  let year = 0, month = 0, date = 0;
  const iso = text.match(yearFirst);
  const named = text.match(namedDayFirst);
  const monthFirst = text.match(namedMonthFirst);
  const parts = text.match(numeric);
  const fullYear = (yearText: string) => Number(yearText) + (yearText.length === 2 ? century : 0);
  if (iso) { year = Number(iso[1]); month = Number(iso[2]); date = Number(iso[3]); }
  else if (named) { year = fullYear(named[3]); month = months[named[2].toLowerCase()] ?? 0; date = Number(named[1]); }
  else if (monthFirst) { year = fullYear(monthFirst[3]); month = months[monthFirst[1].toLowerCase()] ?? 0; date = Number(monthFirst[2]); }
  else if (parts && (format === "dmy" || format === "mdy")) {
    year = fullYear(parts[3]); month = Number(parts[format === "dmy" ? 2 : 1]); date = Number(parts[format === "dmy" ? 1 : 2]);
  } else return null;
  if (year < 1900 || year > 2200 || month < 1 || month > 12 || date < 1 || date > 31) return null;
  const timestamp = Date.UTC(year, month - 1, date);
  const parsed = new Date(timestamp);
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== date) return null;
  return { iso: parsed.toISOString().slice(0, 10), day: timestamp / 86_400_000 };
}
