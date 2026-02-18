import { TimeSlot } from "@/types";

/**
 * Convert a local date+time in a named IANA timezone to a UTC Date.
 * Uses Intl.DateTimeFormat.formatToParts — no string parsing, no external dependencies.
 */
export function toUtcFromZoned(dateStr: string, timeStr: string, timezone: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);

  // Use a trial UTC timestamp to probe the timezone offset via Intl
  const trial = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(trial);

  const get = (type: string) => Number(parts.find(p => p.type === type)?.value ?? '0');
  // hour12: false can return '24' for midnight — normalise it
  const localMs = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'), 0);

  return new Date(trial.getTime() + (trial.getTime() - localMs));
}

/**
 * Generate 15-minute time slots for a date range
 * @param startDate - Start date of the event
 * @param endDate - End date of the event
 * @param dailyStartTime - Daily start time (HH:MM format)
 * @param dailyEndTime - Daily end time (HH:MM format)
 * @param timezone - Optional IANA timezone of the event creator
 * @returns Array of TimeSlot objects
 */
export function generateTimeSlots(
  startDate: Date,
  endDate: Date,
  dailyStartTime: string,
  dailyEndTime: string,
  timezone?: string
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const [startHour, startMinute] = dailyStartTime.split(':').map(Number);
  const [endHour, endMinute] = dailyEndTime.split(':').map(Number);

  // Iterate through each day
  const currentDate = new Date(startDate);
  currentDate.setUTCHours(0, 0, 0, 0);

  const lastDate = new Date(endDate);
  lastDate.setUTCHours(23, 59, 59, 999);

  while (currentDate <= lastDate) {
    // For each day, generate time slots from dailyStartTime to dailyEndTime
    const dayDateStr = currentDate.toISOString().slice(0, 10);

    const daySlotStart = timezone
      ? toUtcFromZoned(dayDateStr, dailyStartTime, timezone)
      : (() => { const d = new Date(currentDate); d.setHours(startHour, startMinute, 0, 0); return d; })();

    const daySlotEnd = timezone
      ? toUtcFromZoned(dayDateStr, dailyEndTime, timezone)
      : (() => { const d = new Date(currentDate); d.setHours(endHour, endMinute, 0, 0); return d; })();

    let currentSlot = new Date(daySlotStart);

    while (currentSlot < daySlotEnd) {
      const slotEnd = new Date(currentSlot);
      slotEnd.setMinutes(slotEnd.getMinutes() + 15);

      slots.push({
        start: new Date(currentSlot),
        end: new Date(slotEnd),
        key: getSlotKey(currentSlot),
      });

      currentSlot = slotEnd;
    }

    // Move to next day (UTC)
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return slots;
}

/**
 * Format a date as a time string (e.g., "2:30 PM")
 * @param date - Date to format
 * @returns Formatted time string
 */
export function formatTimeSlot(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format a date as a short date string (e.g., "Mon 2/17")
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDateHeader(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'numeric',
    day: 'numeric',
  });
}

/**
 * Get a unique key for a time slot
 * @param date - Date to get key for
 * @returns ISO string key
 */
export function getSlotKey(date: Date): string {
  return date.toISOString();
}

/**
 * Parse a slot key back into a Date
 * @param key - ISO string key
 * @returns Date object
 */
export function parseSlotKey(key: string): Date {
  return new Date(key);
}

/**
 * Get all unique dates from time slots
 * @param slots - Array of time slots
 * @returns Array of unique dates (start of day)
 */
export function getUniqueDates(slots: TimeSlot[]): Date[] {
  const dateMap = new Map<string, Date>();

  slots.forEach(slot => {
    const dateKey = slot.start.toDateString();
    if (!dateMap.has(dateKey)) {
      const date = new Date(slot.start);
      date.setHours(0, 0, 0, 0);
      dateMap.set(dateKey, date);
    }
  });

  return Array.from(dateMap.values()).sort((a, b) => a.getTime() - b.getTime());
}

/**
 * Get all unique times (hours/minutes) from time slots
 * @param slots - Array of time slots
 * @returns Array of formatted time strings
 */
export function getUniqueTimes(slots: TimeSlot[]): string[] {
  const timeMap = new Map<string, string>();

  slots.forEach(slot => {
    const timeKey = `${slot.start.getHours()}:${slot.start.getMinutes()}`;
    if (!timeMap.has(timeKey)) {
      timeMap.set(timeKey, formatTimeSlot(slot.start));
    }
  });

  return Array.from(timeMap.values());
}

/**
 * Check if a slot is on a specific date
 * @param slot - Time slot to check
 * @param date - Date to compare against
 * @returns True if slot is on the given date
 */
export function isSlotOnDate(slot: TimeSlot, date: Date): boolean {
  return slot.start.toDateString() === date.toDateString();
}

/**
 * Group slots by date
 * @param slots - Array of time slots
 * @returns Map of date string to time slots
 */
export function groupSlotsByDate(slots: TimeSlot[]): Map<string, TimeSlot[]> {
  const grouped = new Map<string, TimeSlot[]>();

  slots.forEach(slot => {
    const dateKey = slot.start.toDateString();
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(slot);
  });

  return grouped;
}
