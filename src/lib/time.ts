import { DateTime } from 'luxon';

const TZ = process.env.TIMEZONE || 'Europe/Paris';

export function getNowInTz() {
  return DateTime.now().setZone(TZ);
}

export function isWithinHours(startHour: number, endHour: number) {
  const now = getNowInTz();
  const hour = now.hour + now.minute / 60;
  return hour >= startHour && hour < endHour;
}

export function isWithinFreeTrialSchedule() {
  const now = getNowInTz();
  const isSunday = now.weekday === 7;
  if (isSunday) {
    return false; // closed on Sundays
  }
  const start = Number(process.env.OPEN_HOURS_START ?? 10);
  const end = Number(process.env.OPEN_HOURS_END ?? 22);
  return isWithinHours(start, end);
}

export function secondsUntilMidnight() {
  const now = getNowInTz();
  const midnight = now.plus({ days: 1 }).startOf('day');
  return Math.max(1, Math.floor(midnight.diff(now, 'seconds').seconds));
}
