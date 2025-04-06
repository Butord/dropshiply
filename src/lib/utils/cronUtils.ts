
/**
 * Utility functions for handling cron expressions
 */

/**
 * Formats a cron expression into a human-readable string
 * @param cronExpression The cron expression to format
 * @returns A human-readable string representation of the cron schedule
 */
export function formatCron(cronExpression: string): string {
  if (!cronExpression) return 'Not scheduled';
  
  // Simple mapping for common cron expressions
  const commonPatterns: Record<string, string> = {
    '0 0 * * *': 'Daily at midnight',
    '0 0 * * 0': 'Weekly on Sunday',
    '0 0 1 * *': 'Monthly on the 1st',
    '0 0 1 1 *': 'Yearly on Jan 1st',
    '0 * * * *': 'Hourly',
    '*/15 * * * *': 'Every 15 minutes',
    '*/30 * * * *': 'Every 30 minutes',
    '0 */2 * * *': 'Every 2 hours',
    '0 */6 * * *': 'Every 6 hours',
    '0 */12 * * *': 'Every 12 hours',
  };
  
  // Return the mapped pattern if it exists
  if (commonPatterns[cronExpression]) {
    return commonPatterns[cronExpression];
  }
  
  // Basic parsing for custom patterns
  const parts = cronExpression.split(' ');
  if (parts.length !== 5) return 'Custom schedule';
  
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
  
  // Handle some other common patterns
  if (minute === '0' && hour !== '*') {
    if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return `Daily at ${hour}:00`;
    }
    
    if (dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      if (/^\d+$/.test(dayOfWeek) && parseInt(dayOfWeek) < 7) {
        return `Weekly on ${days[parseInt(dayOfWeek)]} at ${hour}:00`;
      }
    }
  }
  
  return 'Custom schedule';
}

/**
 * Calculates the next run time for a cron expression
 * @param cronExpression The cron expression to calculate the next run time for
 * @returns A formatted string representing the next run time
 */
export function getNextRunTime(cronExpression: string): string {
  if (!cronExpression) return '-';
  
  // For simplicity in this demo, we'll return relative time strings
  // In a real app, you would use a library like cron-parser to calculate actual next run
  const now = new Date();
  
  // Simple mapping for common patterns
  const commonPatterns: Record<string, string> = {
    '0 0 * * *': 'Tomorrow, 00:00',
    '0 0 * * 0': 'Next Sunday',
    '0 0 1 * *': 'On the 1st of next month',
    '0 * * * *': `Today, ${(now.getHours() + 1) % 24}:00`,
    '*/15 * * * *': 'Within 15 minutes',
    '*/30 * * * *': 'Within 30 minutes',
    '0 */2 * * *': 'Within 2 hours',
    '0 */6 * * *': 'Within 6 hours',
    '0 */12 * * *': 'Within 12 hours',
  };
  
  if (commonPatterns[cronExpression]) {
    return commonPatterns[cronExpression];
  }
  
  return 'Soon';
}
