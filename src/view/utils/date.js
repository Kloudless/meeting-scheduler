import moment from 'moment-timezone';


const methods = {
  hour(dateStr, timeZone) {
    const hourStr = moment(dateStr).tz(timeZone).format('HH:mm');
    // for converting 12AM (momentjs) to 00AM
    let hour = parseInt(hourStr.substr(0, 2), 10);
    hour = hour > 12 ? hour - 12 : hour;
    hour = hour < 10 ? `0${hour}` : hour;
    return `${hour}${hourStr.substr(2)}`;
  },
  amPm(dateStr, timeZone) {
    const hourStr = moment(dateStr).tz(timeZone).format('HH');
    const hour = parseInt(hourStr, 10);
    return hour > 11 ? 'PM' : 'AM';
  },
  fullHour(dateStr, timeZone) {
    return `${this.hour(dateStr, timeZone)} ${this.amPm(dateStr, timeZone)}`;
  },
  date(dateStr, timeZone) {
    return moment(dateStr).tz(timeZone).format('dddd, MMM  D YYYY');
  },
};

export default function date(format, dateStr, timeZone) {
  return methods[format](dateStr, timeZone);
}
