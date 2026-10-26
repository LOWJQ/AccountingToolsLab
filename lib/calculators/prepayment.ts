export type PrepaymentMethod = "monthly" | "daily";
export type PrepaymentInput = {
  amount: string;
  startDate: string;
  endDate: string;
  method: PrepaymentMethod;
};
export type PrepaymentField = "amount" | "startDate" | "endDate" | "method";
export type PrepaymentErrors = Partial<Record<PrepaymentField, string>>;
export type PrepaymentPeriod = {
  month: string;
  startDate: string;
  endDate: string;
  openingCents: number;
  expenseCents: number;
  cumulativeCents: number;
  remainingCents: number;
};
export type PrepaymentSchedule = {
  amountCents: number;
  startDate: string;
  endDate: string;
  method: PrepaymentMethod;
  periods: PrepaymentPeriod[];
};

const DAY_MS = 86_400_000;
// The LCM of 28, 29, 30 and 31 makes every calendar-month weight an integer.
const MONTH_WEIGHT = 377_580;
const MAX_AMOUNT_CENTS = 99_999_999_999_999;
const MAX_MONTHS = 1_200;

function parseDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1900 || year > 9999) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
}

function parseAmountCents(value: string): number | null {
  const trimmed = value.trim();
  if (!/^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/.test(trimmed) || trimmed.length > 32) return null;
  const [whole, fraction = ""] = trimmed.split(".");
  const cents = BigInt(whole || "0") * BigInt(100) + BigInt(fraction.padEnd(2, "0"));
  if (cents <= BigInt(0) || cents > BigInt(MAX_AMOUNT_CENTS)) return null;
  return Number(cents);
}

function monthCount(start: Date, end: Date): number {
  return (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + end.getUTCMonth() - start.getUTCMonth() + 1;
}

export function getPrepaymentErrors(input: PrepaymentInput): PrepaymentErrors {
  const errors: PrepaymentErrors = {};
  if (parseAmountCents(input.amount) === null) {
    const value = input.amount.trim();
    errors.amount = !value ? "Enter the prepaid amount."
      : /^\d*\.\d{3,}$/.test(value) ? "Use up to 2 decimal places."
      : Number.isFinite(Number(value)) && Number(value) <= 0 ? "Enter an amount greater than zero."
      : Number(value) > MAX_AMOUNT_CENTS / 100 ? "Enter an amount up to 999,999,999,999.99."
      : "Enter a valid amount, such as 12000.00.";
  }
  const start = parseDate(input.startDate);
  const end = parseDate(input.endDate);
  if (!start) errors.startDate = "Choose a valid start date from 1900 onwards.";
  if (!end) errors.endDate = "Choose a valid end date from 1900 onwards.";
  if (start && end) {
    if (end < start) errors.endDate = "Choose an end date on or after the start date.";
    else if (monthCount(start, end) > MAX_MONTHS) errors.endDate = "Choose a period covering at most 1,200 calendar months.";
  }
  if (input.method !== "monthly" && input.method !== "daily") errors.method = "Choose monthly or daily allocation.";
  return errors;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function calculatePrepaymentSchedule(input: PrepaymentInput): PrepaymentSchedule {
  const errors = getPrepaymentErrors(input);
  if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
  const start = parseDate(input.startDate)!;
  const end = parseDate(input.endDate)!;
  const amountCents = parseAmountCents(input.amount)!;
  const weighted: { start: Date; end: Date; weight: number }[] = [];
  for (let offset = 0; offset < monthCount(start, end); offset++) {
    const monthStart = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + offset, 1));
    const monthEnd = new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 0));
    const periodStart = new Date(Math.max(start.getTime(), monthStart.getTime()));
    const periodEnd = new Date(Math.min(end.getTime(), monthEnd.getTime()));
    const days = (periodEnd.getTime() - periodStart.getTime()) / DAY_MS + 1;
    weighted.push({ start: periodStart, end: periodEnd, weight: input.method === "daily" ? days : days * (MONTH_WEIGHT / monthEnd.getUTCDate()) });
  }
  const totalWeight = BigInt(weighted.reduce((sum, row) => sum + row.weight, 0));
  let cumulativeWeight = BigInt(0);
  let previousCents = 0;
  const periods = weighted.map((row): PrepaymentPeriod => {
    cumulativeWeight += BigInt(row.weight);
    // Round cumulative allocations, then take differences. Even tiny amounts
    // stay non-negative and the complete schedule always clears to zero.
    const numerator = BigInt(amountCents) * cumulativeWeight;
    const cumulativeCents = Number((numerator * BigInt(2) + totalWeight) / (totalWeight * BigInt(2)));
    const period = {
      month: isoDate(row.start).slice(0, 7),
      startDate: isoDate(row.start), endDate: isoDate(row.end),
      openingCents: amountCents - previousCents,
      expenseCents: cumulativeCents - previousCents,
      cumulativeCents, remainingCents: amountCents - cumulativeCents
    };
    previousCents = cumulativeCents;
    return period;
  });
  return { amountCents, startDate: input.startDate, endDate: input.endDate, method: input.method, periods };
}

export function prepaymentScheduleCsv(schedule: PrepaymentSchedule, currency: string): string {
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Choose a valid currency.");
  const rows: (string | number)[][] = [[
    "Month", "Coverage start", "Coverage end", "Currency", "Opening prepayment", "Expense", "Cumulative expense", "Remaining prepayment", "Journal date", "Debit account", "Credit account", "Allocation method"
  ]];
  for (const row of schedule.periods) {
    rows.push([
      row.month, row.startDate, row.endDate, currency,
      (row.openingCents / 100).toFixed(2), (row.expenseCents / 100).toFixed(2),
      (row.cumulativeCents / 100).toFixed(2), (row.remainingCents / 100).toFixed(2),
      row.endDate, "Expense", "Prepaid expense", schedule.method === "monthly" ? "Monthly (partial months prorated)" : "Daily"
    ]);
  }
  return "\uFEFF" + rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\r\n");
}
