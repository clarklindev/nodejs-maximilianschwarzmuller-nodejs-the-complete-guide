import { describe, it, expect } from 'vitest';
import { isPhoneNumber } from '../../../src/lib/validators/phoneNumber';

describe('isPhoneNumber()', () => {
  it('should be able to tell if valid phone number with valid country code', () => {
    const phonenumber = '0125653582';
    const countryCode = '+27';
    expect(isPhoneNumber(phonenumber, countryCode)).toBe(undefined);
  });

  it('should be able to tell if valid phone number with incorrect country code', () => {
    const phonenumber = '0125653582';
    const countryCode = '+1';
    expect(isPhoneNumber(phonenumber, countryCode)).not.toBe(undefined);
  });

  it('should return true given a valid phone number', () => {
    const phonenumber = '+27125653582';
    expect(isPhoneNumber(phonenumber)).toBe(undefined);
  });
});
