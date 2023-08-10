//.toISOString() returns UTC

class DateHelper {
  //Date -> ISO-Date string
  static filenameFriendlyUTCDate = (date: Date) => {
    const isoString = date.toISOString(); //returns UTC
    const friendlyFilename = isoString.replace(/:/g, '_');
    return friendlyFilename; //eg. 2022-03-01T06_30_00.000Z
  };

  //unix epoch (seconds) to ISO-Date string
  //ISO-Date same as RFC3339_ISO8601
  static unixEpochToUTCDate(unixTimestamp: number) {
    const newDate = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds
    return newDate.toISOString(); //eg. 2022-03-01T06:30:00.000Z
  }

  //ISO-Date string -> unix epoch (seconds)
  //Date.parse() returns milliseconds
  static jsISOStringToUnixEpoch(isoDateString: string) {
    return Math.floor(Date.parse(isoDateString) / 1000); //eg. 1646116200
  }

  //Date.now() (milliseconds) -> unix epoch (seconds)
  static jsDateNowToUnixEpoch(date: number) {
    return Math.floor(date / 1000); //eg. 1646116200
  }
}

export default DateHelper;
