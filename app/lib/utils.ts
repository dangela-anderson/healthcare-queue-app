/**
 * Returns a formatted duration.
 * @param seconds - The duration in seconds.
 * @returns The duration in 00m format.
 */
export function formatDuration(seconds: number): string {
  const totalSeconds = Math.max(0, Math.round(seconds));

  const mins = Math.floor(totalSeconds / 60);

  return `${mins.toString()}m`;
}

/**
 * Returns a formatted date.
 * @param dateString - The string of a date.
 * @returns The date in mm/dd/yy 0000 format.
 */
export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date(dateString))
    .replace(",", "");
}

/**
 * Calculates the time elapsed between the start date and end date.
 * @param start - The string of the start date.
 * @param end - The string of the end date.
 * @returns The time elapsed in seconds.
 */
export function calculateDuration(startDate: string, endDate: string): number {
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();
  return (endTime - startTime) / 1000;
}

/**
 * Calculates the average.
 * @param values - The array of numbers.
 * @returns The average of the numbers in the value array.
 */
export function calculateAverage(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
