import { describe, it, expect } from 'vitest';
import { floatWithTwoDecimals } from './numbers';

describe('numbers()', () => {
  it('should return a warning if input is not a float with exactly two decimal places', () => {
    const result = floatWithTwoDecimals('2');
    expect(result).toBe('must be a float with exactly two decimal places');
  });

  it('should return undefined if no input props are passed into function', () => {
    const result = floatWithTwoDecimals();
    expect(result).toBe('must be a float with exactly two decimal places');
  });

  it('should return undefined for valid input', () => {
    const result = floatWithTwoDecimals('2.00');
    expect(result).toBe(undefined);
  });
});
