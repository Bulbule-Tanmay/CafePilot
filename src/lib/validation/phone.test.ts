import { describe, expect, it } from 'vitest'
import { indianMobileSchema, normalizeIndianMobile } from './phone'

describe('normalizeIndianMobile', () => {
  it('normalises common formats', () => {
    expect(normalizeIndianMobile('98765 43210')).toBe('+919876543210')
    expect(normalizeIndianMobile('+91-98765-43210')).toBe('+919876543210')
    expect(normalizeIndianMobile('919876543210')).toBe('+919876543210')
    expect(normalizeIndianMobile('09876543210')).toBe('+919876543210')
  })
  it('rejects invalid numbers', () => {
    expect(normalizeIndianMobile('12345')).toBeNull()
    expect(normalizeIndianMobile('5876543210')).toBeNull() // must start 6-9
    expect(normalizeIndianMobile('98765abcde')).toBeNull()
    expect(normalizeIndianMobile('')).toBeNull()
  })
})

describe('indianMobileSchema', () => {
  it('transforms valid input and errors on invalid', () => {
    expect(indianMobileSchema.parse('9876543210')).toBe('+919876543210')
    expect(indianMobileSchema.safeParse('123').success).toBe(false)
  })
})
