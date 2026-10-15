import { z } from 'zod'

/**
 * Normalise an Indian mobile number to E.164 "+91XXXXXXXXXX".
 * Accepts spaces/dashes, optional +91 / 91 / 0 prefix. Returns null if invalid.
 * Indian mobiles are 10 digits starting 6-9.
 */
export function normalizeIndianMobile(input: string): string | null {
  let digits = input.replace(/[\s\-().]/g, '')
  if (digits.startsWith('+')) digits = digits.slice(1)
  if (!/^\d+$/.test(digits)) return null
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2)
  else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
  if (!/^[6-9]\d{9}$/.test(digits)) return null
  return `+91${digits}`
}

export const indianMobileSchema = z
  .string()
  .transform((v, ctx) => {
    const normalized = normalizeIndianMobile(v)
    if (!normalized) {
      ctx.addIssue({ code: 'custom', message: 'Enter a valid 10-digit Indian mobile number' })
      return z.NEVER
    }
    return normalized
  })
