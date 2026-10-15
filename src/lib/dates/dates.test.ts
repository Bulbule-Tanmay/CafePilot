import { describe, expect, it } from 'vitest'
import { fiscalYearIndia, istDateKey } from './index'

describe('fiscalYearIndia', () => {
  it('starts on 1 April IST', () => {
    expect(fiscalYearIndia('2026-04-01T00:00:00+05:30')).toBe('2026-27')
    expect(fiscalYearIndia('2026-03-31T23:59:00+05:30')).toBe('2025-26')
  })
  it('uses IST, not UTC, at the boundary', () => {
    // 2026-03-31 20:00 UTC is 2026-04-01 01:30 IST
    expect(fiscalYearIndia('2026-03-31T20:00:00Z')).toBe('2026-27')
  })
  it('handles century wrap of the two-digit suffix', () => {
    expect(fiscalYearIndia('2099-06-01T00:00:00+05:30')).toBe('2099-00')
  })
})

describe('istDateKey', () => {
  it('groups by IST calendar date', () => {
    expect(istDateKey('2026-10-15T20:00:00Z')).toBe('2026-10-16')
  })
})
