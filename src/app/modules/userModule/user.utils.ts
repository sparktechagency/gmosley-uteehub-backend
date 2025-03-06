export const slotsPerDayOfAvailities = (day: any): string[] => {
  const toMinutes = (time: string): number => {
    const [hours, minutes, period] = time.split(/[: ]/);
    const isPM = period === 'PM';
    const adjustedHours = (parseInt(hours) % 12) + (isPM ? 12 : 0); // Convert to 24-hour format
    return adjustedHours * 60 + parseInt(minutes);
  };

  const toTimeString = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    return `${adjustedHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const startMinutes = toMinutes(day.startTime);
  const endMinutes = toMinutes(day.endTime);
  const slotDuration = Math.floor((endMinutes - startMinutes) / day.appointmentLimit); // Duration per slot in minutes

  const slots: string[] = [];
  for (let i = 0; i < day.appointmentLimit; i++) {
    const slotStart = startMinutes + i * slotDuration;
    const slotEnd = slotStart + slotDuration;
    slots.push(`${toTimeString(slotStart)} - ${toTimeString(slotEnd)}`);
  }

  return slots;
};
