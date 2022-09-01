import moment from 'moment'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'
const MONTH_FORMAT = 'YYYY-MM'
const YEAR_FORMAT = 'YYYY'
const TIME_FORMAT = 'HH:mm:ss'
const HOUR_FORMAT = 'HH'

export default {
  parseDay(date) {
    if (date) {
      return date.format(DATE_TIME_FORMAT)
    }
    return date.format(DATE_TIME_FORMAT)
  },
  date(date, format) {
    if (date) {
      return moment(date).format(format || DATE_TIME_FORMAT)
    }
    return moment().format(format || DATE_TIME_FORMAT)
  },
  day(date) {
    if (date) {
      return moment(date).format(DATE_FORMAT)
    }
    return moment().format(DATE_FORMAT)
  },
  month(date) {
    if (date) {
      return moment(date).format(MONTH_FORMAT)
    }
    return moment().format(MONTH_FORMAT)
  },
  year(date) {
    if (date) {
      return moment(date).format(YEAR_FORMAT)
    }
    return moment().format(YEAR_FORMAT)
  },
  hour(date) {
    if (date) {
      return moment(date).format(HOUR_FORMAT)
    }
    return moment().format(HOUR_FORMAT)
  },
  beforeDay(date, num = 1) {
    if (date) {
      return moment(date).subtract(num, 'days').format(DATE_FORMAT)
    }
    return moment().subtract(num, 'days').format(DATE_FORMAT)
  },
  afterDay(date, num = 1) {
    if (date) {
      return moment(date).add(num, 'days').format(DATE_FORMAT)
    }
    return moment().add(num, 'days').format(DATE_FORMAT)
  },
  time(date) {
    if (date) {
      return moment(date).format(TIME_FORMAT)
    }
    return moment().format(TIME_FORMAT)
  },
  unix(date) {
    if (date) {
      return moment(date).unix()
    }
    return moment().unix()
  },
  dayDiff(dateStart, dateEnd) {
    return moment(dateEnd).diff(moment(dateStart), 'day')
  },
  minuteDiff(startDate, endDate, type = 'minute') {
    return moment(endDate).diff(moment(startDate), type)
  },
  getMinutes(date) {
    let time = moment(date)
    return time.hours() * 60 + time.minutes()
  },
  beforeMonth(date, num = 1) {
    if (date) {
      return moment(date).subtract(num, 'months').format(MONTH_FORMAT)
    }
    return moment().subtract(num, 'months').format(MONTH_FORMAT)
  },
  afterMonth(date, num = 1) {
    if (date) {
      return moment(date).add(num, 'months').format(MONTH_FORMAT)
    }
    return moment().add(num, 'months').format(MONTH_FORMAT)
  },
  lastMonth(date) {
    return this.beforeMonth(date)
  },
  getMonthDays(date) {
    return moment(date).daysInMonth();
  }
}
