/**
 * Money helpers. ALL money in CafePilot is integer paise. Never floats.
 */

export type Paise = number

export function assertPaise(value: number): asserts value is Paise {
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`Paise must be a safe integer, got ${value}`)
  }
}

/**
 * Parse a rupee amount ("199", "199.5", "1,299.05", 199.5) into integer paise.
 * Uses string parsing so 0.1 + 0.2 style float error cannot creep in.
 * Returns null for invalid input or more than 2 decimal places.
 */
export function rupeesToPaise(input: string | number): Paise | null {
  const raw = typeof input === 'number' ? input.toFixed(2) : input
  const cleaned = raw.replace(/[₹,\s]/g, '')
  const match = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(cleaned)
  if (!match) return null
  const [, sign, whole, frac = ''] = match
  const paise = Number(whole) * 100 + Number(frac.padEnd(2, '0'))
  if (!Number.isSafeInteger(paise)) return null
  return sign === '-' ? -paise : paise
}

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const inrWhole = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/** Format paise as INR, e.g. 129905 -> "₹1,299.05". */
export function formatPaise(paise: Paise, opts: { hideZeroPaise?: boolean } = {}): string {
  assertPaise(paise)
  const sign = paise < 0 ? -1 : 1
  const abs = Math.abs(paise)
  const whole = Math.trunc(abs / 100)
  const frac = abs % 100
  // Format from integer parts to avoid float division artefacts.
  if (opts.hideZeroPaise && frac === 0) {
    return (sign < 0 ? '-' : '') + inrWhole.format(whole)
  }
  const formatted = inr.format(whole + frac / 100)
  return sign < 0 ? `-${formatted}` : formatted
}

/**
 * Percentage of an amount using basis points (1% = 100 bps), rounded half away from zero.
 * Integer math only.
 */
export function percentOfPaise(amount: Paise, basisPoints: number): Paise {
  assertPaise(amount)
  if (!Number.isInteger(basisPoints)) {
    throw new RangeError('basisPoints must be an integer')
  }
  const product = amount * basisPoints
  const sign = product < 0 ? -1 : 1
  return sign * Math.floor((Math.abs(product) + 5000) / 10000)
}

export function sumPaise(values: readonly Paise[]): Paise {
  let total = 0
  for (const v of values) {
    assertPaise(v)
    total += v
  }
  return total
}

/** Round to the nearest rupee. Returns the rounded amount and the signed rounding adjustment. */
export function roundToRupee(amount: Paise): { rounded: Paise; adjustment: Paise } {
  assertPaise(amount)
  const sign = amount < 0 ? -1 : 1
  const abs = Math.abs(amount)
  const rounded = sign * (Math.floor((abs + 50) / 100) * 100)
  return { rounded, adjustment: rounded - amount }
}
