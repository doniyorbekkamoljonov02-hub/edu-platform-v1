import { DAY_ORDER } from '../constants/dayOfWeek'

/**
 * Maps JS's Date#getDay() (0=Sunday..6=Saturday) to our backend DayOfWeek
 * enum keys (MONDAY..SATURDAY). Returns null on Sunday, since the schedule
 * only models Monday-Saturday.
 */
export function getTodayDayKey(date = new Date()) {
  const jsDay = date.getDay() // 0=Sun, 1=Mon, ... 6=Sat
  if (jsDay === 0) return null
  return DAY_ORDER[jsDay - 1]
}
