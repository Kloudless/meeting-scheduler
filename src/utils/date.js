import moment from 'moment';

// momentjs objects convert input date to browser timezone by default
// dateStr: YYYY-MM-DD

const methods = {
  hour(dateStr) {
    const hourStr = moment(dateStr).format('HH:mm');
    // for converting 12AM (momentjs) to 00AM
    let hour = parseInt(hourStr.substr(0, 2), 10);
    hour = hour > 12 ? hour - 12 : hour;
    hour = hour < 10 ? `0${hour}` : hour;
    return `${hour}${hourStr.substr(2)}`;
  },
  amPm(dateStr) {
    const hourStr = moment(dateStr).format('HH');
    const hour = parseInt(hourStr, 10);
    return hour > 11 ? 'PM' : 'AM';
  },
  fullHour(dateStr) {
    return `${this.hour(dateStr)} ${this.amPm(dateStr)}`;
  },
  date(dateStr) {
    return moment(dateStr).format('dddd, MMM  D YYYY');
  },
};

export default function date(format, dateStr) {
  return methods[format](dateStr);
}
