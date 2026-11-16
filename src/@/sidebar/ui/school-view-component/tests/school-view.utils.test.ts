import {
  formatStaticFieldValue,
  roundStaticNumericValue,
} from '../school-view.utils';

describe('roundStaticNumericValue', () => {
  it('rounds non-integer numbers to two decimals', () => {
    expect(roundStaticNumericValue(7.081429481506348)).toBe(7.08);
    expect(roundStaticNumericValue(0.346597284078598)).toBe(0.35);
  });

  it('rounds decimal strings', () => {
    expect(roundStaticNumericValue('7.081429481506348')).toBe(7.08);
  });

  it('keeps integers and non-numeric values as they are', () => {
    expect(roundStaticNumericValue(2026)).toBe(2026);
    expect(roundStaticNumericValue('2026')).toBe('2026');
    expect(roundStaticNumericValue('4g')).toBe('4g');
    expect(roundStaticNumericValue(true)).toBe(true);
    expect(roundStaticNumericValue(null)).toBe(null);
  });
});

describe('formatStaticFieldValue', () => {
  it('shows rounded distances', () => {
    expect(formatStaticFieldValue(7.081429481506348)).toBe('7.08');
    expect(formatStaticFieldValue(10)).toBe('10');
  });

  it('keeps text values formatted', () => {
    expect(formatStaticFieldValue('no_coverage')).toBe('No Coverage');
    expect(formatStaticFieldValue(null)).toBe('N/A');
  });
});
