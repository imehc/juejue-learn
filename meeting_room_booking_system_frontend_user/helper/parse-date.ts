import { CalendarDateTime } from "@internationalized/date";

/** 格式化日期 */
export const parseDate = (date?: Date | null) => {
  try {
    if (!date) {
      return null;
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return new CalendarDateTime(year, month, day, hour, minute);
  } catch (error) {
    return null;
  }
};
