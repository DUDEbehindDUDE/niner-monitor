import { addMinutes, format, setMilliseconds, setSeconds } from "date-fns";

export function formatTime(date: Date): string;
export function formatTime(hour: number, minutes: number): string;
export function formatTime(
  hourOrDate: number | Date,
  minutes?: number
): string {
  // Create a Date object with today's date and the given time
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

  // Format the Date object to HH:MM AM/PM
  return format(date, "h:mm a");
}

export function display(percent: number): string;
export function display(min: number, max: number): string;
export function display(min: number, max: number, percent: number): string;
export function display(
  minOrPercent: number,
  max?: number,
  percent?: number
): string {
  // Case: display(percent)
  if (typeof max === "undefined" && typeof percent === "undefined") {
    let percentage = Math.floor(minOrPercent * 1000) / 10;
    return `${percentage}% full`;
  }

  // Case: display(min, max)
  if (typeof percent === "undefined") {
    percent = minOrPercent / max!;
    let percentage = Math.floor(percent * 1000) / 10;
    return `${minOrPercent}/${max} (${percentage}% full)`;
  }

  // Case: display(min, max, percent)
  let percentage = Math.floor(percent * 1000) / 10;
  return `${minOrPercent}/${max} (${percentage}% full)`;
}

export function roundDateTo15(date: Date | string) {
  if (typeof date === "string") date = new Date(date);
  const minutes = date.getMinutes();
  const remainder = minutes % 15;
  const minutesToAdd = remainder < 8 ? -remainder : 15 - remainder;

  return setMilliseconds(setSeconds(addMinutes(date, minutesToAdd), 0), 0);
}

// Helper function to get the ordinal suffix (e.g., "st", "nd", "rd", "th")
export function getOrdinalSuffix(day: string): "st" | "nd" | "rd" | "th";
export function getOrdinalSuffix(day: number): "st" | "nd" | "rd" | "th";
export function getOrdinalSuffix(day: number | string) {
  if (typeof day === "string") {
    day = parseInt(day);
  }

  if (day > 3 && day < 21) return "th"; // Covers 4th to 20th
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
