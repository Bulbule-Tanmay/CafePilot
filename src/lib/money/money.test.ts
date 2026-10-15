import { describe, expect, it } from 'vitest'
import { formatPaise, percentOfPaise, roundToRupee, rupeesToPaise, sumPaise } from './index'

describe('rupeesToPaise', () => {
  it('parses whole, decimal and formatted input', () => {
    expect(rupeesToPaise('199')).toBe(19900)
    expect(rupeesToPaise('199.5')).toBe(19950)
    expect(rupeesToPaise('₹1,299.05')).toBe(129905)
    expect(rupeesToPaise(0.1 + 0.2)).toBe(30)
  })
  it('rejects invalid input', () => {
    expect(rupeesToPaise('abc')).toBeNull()
    expect(rupeesToPaise('1.234')).toBeNull()
    expect(rupeesToPaise('')).toBeNull()
  })
})

describe('formatPaise', () => {
  it('formats with Indian grouping', () => {
    expect(formatPaise(129905)).toContain('1,299.05')
    expect(formatPaise(12345600)).toContain('1,23,456.00')
  })
  it('handles negatives and hideZeroPaise', () => {
    expect(formatPaise(-5000)).toMatch(/^-.*50\.00$/)
    expect(formatPaise(50000, { hideZeroPaise: true })).toMatch(/500$/)
  })
})

describe('percentOfPaise', () => {
  it('calculates 5% GST on 100.00', () => {
    expect(percentOfPaise(10000, 500)).toBe(500)
  })
  it('rounds half away from zero', () => {
    expect(percentOfPaise(10, 500)).toBe(1) // 0.5 -> 1
    expect(percentOfPaise(-10, 500)).toBe(-1)
  })
  it('rejects non-integer bps', () => {
    expect(() => percentOfPaise(100, 2.5)).toThrow()
  })
})

describe('sum and rounding', () => {
  it('sums safely', () => {
    expect(sumPaise([100, 250, 5])).toBe(355)
    expect(() => sumPaise([1.5])).toThrow()
  })
  it('rounds to rupee and reports adjustment', () => {
    expect(roundToRupee(10049)).toEqual({ rounded: 10000, adjustment: -49 })
    expect(roundToRupee(10050)).toEqual({ rounded: 10100, adjustment: 50 })
  })
})
