import { format } from "date-fns";

export function formatTime(hour: number, minutes: number): string {
  // Create a Date object with today's date and the given time
  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  // Format the Date object to HH:MM AM/PM
  return format(date, 'h:mm a');
}

export function display(percent: number): string;
export function display(min: number, max: number): string;
export function display(min: number, max: number, percent: number): string;
export function display(minOrPercent: number, max?: number, percent?: number): string {
  if (typeof max === "undefined" && typeof percent === "undefined") {
    // Case: display(percent)
    let percentage = Math.floor(minOrPercent * 1000) / 10;
    return `${percentage}% full`;
  } else if (typeof percent === "undefined") {
    // Case: display(min, max)
    percent = minOrPercent / max!;
    let percentage = Math.floor(percent * 1000) / 10;
    return `${minOrPercent}/${max} (${percentage}% full)`;
  } else {
    // Case: display(min, max, percent)
    let percentage = Math.floor(percent * 1000) / 10;
    return `${minOrPercent}/${max} (${percentage}% full)`;
  }
}
