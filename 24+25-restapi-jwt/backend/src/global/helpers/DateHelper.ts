class DateHelper {
  static filenameFriendlyDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    const amOrPm = hours < 12 ? 'am' : 'pm';

    const formattedTime = `${
      hours % 12 || 12
    }h${minutes}m${seconds}s${milliseconds}ms`;

    return `${year}-${month}-${day} [${formattedTime}]`;
  };
}

export default DateHelper;
