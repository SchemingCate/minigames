import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getTimeAgoString } from './get-time-ago-string';

const NOW = new Date('2026-10-13T12:00:00.000Z');

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const isoAgo = (ms: number) => new Date(NOW.getTime() - ms).toISOString();

describe('getTimeAgoString', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    ['now', 0, 'just now'],
    ['30 seconds', 30 * SECOND, 'just now'],
    ['59 seconds (upper edge)', 59 * SECOND, 'just now'],
    ['60 seconds (lower edge of minutes)', 60 * SECOND, '1 min ago'],
    ['5 minutes', 5 * MINUTE, '5 min ago'],
    ['59 min 59 s (upper edge)', 59 * MINUTE + 59 * SECOND, '59 min ago'],
  ])('seconds and minutes: %s', (_label, ms, expected) => {
    expect(getTimeAgoString(isoAgo(ms))).toBe(expected);
  });

  it.each([
    ['60 minutes (lower edge)', 60 * MINUTE, '1 hour ago'],
    ['119 minutes (still singular)', 119 * MINUTE, '1 hour ago'],
    ['2 hours (plural starts)', 2 * HOUR, '2 hours ago'],
    ['23 h 59 min (upper edge)', 23 * HOUR + 59 * MINUTE, '23 hours ago'],
  ])('hours: %s', (_label, ms, expected) => {
    expect(getTimeAgoString(isoAgo(ms))).toBe(expected);
  });

  it.each([
    ['24 hours (lower edge)', 1 * DAY, '1 day ago'],
    ['47 hours (still singular)', 47 * HOUR, '1 day ago'],
    ['2 days (plural starts)', 2 * DAY, '2 days ago'],
    ['6 days (upper edge)', 6 * DAY, '6 days ago'],
  ])('days: %s', (_label, ms, expected) => {
    expect(getTimeAgoString(isoAgo(ms))).toBe(expected);
  });

  it.each([
    ['7 days (lower edge)', 7 * DAY, '1 week ago'],
    ['13 days (still singular)', 13 * DAY, '1 week ago'],
    ['14 days (plural starts)', 14 * DAY, '2 weeks ago'],
    ['27 days (upper edge)', 27 * DAY, '3 weeks ago'],
  ])('weeks: %s', (_label, ms, expected) => {
    expect(getTimeAgoString(isoAgo(ms))).toBe(expected);
  });

  it.each([
    ['28 days (never shows "0 months")', 28 * DAY, '1 month ago'],
    ['59 days (still singular)', 59 * DAY, '1 month ago'],
    ['60 days (plural starts)', 60 * DAY, '2 months ago'],
    ['330 days', 330 * DAY, '11 months ago'],
    ['364 days (capped at 11, never "12 months")', 364 * DAY, '11 months ago'],
  ])('months: %s', (_label, ms, expected) => {
    expect(getTimeAgoString(isoAgo(ms))).toBe(expected);
  });

  it.each([
    ['365 days (lower edge)', 365 * DAY, '1 year ago'],
    ['729 days (still singular)', 729 * DAY, '1 year ago'],
    ['730 days (plural starts)', 730 * DAY, '2 years ago'],
    ['10 years', 3650 * DAY, '10 years ago'],
  ])('years: %s', (_label, ms, expected) => {
    expect(getTimeAgoString(isoAgo(ms))).toBe(expected);
  });

  it('treats a timestamp in the future as "just now"', () => {
    expect(getTimeAgoString(isoAgo(-5 * MINUTE))).toBe('just now');
  });

  it('accepts ISO strings with a timezone offset', () => {
    expect(getTimeAgoString('2026-10-13T11:00:00.000+02:00')).toBe(
      '3 hours ago',
    );
  });

  it('follows the clock as time passes', () => {
    const iso = isoAgo(0);

    expect(getTimeAgoString(iso)).toBe('just now');

    vi.advanceTimersByTime(2 * MINUTE);

    expect(getTimeAgoString(iso)).toBe('2 min ago');
  });
});
