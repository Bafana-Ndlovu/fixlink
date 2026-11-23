import { describe, expect, it } from 'vitest';
import { formatRand, startingPriceLabel } from './format';

describe('formatRand', () => {
  it('formats whole Rand amounts without cents', () => {
    expect(formatRand(350)).toBe('R350');
  });

  it('groups thousands', () => {
    expect(formatRand(6500).replace(/\s/g, ' ')).toBe('R6 500');
  });

  it('keeps cents when present', () => {
    expect(formatRand(99.5).replace(/\s/g, ' ')).toBe('R99,50');
  });
});

describe('startingPriceLabel', () => {
  it('shows "From" with the price', () => {
    expect(startingPriceLabel(450)).toBe('From R450');
  });

  it('handles providers with no starting price', () => {
    expect(startingPriceLabel(null)).toBe('Price on request');
  });
});
