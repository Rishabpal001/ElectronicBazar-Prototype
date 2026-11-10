import { describe, expect, it } from 'vitest';
import { discountPercent, formatPrice, highlightsToText, parseHighlights } from '../src/lib/format';
import { parseWishlist } from '../src/lib/wishlist';

describe('discountPercent', () => {
  it('rounds down', () => { expect(discountPercent(12299900, 7999900)).toBe(34); });
  it('is 0 without a sale or with a bad sale', () => {
    expect(discountPercent(1000, null)).toBe(0);
    expect(discountPercent(1000, 1000)).toBe(0);
    expect(discountPercent(1000, 2000)).toBe(0);
    expect(discountPercent(0, 0)).toBe(0);
  });
  it('50% off', () => { expect(discountPercent(20000, 10000)).toBe(50); });
});

describe('parseHighlights', () => {
  it('reads Label: value lines', () => {
    expect(parseHighlights('Camera: 200MP\nUpdates: 7 Years')).toEqual([{ label: 'Camera', value: '200MP' }, { label: 'Updates', value: '7 Years' }]);
  });
  it('keeps colons inside the value and trims', () => {
    expect(parseHighlights('  Ratio : 16:9  ')).toEqual([{ label: 'Ratio', value: '16:9' }]);
  });
  it('ignores lines without a label or value', () => {
    expect(parseHighlights('no colon here\n: nolabel\nlabel:\n\nOK: yes')).toEqual([{ label: 'OK', value: 'yes' }]);
  });
  it('caps at 8 items', () => {
    const text = Array.from({ length: 12 }, (_, i) => `L${i}: v${i}`).join('\n');
    expect(parseHighlights(text).length).toBe(8);
  });
  it('round-trips', () => {
    const h = [{ label: 'A', value: '1' }, { label: 'B', value: '2' }];
    expect(parseHighlights(highlightsToText(h))).toEqual(h);
    expect(highlightsToText(undefined)).toBe('');
  });
});

describe('parseWishlist', () => {
  const id = '3f2b8c1e-1a2b-4c3d-8e4f-5a6b7c8d9e0f';
  it('keeps valid unique ids only', () => { expect(parseWishlist(JSON.stringify([id, id, 'x', 5, null]))).toEqual([id]); });
  it('survives bad input', () => {
    expect(parseWishlist(null)).toEqual([]);
    expect(parseWishlist('{oops')).toEqual([]);
    expect(parseWishlist('{"a":1}')).toEqual([]);
  });
});

describe('formatPrice', () => {
  it('formats rupees', () => { expect(formatPrice(7999900)).toContain('79,999'); });
});
