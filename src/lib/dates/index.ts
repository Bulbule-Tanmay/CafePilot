/** Date helpers. Storage is UTC timestamptz; display is always Asia/Kolkata. */

export const APP_TIME_ZONE = 'Asia/Kolkata'

type DateInput = Date | string | number

function toDate(input: DateInput): Date {
  return input instanceof Date ? input : new Date(input)
}

export function formatIST(
  input: DateInput,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium', timeStyle: 'short' },
): string {
  return new Intl.DateTimeFormat('en-IN', { ...options, timeZone: APP_TIME_ZONE }).format(toDate(input))
}

function istParts(input: DateInput): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(toDate(input))
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value)
  return { year: get('year'), month: get('month'), day: get('day') }
}

/** Calendar date key in IST, "YYYY-MM-DD". Useful for business-day grouping. */
export function istDateKey(input: DateInput): string {
  const { year, month, day } = istParts(input)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/** Indian fiscal year (1 Apr - 31 Mar) in IST, as "2026-27". */
export function fiscalYearIndia(input: DateInput): string {
  const { year, month } = istParts(input)
  const start = month >= 4 ? year : year - 1
  return `${start}-${String((start + 1) % 100).padStart(2, '0')}`
}
