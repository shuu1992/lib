import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';

dayjs.extend(weekday);
dayjs.Ls['en'].weekStart = 1;
export type dayType =
  | 'null'
  | 'today'
  | 'yesterday'
  | 'thisWeek'
  | 'lastWeek'
  | 'pass7Days'
  | 'thisMonth'
  | 'lastMonth'
  | 'creditThisMonth'
  | 'creditLastMonth';

export const getDateRange = (sysTime: string | null, dayType: dayType) => {
  const now = dayjs(sysTime);
  const elevenAM = now.hour(11).minute(59).second(59);
  const today = now.isBefore(elevenAM) ? now.subtract(1, 'day') : now;
  const lastMonthFirstMonday = () => {
    const startOfLastMonth = today.subtract(1, 'month').startOf('month');
    const lastMonthDayOfWeek = startOfLastMonth.day();
    const lastMonthOffset = lastMonthDayOfWeek === 0 ? 1 : (8 - lastMonthDayOfWeek) % 7;
    const lastMonthFirstMonday = startOfLastMonth.add(lastMonthOffset, 'day');
    return lastMonthFirstMonday;
  };
  const thisMonthFirstMonday = () => {
    // Get the start of the current month
    const startOfMonth = today.startOf('month');
    // Get the start of the current month
    // Find the day of the week for the first day of the month
    const dayOfWeek = startOfMonth.day();

    // Calculate the offset to the first Monday
    // If the first day is a Monday, the offset is 0
    // Otherwise, calculate the days until the next Monday
    const offset = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7;

    // Add the offset to get the first Monday
    const firstMonday = startOfMonth.add(offset, 'day');

    return firstMonday;
  };
  switch (dayType) {
    case 'today':
      return [
        today.startOf('day').add(12, 'hour'),
        today.add(1, 'day').startOf('day').add(11, 'hour').add(59, 'minute').add(59, 'second'),
      ];
    case 'yesterday':
      return [
        today.subtract(1, 'day').startOf('day').add(12, 'hour'),
        today.startOf('day').add(11, 'hour').add(59, 'minute').add(59, 'second'),
      ];
    case 'thisWeek': {
      const thisWeek = today.subtract(0, 'day');
      // console.log(isMonday, isBefore115959);
      // if (isMonday && isBefore115959) {
      //   thisWeek = today.subtract(7, 'day');
      // } else {
      //   thisWeek = today.subtract(0, 'day');
      // }
      return [
        thisWeek.startOf('week').add(12, 'hour'),
        thisWeek
          .endOf('week')
          .add(1, 'day')
          .startOf('day')
          .add(11, 'hour')
          .add(59, 'minute')
          .add(59, 'second'),
      ];
    }
    case 'lastWeek': {
      const prevWeek = today.subtract(7, 'day');
      // if (isMonday && isBefore115959) {
      //   prevWeek = today.subtract(14, 'day');
      // } else {
      //   prevWeek = today.subtract(7, 'day');
      // }
      return [
        prevWeek.startOf('week').add(12, 'hour'),
        prevWeek
          .endOf('week')
          .add(1, 'day')
          .startOf('day')
          .add(11, 'hour')
          .add(59, 'minute')
          .add(59, 'second'),
      ];
    }
    case 'pass7Days':
      return [today.subtract(7, 'day').startOf('day'), today.subtract(1, 'day').endOf('day')];
    case 'thisMonth': {
      return [today.startOf('month'), today.endOf('month')];
    }
    case 'lastMonth': {
      const startOfLastMonth = today.subtract(1, 'month').startOf('month');
      return [startOfLastMonth, startOfLastMonth.endOf('month')];
    }
    case 'creditThisMonth': {
      // If the first Monday is before today, show the current month or it's still the last period
      // ex: if today is 2024-08-04 10:06:54, the first Monday is 2024-08-05 12:00:00, so it's still the last period
      if (thisMonthFirstMonday().isBefore(today)) {
        // Get the start of the next month
        const startOfNextMonth = today.add(1, 'month').startOf('month');

        // Find the day of the week for the first day of the next month
        const nextMonthDayOfWeek = startOfNextMonth.day();

        // Calculate the offset to the first Monday
        // If the first day is a Monday, the offset is 0
        // Otherwise, calculate the days until the next Monday
        const nextMonthOffset = nextMonthDayOfWeek === 0 ? 1 : (8 - nextMonthDayOfWeek) % 7;

        // Add the offset to get the first Monday
        const firstMondayNextMonth = startOfNextMonth.add(nextMonthOffset, 'day');

        return [
          thisMonthFirstMonday().add(12, 'hour'),
          firstMondayNextMonth.add(11, 'hour').add(59, 'minute').add(59, 'second'),
        ];
      } else {
        return [
          lastMonthFirstMonday().add(12, 'hour'),
          thisMonthFirstMonday().add(11, 'hour').add(59, 'minute').add(59, 'second'),
        ];
      }
    }
    case 'creditLastMonth': {
      if (thisMonthFirstMonday().isBefore(today)) {
        return [
          lastMonthFirstMonday().add(12, 'hour'),
          thisMonthFirstMonday().add(11, 'hour').add(59, 'minute').add(59, 'second'),
        ];
      } else {
        const startOfLastPeriodLastMonth = today.subtract(2, 'month').startOf('month');
        const lastMonthDayOfWeek = startOfLastPeriodLastMonth.day();
        const lastPeriodLastMonthOffset =
          lastMonthDayOfWeek === 0 ? 1 : (8 - lastMonthDayOfWeek) % 7;
        const lastPeriodLastMonthFirstMonday = startOfLastPeriodLastMonth.add(
          lastPeriodLastMonthOffset,
          'day',
        );
        return [
          lastPeriodLastMonthFirstMonday.add(12, 'hour'),
          lastMonthFirstMonday().add(11, 'hour').add(59, 'minute').add(59, 'second'),
        ];
      }
    }
    default:
      return [dayjs(''), dayjs('')];
  }
};
