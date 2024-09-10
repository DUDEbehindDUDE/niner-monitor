import { addMinutes, format, setMilliseconds, setSeconds } from "date-fns";

/**
 * Formats a given time to "h:mm a" (12-hour format with AM/PM).
 *
 * @param {Date | number} hourOrDate - A Date object or an hour value.
 * @param {number} [minutes] - The minutes value (only required if the first argument is a number).
 * @returns {string} The formatted time in "h:mm a" format.
 */
export function formatTime(date: Date): string;
export function formatTime(hour: number, minutes: number): string;
export function formatTime(
  hourOrDate: number | Date,
  minutes?: number
): string {
  let date: Date;
  if (typeof hourOrDate === "number") {
    date = new Date();
    date.setHours(hourOrDate);
    date.setMinutes(minutes!);
    date.setSeconds(0);
    date.setMilliseconds(0);
  } else {
    date = hourOrDate;
  }
  return format(date, "h:mm a");
}

/**
 * Displays a percentage or a formatted fraction with the percentage.
 *
 * @param {number} minOrPercent - The percentage (if only one argument) or the minimum value.
 * @param {number} [max] - The maximum value (optional if percentage is being displayed).
 * @param {number} [percent] - The percentage value when both min and max are provided (optional).
 * @returns {string} A formatted string displaying percentage or fraction with percentage.
 */
export function display(percent: number): string;
export function display(min: number, max: number): string;
export function display(min: number, max: number, percent: number): string;
export function display(
  minOrPercent: number,
  max?: number,
  percent?: number
): string {
  if (typeof max === "undefined" && typeof percent === "undefined") {
    let percentage = Math.floor(minOrPercent * 1000) / 10;
    return `${percentage}% full`;
  }
  if (typeof percent === "undefined") {
    percent = minOrPercent / max!;
    let percentage = Math.floor(percent * 1000) / 10;
    return `${minOrPercent}/${max} (${percentage}% full)`;
  }
  let percentage = Math.floor(percent * 1000) / 10;
  return `${minOrPercent}/${max} (${percentage}% full)`;
}

/**
 * Rounds a given date to the nearest 15-minute interval.
 *
 * @param {Date | string} date - A Date object or a date string.
 * @returns {Date} A new Date object rounded to the nearest 15 minutes.
 */
export function roundDateTo15(date: Date | string): Date {
  if (typeof date === "string") date = new Date(date);
  const minutes = date.getMinutes();
  const remainder = minutes % 15;
  const minutesToAdd = remainder < 8 ? -remainder : 15 - remainder;
  return setMilliseconds(setSeconds(addMinutes(date, minutesToAdd), 0), 0);
}

/**
 * Returns the ordinal suffix for a given day (e.g., "st", "nd", "rd", "th").
 *
 * @param {number | string} day - The day of the month as a number or string.
 * 																If a string, will parse as an int.
 * @returns {"st" | "nd" | "rd" | "th"} The ordinal suffix corresponding to the given day.
 */
export function getOrdinalSuffix(day: string): "st" | "nd" | "rd" | "th";
export function getOrdinalSuffix(day: number): "st" | "nd" | "rd" | "th";
export function getOrdinalSuffix(day: number | string) {
  if (typeof day === "string") {
    day = parseInt(day);
  }
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
