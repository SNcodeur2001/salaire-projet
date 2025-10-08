/**
 * Utility functions for attendance calculations
 */

/**
 * Calculate hours worked from clockIn and clockOut times
 * @param clockIn - Clock in time
 * @param clockOut - Clock out time
 * @returns Hours worked as a number, or 0 if invalid
 */
export function calculateHoursWorked(clockIn: Date | null, clockOut: Date | null): number {
  if (!clockIn || !clockOut) {
    return 0;
  }

  const diffMs = clockOut.getTime() - clockIn.getTime();
  const diffHours = diffMs / (1000 * 60 * 60); // Convert to hours

  // Ensure positive hours (in case of invalid data)
  return Math.max(0, diffHours);
}

/**
 * Aggregate total hours worked for an employee in a given period
 * @param attendances - Array of attendance records
 * @returns Total hours worked
 */
export function aggregateHoursWorked(attendances: Array<{ clockIn: Date | null, clockOut: Date | null }>): number {
  return attendances.reduce((total, attendance) => {
    return total + calculateHoursWorked(attendance.clockIn, attendance.clockOut);
  }, 0);
}

/**
 * Get attendance records for a specific period (month)
 * @param attendances - All attendance records for an employee
 * @param year - Year of the period
 * @param month - Month of the period (1-12)
 * @returns Filtered attendance records for the period
 */
export function getAttendancesForPeriod(
  attendances: Array<{ date: Date, clockIn: Date | null, clockOut: Date | null }>,
  year: number,
  month: number
): Array<{ clockIn: Date | null, clockOut: Date | null }> {
  return attendances.filter(attendance => {
    const attendanceDate = new Date(attendance.date);
    return attendanceDate.getFullYear() === year && attendanceDate.getMonth() + 1 === month;
  });
}