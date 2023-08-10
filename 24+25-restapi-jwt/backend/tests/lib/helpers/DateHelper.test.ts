import { describe, it, expect } from 'vitest';

import DateHelper from '../../../src/lib/helpers/DateHelper';

describe('filenameFriendlyUTCDate()', () => {
  it('should return UTC time given a date instance', () => {
    const date = new Date('2022-03-01');
    date.setHours(14, 30, 0);
    expect(DateHelper.filenameFriendlyUTCDate(date)).toBe('2022-03-01T06_30_00.000Z');
  });
});

describe('unixEpochToUTCDate()', () => {
  it('should change timestamps: unix epoch (seconds) to UTCDate (ISO-Date string)', () => {
    const date = 1646116200;
    expect(DateHelper.unixEpochToUTCDate(date)).toBe('2022-03-01T06:30:00.000Z');
  });
});

describe('jsISOStringToUnixEpoch()', () => {
  it('should change ISOString to UnixEpoch timestamp (seconds)', () => {
    const isoString = '2022-03-01T06:30:00.000Z';
    expect(DateHelper.jsISOStringToUnixEpoch(isoString)).toBe(1646116200);
  });
});

describe('jsDateNowToUnixEpoch()', () => {
  it('should change timestamp from Date.now() to UnixEpoch (seconds)', () => {
    const date = new Date('2022-03-01');
    date.setHours(14, 30, 0);
    const timestamp = Date.parse(date);
    expect(DateHelper.jsDateNowToUnixEpoch(timestamp)).toBe(1646116200);
  });
});
