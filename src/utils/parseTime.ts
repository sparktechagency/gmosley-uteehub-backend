// Utility function to parse time in "HH:MM AM/PM" format
export const parseTime = (timeString: string): [number, number] => {
  const [time, period] = timeString.split(' ');
  const [hour, minute] = time.split(':').map(Number);

  let parsedHour = period === 'PM' && hour !== 12 ? hour + 12 : hour;
  if (period === 'AM' && hour === 12) {
    parsedHour = 0; // Midnight
  }

  return [parsedHour, minute];
};
